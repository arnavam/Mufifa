import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Trophy, Lock, Unlock } from 'lucide-react'
import { formatScore, formatPercentage } from '@/lib/utils'

interface StatsCardsProps {
  totalScore: number
  accuracy: number
  predictionsLocked: boolean
}

export function StatsCards({ totalScore, accuracy, predictionsLocked }: StatsCardsProps) {
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
          {predictionsLocked ? (
            <Lock className="w-4 h-4 text-green-500" />
          ) : (
            <Unlock className="w-4 h-4 text-muted-foreground" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold mt-1">
            {predictionsLocked ? (
              <span className="text-green-500">Locked</span>
            ) : (
              <span className="text-muted-foreground">Pending</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
