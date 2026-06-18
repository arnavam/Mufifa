import Papa from 'papaparse'
import { CSV_COLUMNS } from '../constants'
import { Database } from '@/types/database'

type MatchRow = Database['public']['Tables']['matches']['Row']

export function generateTemplate(matches: MatchRow[]): string {
  const templateRows = matches.map(match => {
    const row: Record<string, string> = {}
    
    // Initialize all columns with empty strings
    CSV_COLUMNS.forEach(col => {
      row[col] = ''
    })
    
    // Pre-fill known data
    row.match_id = match.match_code
    row.home_team = match.home_team
    row.away_team = match.away_team
    
    return row
  })

  return Papa.unparse(templateRows, {
    header: true,
    columns: CSV_COLUMNS
  })
}
