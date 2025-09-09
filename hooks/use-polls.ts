'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/supabase-provider'
import type { Database } from '@/types/database'

type Poll = Database['public']['Tables']['polls']['Row'] & {
  poll_options: Database['public']['Tables']['poll_options']['Row'][]
  profiles: Database['public']['Tables']['profiles']['Row']
  votes?: Database['public']['Tables']['votes']['Row'][]
}

export function usePolls() {
  const { supabase } = useSupabase()
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPolls = async () => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .select(`
          *,
          poll_options(*),
          profiles(username, full_name),
          votes(*)
        `)
        .eq('is_public', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      setPolls(data || [])
    } catch (error) {
      console.error('Error fetching polls:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPolls()
  }, [])

  const createPoll = async (pollData: {
    title: string
    description?: string
    options: string[]
    expiresAt?: string
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Create poll
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .insert({
          title: pollData.title,
          description: pollData.description,
          author_id: user.id,
          expires_at: pollData.expiresAt,
        })
        .select()
        .single()

      if (pollError) throw pollError

      // Create poll options
      const options = pollData.options.map((text, index) => ({
        poll_id: poll.id,
        text,
        order_index: index,
      }))

      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(options)

      if (optionsError) throw optionsError

      // Create analytics record
      await supabase
        .from('poll_analytics')
        .insert({
          poll_id: poll.id,
          total_views: 0,
          total_votes: 0,
          unique_voters: 0,
        })

      return poll
    } catch (error) {
      console.error('Error creating poll:', error)
      throw error
    }
  }

  const voteOnPoll = async (pollId: string, optionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const voteData: any = {
        poll_id: pollId,
        option_id: optionId,
      }

      if (user) {
        voteData.voter_id = user.id
      } else {
        // For anonymous voting, we could use IP address
        // This would require additional logic to prevent duplicate votes
      }

      const { error } = await supabase
        .from('votes')
        .insert(voteData)

      if (error) throw error

      return true
    } catch (error) {
      console.error('Error voting on poll:', error)
      throw error
    }
  }

  return {
    polls,
    loading,
    createPoll,
    voteOnPoll,
    refetch: fetchPolls,
  }
}