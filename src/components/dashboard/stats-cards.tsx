import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Trophy, Lock, Unlock } from 'lucide-react'
import { formatScore, formatPercentage } from '@/lib/utils'

type SubmissionState = 'pending' | 'submitted' | 'closed' | 'locked'

interface StatsCardsProps {
  totalScore: number
  accuracy: number
  submissionState: SubmissionState
}

export function StatsCards({ totalScore, accuracy, submissionState }: StatsCardsProps) {
  const isOpenEditable = submissionState === 'submitted'
  const showLockIcon = submissionState === 'closed' || submissionState === 'locked'
  const statusLabel =
    submissionState === 'submitted' ? 'Submitted' :
    submissionState === 'closed' ? 'Closed' :
    submissionState === 'locked' ? 'Locked' :
    'Pending'
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="glass-panel border-accent/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Points</CardTitle>
          <Trophy className="w-4 h-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-mono">{formatScore(totalScore)}</div>
        </CardContent>
      </Card>
      
      <Card className="glass-panel border-secondary/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Overall Accuracy</CardTitle>
          <Target className="w-4 h-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-mono">{formatPercentage(accuracy)}</div>
        </CardContent>
      </Card>

      <Card className="glass-panel border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Submission Status</CardTitle>
          {showLockIcon ? (
            <Lock className="w-4 h-4 text-green-500" />
          ) : (
            <Unlock className="w-4 h-4 text-muted-foreground" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold mt-1">
            {isOpenEditable ? (
              <span className="text-accent">{statusLabel}</span>
            ) : showLockIcon ? (
              <span className="text-green-500">{statusLabel}</span>
            ) : (
              <span className="text-muted-foreground">{statusLabel}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
