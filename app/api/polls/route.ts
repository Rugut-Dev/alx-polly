import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createPollSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  options: z.array(z.string().min(1).max(100)).min(2).max(10),
  expiresAt: z.string().datetime().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: polls, error } = await supabase
      .from('polls')
      .select(`
        *,
        poll_options(*),
        profiles(username, full_name),
        poll_analytics(total_votes, unique_voters)
      `)
      .eq('is_public', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(polls)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createPollSchema.parse(body)

    // Create poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: validatedData.title,
        description: validatedData.description,
        author_id: user.id,
        expires_at: validatedData.expiresAt,
      })
      .select()
      .single()

    if (pollError) {
      return NextResponse.json({ error: pollError.message }, { status: 500 })
    }

    // Create poll options
    const options = validatedData.options.map((text, index) => ({
      poll_id: poll.id,
      text,
      order_index: index,
    }))

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(options)

    if (optionsError) {
      return NextResponse.json({ error: optionsError.message }, { status: 500 })
    }

    // Create analytics record
    await supabase
      .from('poll_analytics')
      .insert({
        poll_id: poll.id,
        total_views: 0,
        total_votes: 0,
        unique_voters: 0,
      })

    return NextResponse.json(poll, { status: 201 })
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