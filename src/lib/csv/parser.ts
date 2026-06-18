import Papa from 'papaparse'
import { CsvRow, GoalScorer } from '@/types/predictions'
import { CSV_COLUMNS } from '../constants'

export function parseCsvText(text: string): { rows: CsvRow[]; errors: string[] } {
  const result = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  })

  const errors: string[] = []
  
  // Check if required columns exist
  const uploadedColumns = result.meta.fields || []
  const missingColumns = CSV_COLUMNS.filter(col => !uploadedColumns.includes(col))
  
  if (missingColumns.length > 0) {
    errors.push(`Missing required columns: ${missingColumns.join(', ')}`)
  }

  // Map to strongly typed array, parsing strings
  const rows = result.data as CsvRow[]

  return { rows, errors }
}

export function parseGoalScorers(str: string): GoalScorer[] {
  if (!str || str.trim() === '') return []
  
  const scorers: GoalScorer[] = []
  const parts = str.split(';')
  
  for (const part of parts) {
    if (!part.trim()) continue
    
    const [name, countStr] = part.split(':')
    if (name && countStr) {
      const goals = parseInt(countStr.trim(), 10)
      if (!isNaN(goals) && goals > 0) {
        scorers.push({ name: name.trim(), goals })
      }
    }
  }
  
  return scorers
}
