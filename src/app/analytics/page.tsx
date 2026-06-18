import { getTournamentAnalytics, getAllTeamsForSelect } from '@/actions/analytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AccuracyChart } from '@/components/charts/accuracy-chart'
import { ChampionDistribution } from '@/components/charts/champion-distribution'
import { ComparisonRadar } from '@/components/charts/comparison-radar'
import { Target, Users, Trophy } from 'lucide-react'
import { formatPercentage } from '@/lib/utils'

export const metadata = {
  title: "Analytics | µFifa '26",
  description: "Tournament analytics and predictive model insights",
}

export default async function AnalyticsPage() {
  const analytics = await getTournamentAnalytics()
  const teamsList = await getAllTeamsForSelect()

  return (
    <div className="container mx-auto py-10 px-4 space-y-10">
      <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
          Global Analytics
        </h1>
        <p className="text-lg text-muted-foreground">
          Dive deep into prediction trends, model accuracies, and tournament statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Avg Accuracy</CardTitle>
            <Target className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-foreground">
              {formatPercentage(analytics.avgAccuracy)}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-secondary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Best Model</CardTitle>
            <Trophy className="w-4 h-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground truncate mt-1">
              {analytics.bestTeam || 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Models</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-foreground">
              {analytics.totalTeams}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-panel border-border/50">
          <CardHeader>
            <CardTitle>Accuracy Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <AccuracyChart data={analytics.accuracyDistribution} />
          </CardContent>
        </Card>

        <Card className="glass-panel border-border/50">
          <CardHeader>
            <CardTitle>Champion Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <ChampionDistribution data={analytics.championChartData} />
          </CardContent>
        </Card>
      </div>

      <div className="pt-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Model Comparison</h2>
        <ComparisonRadar teamsList={teamsList} />
      </div>
    </div>
  )
}
