'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/components/providers/supabase-provider'
import type { Database } from '@/types/database'

type Vote = Database['public']['Tables']['votes']['Row']

export function useRealtimeVotes(pollId: string) {
  const { supabase } = useSupabase()
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial votes
    const fetchVotes = async () => {
      try {
        const { data, error } = await supabase
          .from('votes')
          .select('*')
          .eq('poll_id', pollId)

        if (error) throw error

        setVotes(data || [])
      } catch (error) {
        console.error('Error fetching votes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVotes()

    // Set up real-time subscription
    const channel = supabase
      .channel(`poll-${pollId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes',
          filter: `poll_id=eq.${pollId}`,
        },
        (payload) => {
          console.log('Real-time vote update:', payload)
          
          if (payload.eventType === 'INSERT') {
            setVotes(prev => [...prev, payload.new as Vote])
          } else if (payload.eventType === 'UPDATE') {
            setVotes(prev => 
              prev.map(vote => 
                vote.id === payload.new.id ? payload.new as Vote : vote
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setVotes(prev => 
              prev.filter(vote => vote.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [pollId, supabase])

  // Calculate vote counts by option
  const voteCounts = votes.reduce((acc, vote) => {
    acc[vote.option_id] = (acc[vote.option_id] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalVotes = votes.length

  return {
    votes,
    voteCounts,
    totalVotes,
    loading,
  }
}

export function useRealtimePolls() {
  const { supabase } = useSupabase()
  const [polls, setPolls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial polls
    const fetchPolls = async () => {
      try {
        const { data, error } = await supabase
          .from('polls')
          .select(`
            *,
            poll_options(*),
            profiles(username, full_name)
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

    fetchPolls()

    // Set up real-time subscription for new polls
    const channel = supabase
      .channel('polls')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'polls',
          filter: 'is_public=eq.true',
        },
        (payload) => {
          console.log('New poll created:', payload)
          // Fetch the new poll with its options and author
          supabase
            .from('polls')
            .select(`
              *,
              poll_options(*),
              profiles(username, full_name)
            `)
            .eq('id', payload.new.id)
            .single()
            .then(({ data, error }) => {
              if (!error && data) {
                setPolls(prev => [data, ...prev])
              }
            })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return {
    polls,
    loading,
  }
}