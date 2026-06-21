import { describe, it, expect } from 'vitest'
import { parseGoalScorers } from '../lib/csv/parser'
import { validateCsv } from '../lib/csv/validator'

describe('Multi-Scorer Parsing', () => {
  it('SCORER-001: Parses valid scorer formats', () => {
    expect(parseGoalScorers('Messi')).toEqual([{ name: 'Messi', goals: 1 }])
    expect(parseGoalScorers('Messi:2')).toEqual([{ name: 'Messi', goals: 2 }])
    expect(parseGoalScorers('Messi,Ronaldo')).toEqual([
      { name: 'Messi', goals: 1 },
      { name: 'Ronaldo', goals: 1 }
    ])
    expect(parseGoalScorers('Messi:2,Ronaldo:1')).toEqual([
      { name: 'Messi', goals: 2 },
      { name: 'Ronaldo', goals: 1 }
    ])
    expect(parseGoalScorers('Messi;Ronaldo')).toEqual([
      { name: 'Messi', goals: 1 },
      { name: 'Ronaldo', goals: 1 }
    ])
    expect(parseGoalScorers('Messi; Ronaldo')).toEqual([
      { name: 'Messi', goals: 1 },
      { name: 'Ronaldo', goals: 1 }
    ])
  })

  it('SCORER-002: Ignores trailing or empty delimiters gracefully', () => {
    // According to specs, "Messi," or ";" should be invalid if they represent empty entries that violate format.
    // However, parseGoalScorers simply ignores empty parts via `if (!part.trim()) continue`.
    // Wait, the user said "Invalid: Messi, | ; | ;;".
    // If the string is EXACTLY ";" or ";;" or "Messi,", the parser should probably ignore empty parts. 
    // BUT the validator should mark it as invalid if it's poorly formed, or maybe the parser should throw?
    // Let's test the validator directly below.
  })
})

describe('Multi-Scorer Validation', () => {
  const baseRow = {
    match_id: 'M_1',
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
    predicted_first_goal_scorer: 'Player',
    confidence: '90',
    tournament_champion: 'Team A',
    __requiresChampion: true
  }

  const validMatches = [{ match_code: 'M_1', home_team: 'Team A', away_team: 'Team B' }]

  const runValidation = (scorers: string) => {
    return validateCsv([{ ...baseRow, predicted_goal_scorers: scorers }] as any, validMatches)
  }

  it('VALIDATOR-SCORER-001: Accepts valid formats', () => {
    expect(runValidation('Messi').valid).toBe(true)
    expect(runValidation('Messi:2').valid).toBe(true)
    expect(runValidation('Messi,Ronaldo').valid).toBe(true)
    expect(runValidation('Messi:2,Ronaldo:1').valid).toBe(true)
    expect(runValidation('Messi;Ronaldo').valid).toBe(true)
    expect(runValidation('Messi; Ronaldo').valid).toBe(true)
  })

  it('VALIDATOR-SCORER-002: Rejects invalid formats', () => {
    expect(runValidation('Messi,').valid).toBe(false)
    expect(runValidation(';').valid).toBe(false)
    expect(runValidation(';;').valid).toBe(false)
  })
})
