'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 text-center space-y-8">
      <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
        <AlertTriangle className="w-12 h-12 text-destructive" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Yellow Card!</h2>
        <p className="text-muted-foreground">Something went wrong while loading this page.</p>
      </div>
      
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="outline" className="border-border/50">
          <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
        </Button>
        <Link href="/">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 neon-border-green">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
