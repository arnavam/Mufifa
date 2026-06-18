import { z } from 'zod'
import { CsvRow, ParsedPrediction, ValidationResult } from '@/types/predictions'
import { parseGoalScorers } from './parser'

const predictionRowSchema = z.object({
  match_id: z.string().min(1, "Match ID is required"),
  predicted_winner: z.string().min(1, "Predicted winner is required"),
  predicted_home_score: z.string().regex(/^\d+$/, "Home score must be a positive integer"),
  predicted_away_score: z.string().regex(/^\d+$/, "Away score must be a positive integer"),
  predicted_extra_time_home: z.string().regex(/^\d*$/, "Extra time home score must be a positive integer or empty").optional(),
  predicted_extra_time_away: z.string().regex(/^\d*$/, "Extra time away score must be a positive integer or empty").optional(),
  predicted_penalty_home: z.string().regex(/^\d*$/, "Penalty home score must be a positive integer or empty").optional(),
  predicted_penalty_away: z.string().regex(/^\d*$/, "Penalty away score must be a positive integer or empty").optional(),
  predicted_possession_home: z.string().regex(/^\d+(\.\d+)?$/, "Possession must be a number"),
  predicted_possession_away: z.string().regex(/^\d+(\.\d+)?$/, "Possession must be a number"),
  predicted_shots_home: z.string().regex(/^\d+$/, "Shots must be a positive integer"),
  predicted_shots_away: z.string().regex(/^\d+$/, "Shots must be a positive integer"),
  predicted_xg_home: z.string().regex(/^\d+(\.\d+)?$/, "xG must be a number"),
  predicted_xg_away: z.string().regex(/^\d+(\.\d+)?$/, "xG must be a number"),
  predicted_yellow_home: z.string().regex(/^\d+$/, "Yellow cards must be a positive integer"),
  predicted_yellow_away: z.string().regex(/^\d+$/, "Yellow cards must be a positive integer"),
  predicted_red_home: z.string().regex(/^\d+$/, "Red cards must be a positive integer"),
  predicted_red_away: z.string().regex(/^\d+$/, "Red cards must be a positive integer"),
  confidence: z.string().regex(/^(100|[1-9]?[0-9])$/, "Confidence must be between 0 and 100"),
})

export function validateCsv(
  rows: CsvRow[], 
  validMatchIds: string[]
): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    predictions: [],
    champion: ''
  }

  const seenMatches = new Set<string>()

  // Assume the first row contains the champion prediction for simplicity, 
  // or that it's consistent across rows. We'll take the first valid one.
  if (rows.length > 0 && rows[0].tournament_champion) {
    result.champion = rows[0].tournament_champion.trim()
  } else {
    result.valid = false
    result.errors.push({
      row: 1,
      column: 'tournament_champion',
      message: 'Tournament champion prediction is missing in the first row'
    })
  }

  rows.forEach((row, index) => {
    const rowNumber = index + 2 // 1-indexed, accounting for header

    // Base schema validation
    const parsed = predictionRowSchema.safeParse(row)
    if (!parsed.success) {
      result.valid = false
      parsed.error.issues.forEach(err => {
        result.errors.push({
          row: rowNumber,
          column: err.path[0] as string,
          message: err.message
        })
      })
      return // Skip further validation for this row if base fails
    }

    // Match ID validation
    if (!validMatchIds.includes(row.match_id)) {
      result.valid = false
      result.errors.push({
        row: rowNumber,
        column: 'match_id',
        message: `Invalid match ID: ${row.match_id}`
      })
    }

    // Duplicate match validation
    if (seenMatches.has(row.match_id)) {
      result.valid = false
      result.errors.push({
        row: rowNumber,
        column: 'match_id',
        message: `Duplicate prediction for match: ${row.match_id}`
      })
    }
    seenMatches.add(row.match_id)

    // Possession validation (must sum to 100)
    const possHome = parseFloat(row.predicted_possession_home)
    const possAway = parseFloat(row.predicted_possession_away)
    if (Math.abs(possHome + possAway - 100) > 0.1) {
      result.valid = false
      result.errors.push({
        row: rowNumber,
        column: 'predicted_possession_home/away',
        message: `Possession must sum to 100. Got ${possHome} + ${possAway}`
      })
    }

    // Map to ParsedPrediction if valid so far (we collect them even if some rows fail, 
    // but we won't insert to DB unless result.valid is true)
    if (result.valid) {
      result.predictions.push({
        match_id: row.match_id,
        winner: row.predicted_winner,
        home_score: parseInt(row.predicted_home_score, 10),
        away_score: parseInt(row.predicted_away_score, 10),
        extra_time_home: row.predicted_extra_time_home ? parseInt(row.predicted_extra_time_home, 10) : null,
        extra_time_away: row.predicted_extra_time_away ? parseInt(row.predicted_extra_time_away, 10) : null,
        penalty_home: row.predicted_penalty_home ? parseInt(row.predicted_penalty_home, 10) : null,
        penalty_away: row.predicted_penalty_away ? parseInt(row.predicted_penalty_away, 10) : null,
        goal_scorers: parseGoalScorers(row.predicted_goal_scorers),
        first_goal_scorer: row.predicted_first_goal_scorer || null,
        possession_home: possHome,
        possession_away: possAway,
        shots_home: parseInt(row.predicted_shots_home, 10),
        shots_away: parseInt(row.predicted_shots_away, 10),
        xg_home: parseFloat(row.predicted_xg_home),
        xg_away: parseFloat(row.predicted_xg_away),
        yellow_home: parseInt(row.predicted_yellow_home, 10),
        yellow_away: parseInt(row.predicted_yellow_away, 10),
        red_home: parseInt(row.predicted_red_home, 10),
        red_away: parseInt(row.predicted_red_away, 10),
        confidence: parseInt(row.confidence, 10)
      })
    }
  })

  // Missing matches validation
  const missingMatches = validMatchIds.filter(id => !seenMatches.has(id))
  if (missingMatches.length > 0) {
    result.valid = false
    result.errors.push({
      row: 0, // General error
      column: 'match_id',
      message: `Missing predictions for matches: ${missingMatches.join(', ')}`
    })
  }

  return result
}
