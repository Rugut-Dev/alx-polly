'use client'

import { useSupabase } from '@/components/providers/supabase-provider'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export function useAuth() {
  const { supabase, user, loading } = useSupabase()
  const router = useRouter()

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Successfully signed in!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('An unexpected error occurred')
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Check your email for the confirmation link!')
    } catch (error) {
      toast.error('An unexpected error occurred')
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Successfully signed out!')
      router.push('/')
    } catch (error) {
      toast.error('An unexpected error occurred')
    }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}