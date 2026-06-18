import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity } from 'lucide-react'
import { Database } from '@/types/database'
import { formatDate } from '@/lib/utils'

type AuditLog = Database['public']['Tables']['audit_logs']['Row']

export function RecentActivity({ logs }: { logs: AuditLog[] }) {
  if (logs.length === 0) {
    return (
      <Card className="glass-panel border-border/50 h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-muted-foreground" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-panel border-border/50 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="flex flex-col space-y-1 pb-4 border-b border-border/50 last:border-0">
              <span className="text-sm font-medium text-foreground capitalize">
                {log.action.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(log.created_at)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
