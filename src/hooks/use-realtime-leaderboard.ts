'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useRealtimeLeaderboard() {
  const router = useRouter()
  const supabase = createClient()
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    // Listen to changes on the leaderboard table
    const channel = supabase
      .channel('leaderboard_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'leaderboard'
        },
        (payload) => {
          console.log('Leaderboard updated via realtime:', payload)
          setIsUpdating(true)
          
          // Refresh the current route to fetch new data
          router.refresh()
          
          // Optional: Show a subtle toast that data was refreshed
          toast.success('Leaderboard updated', {
            description: 'New match results have been processed.',
            duration: 3000,
            position: 'top-center'
          })

          setTimeout(() => setIsUpdating(false), 1000)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

  return { isUpdating }
}
