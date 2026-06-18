import { getUsers, toggleUserStatus } from '@/actions/admin/users'
import { DataTable } from '@/components/leaderboard/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Manage Users | Admin | µFifa '26"
}

export default async function UsersPage() {
  const { rows } = await getUsers(1, 100)

  // Map to flat structure for table
  const formattedData = rows.map((u: any) => ({
    id: u.id,
    email: u.email,
    role: u.role,
    is_active: u.is_active,
    created_at: u.created_at,
    team_name: u.teams?.[0]?.team_name || 'No Team',
    submission_locked: u.teams?.[0]?.submission_locked || false,
    has_submission: !!u.teams?.[0]?.submissions?.[0]
  }))

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div className="font-medium">{row.getValue('email')}</div>
    },
    {
      accessorKey: 'team_name',
      header: 'Team',
      cell: ({ row }) => <div className="text-secondary">{row.getValue('team_name')}</div>
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge variant={row.getValue('role') === 'admin' ? 'destructive' : 'secondary'}>
          {row.getValue('role')}
        </Badge>
      )
    },
    {
      accessorKey: 'status',
      header: 'Submission',
      cell: ({ row }) => {
        const locked = row.original.submission_locked
        const hasSub = row.original.has_submission
        if (locked) return <Badge className="bg-green-500 hover:bg-green-600 text-white">Locked</Badge>
        if (hasSub) return <Badge variant="outline">Uploaded</Badge>
        return <Badge variant="secondary" className="text-muted-foreground">Pending</Badge>
      }
    },
    {
      accessorKey: 'created_at',
      header: 'Registered',
      cell: ({ row }) => <div className="text-muted-foreground text-sm">{formatDate(row.getValue('created_at'))}</div>
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original
        // Server Action via form
        const toggleAction = toggleUserStatus.bind(null, user.id, user.is_active)
        
        return (
          <form action={toggleAction}>
            <Button 
              variant={user.is_active ? 'outline' : 'default'} 
              size="sm" 
              className={!user.is_active ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
              disabled={user.role === 'admin'}
            >
              {user.is_active ? 'Disable' : 'Enable'}
            </Button>
          </form>
        )
      }
    }
  ]

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
          <p className="text-muted-foreground">View participants, teams, and submission statuses.</p>
        </div>
        <Button variant="outline">Export CSV</Button>
      </div>

      <div className="glass-panel p-1 rounded-xl">
        <DataTable columns={columns} data={formattedData} />
      </div>
    </div>
  )
}
