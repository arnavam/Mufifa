import { describe, it, expect } from 'vitest'
import { generateTemplate } from '../lib/csv/template-generator'
import { validateCsv } from '../lib/csv/validator'
import { parseCsvText } from '../lib/csv/parser'

describe('Template and Validator Compatibility', () => {
  it('TEMPLATE-001: Template generated is perfectly accepted by validator when filled', () => {
    // 1. Generate 10 dummy matches exactly like DB would provide
    const dummyMatches = Array.from({ length: 10 }, (_, i) => ({
      id: `uuid-${i}`,
      match_code: `M_${i}`,
      home_team: 'HomeTeam',
      away_team: 'AwayTeam',
      kickoff_time: new Date().toISOString(),
      stage: 'group_stage' as unknown as import("../types/predictions").CsvRow[],
      status: 'scheduled' as unknown as import("../types/predictions").CsvRow[],
      multiplier: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    // 2. Generate template
    const templateCsv = generateTemplate(dummyMatches)

    // 3. Parse it back (mimicking upload)
    const { rows, errors: parseErrors } = parseCsvText(templateCsv)
    expect(parseErrors).toHaveLength(0)

    // 4. Fill in required predictions to make it pass
    const filledRows = rows.map(row => ({
      ...row,
      predicted_winner: 'HomeTeam',
      predicted_home_score: '2',
      predicted_away_score: '1',
      predicted_possession_home: '50',
      predicted_possession_away: '50',
      predicted_shots_home: '10',
      predicted_shots_away: '8',
      predicted_xg_home: '1.5',
      predicted_xg_away: '0.8',
      predicted_yellow_home: '1',
      predicted_yellow_away: '2',
      predicted_red_home: '0',
      predicted_red_away: '0',
      predicted_extra_time_home: '',
      predicted_extra_time_away: '',
      predicted_penalty_home: '',
      predicted_penalty_away: '',
      predicted_goal_scorers: 'Player:1',
      predicted_first_goal_scorer: 'Player',
      confidence: '90',
      tournament_champion: 'HomeTeam',
      __requiresChampion: true
    }))

    // 5. Validate it
    const validMatchesInput = dummyMatches.map(m => ({
      match_code: m.match_code,
      home_team: m.home_team,
      away_team: m.away_team
    }))
    const result = validateCsv(filledRows as unknown as import("../types/predictions").CsvRow[], validMatchesInput)
    
    // 6. Must PASS
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
    expect(result.predictions).toHaveLength(10)
  })
})
