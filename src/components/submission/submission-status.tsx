import { Badge } from '@/components/ui/badge'
import { Lock, FileEdit, Clock, CheckCircle2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface SubmissionStatusProps {
  isLocked: boolean
  lockedAt?: string | null
  predictionCount?: number
  hasSubmitted?: boolean
}

export function SubmissionStatus({ isLocked, lockedAt, predictionCount = 0, hasSubmitted = false }: SubmissionStatusProps) {
  // Admin has manually locked this team — no further edits allowed
  if (isLocked) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-accent/10 border border-accent/30 rounded-lg neon-border-green">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <div className="p-2 bg-accent/20 rounded-full">
            <Lock className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-bold text-foreground flex items-center gap-2">
              Submission Locked
              <Badge variant="outline" className="text-accent border-accent">Locked</Badge>
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" /> Last submitted {lockedAt ? formatDate(lockedAt) : 'Unknown'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold font-mono text-foreground">{predictionCount}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Predictions Saved</div>
        </div>
      </div>
    )
  }

  // Team has a saved submission but can still update it before the deadline
  if (hasSubmitted) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-card/60 backdrop-blur border border-border/50 rounded-lg">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <div className="p-2 bg-accent/20 rounded-full">
            <CheckCircle2 className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-bold text-foreground flex items-center gap-2">
              Submission Saved
              <Badge variant="outline" className="text-accent border-accent">Editable</Badge>
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" /> Last updated {lockedAt ? formatDate(lockedAt) : 'Unknown'} · re-upload to change
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold font-mono text-foreground">{predictionCount}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Predictions Saved</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3 p-4 bg-card/60 backdrop-blur border border-border/50 rounded-lg">
      <div className="p-2 bg-muted rounded-full">
        <FileEdit className="w-5 h-5 text-muted-foreground" />
      </div>
      <div>
        <h3 className="font-bold text-foreground">Awaiting Submission</h3>
        <p className="text-sm text-muted-foreground">Your team has not submitted any predictions yet.</p>
      </div>
    </div>
  )
}
