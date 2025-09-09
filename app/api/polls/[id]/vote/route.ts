import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const voteSchema = z.object({
  optionId: z.string().uuid(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    const { optionId } = voteSchema.parse(body)

    // Check if poll exists and is active
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('*')
      .eq('id', params.id)
      .eq('is_active', true)
      .single()

    if (pollError || !poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
    }

    // Check if poll has expired
    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Poll has expired' }, { status: 400 })
    }

    // Check if user has already voted (if authenticated)
    if (user) {
      const { data: existingVote } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', params.id)
        .eq('voter_id', user.id)
        .single()

      if (existingVote && !poll.allow_multiple_votes) {
        return NextResponse.json(
          { error: 'You have already voted on this poll' },
          { status: 400 }
        )
      }
    }

    // Create vote
    const voteData: any = {
      poll_id: params.id,
      option_id: optionId,
    }

    if (user) {
      voteData.voter_id = user.id
    } else {
      // For anonymous voting, use IP address
      const forwarded = request.headers.get('x-forwarded-for')
      const ip = forwarded ? forwarded.split(',')[0] : request.ip
      voteData.ip_address = ip
    }

    const { data: vote, error: voteError } = await supabase
      .from('votes')
      .insert(voteData)
      .select()
      .single()

    if (voteError) {
      return NextResponse.json({ error: voteError.message }, { status: 500 })
    }

    // Update analytics
    await supabase
      .from('poll_analytics')
      .update({
        total_votes: poll.poll_analytics?.[0]?.total_votes + 1 || 1,
        unique_voters: user 
          ? poll.poll_analytics?.[0]?.unique_voters + 1 || 1
          : poll.poll_analytics?.[0]?.unique_voters || 0,
        last_updated: new Date().toISOString(),
      })
      .eq('poll_id', params.id)

    return NextResponse.json(vote, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}