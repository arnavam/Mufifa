import { describe, it, expect } from 'vitest'
import { validateCsv } from '../lib/csv/validator'

describe('Validator Match-Count Behavior', () => {
  const baseRow = {
    home_team: 'Team A',
    away_team: 'Team B',
    predicted_winner: 'Team A',
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
    tournament_champion: 'Team A',
    __requiresChampion: true
  }

  it('VALIDATOR-001: 5 matches -> validator expects exactly 5', () => {
    const validMatches = Array.from({ length: 5 }, (_, i) => ({
      match_code: `M_${i}`,
      home_team: 'Team A',
      away_team: 'Team B'
    }))

    // Provide 5 matches
    const rows5 = validMatches.map(m => ({ ...baseRow, match_id: m.match_code }))
    const result5 = validateCsv(rows5 as unknown as import("../types/predictions").CsvRow[], validMatches)
    expect(result5.valid).toBe(true)
    expect(result5.predictions).toHaveLength(5)

    // Provide 4 matches (missing 1)
    const rows4 = rows5.slice(0, 4)
    const result4 = validateCsv(rows4 as unknown as import("../types/predictions").CsvRow[], validMatches)
    expect(result4.valid).toBe(false)
    expect(result4.errors.some(e => e.message.includes('Missing predictions'))).toBe(true)

    // Provide 6 matches (1 extra)
    const rows6 = [...rows5, { ...baseRow, match_id: 'M_5' }]
    const result6 = validateCsv(rows6 as unknown as import("../types/predictions").CsvRow[], validMatches)
    expect(result6.valid).toBe(false)
    expect(result6.errors.some(e => e.message.includes('Invalid match ID'))).toBe(true)
  })

  it('VALIDATOR-002: 10 matches -> validator expects exactly 10', () => {
    const validMatches = Array.from({ length: 10 }, (_, i) => ({
      match_code: `M_${i}`,
      home_team: 'Team A',
      away_team: 'Team B'
    }))

    const rows = validMatches.map(m => ({ ...baseRow, match_id: m.match_code }))
    const result = validateCsv(rows as unknown as import("../types/predictions").CsvRow[], validMatches)
    expect(result.valid).toBe(true)
    expect(result.predictions).toHaveLength(10)
  })

  it('VALIDATOR-003: 32 matches -> validator expects exactly 32', () => {
    const validMatches = Array.from({ length: 32 }, (_, i) => ({
      match_code: `M_${i}`,
      home_team: 'Team A',
      away_team: 'Team B'
    }))

    const rows = validMatches.map(m => ({ ...baseRow, match_id: m.match_code }))
    const result = validateCsv(rows as unknown as import("../types/predictions").CsvRow[], validMatches)
    expect(result.valid).toBe(true)
    expect(result.predictions).toHaveLength(32)
  })
})
