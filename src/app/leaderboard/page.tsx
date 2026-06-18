import { getLeaderboard } from '@/actions/leaderboard'
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table'
import { Podium } from '@/components/leaderboard/podium'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Leaderboard | µFifa '26",
  description: "Global leaderboard for the ML Prediction Challenge",
}

export default async function LeaderboardPage() {
  const { rows, totalCount } = await getLeaderboard(1, 100)

  // Top 3 for podium
  const top3 = rows.slice(0, 3)
  
  return (
    <div className="container mx-auto py-10 px-4 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
          Global Leaderboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Real-time ranking of all prediction models based on accuracy against actual match outcomes.
        </p>
      </div>

      {rows.length > 0 ? (
        <>
          <Podium topTeams={top3} />
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">All Rankings</h2>
            <LeaderboardTable data={rows} />
          </div>
        </>
      ) : (
        <div className="text-center py-20 glass-panel border-border/50 rounded-2xl">
          <p className="text-muted-foreground text-lg">No predictions have been scored yet.</p>
          <p className="text-sm text-muted-foreground mt-2">Check back after the first match concludes!</p>
        </div>
      )}
    </div>
  )
}
