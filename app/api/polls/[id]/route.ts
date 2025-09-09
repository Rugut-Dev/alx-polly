import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data: poll, error } = await supabase
      .from('polls')
      .select(`
        *,
        poll_options(*),
        profiles(username, full_name),
        poll_analytics(total_votes, unique_voters),
        votes(*)
      `)
      .eq('id', params.id)
      .eq('is_public', true)
      .eq('is_active', true)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(poll)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}