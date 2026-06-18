export interface ScoringRule {
  rule_key: string;
  rule_name: string;
  points: number;
  is_enabled: boolean;
}

export interface MatchScoreBreakdown {
  outcome: number;
  scoreline: number;
  scorer: number;
  stats: number;
  penalty: number;
  confidence: number;
}

export interface MatchScoreResult {
  total: number;
  multipliedTotal: number;
  breakdown: MatchScoreBreakdown;
  multiplier: number;
  maxPossible: number;
}

export interface TeamScoreBreakdown {
  winner_score: number;
  scoreline_score: number;
  scorer_score: number;
  stats_score: number;
  champion_score: number;
  confidence_score: number;
}

export interface LeaderboardEntry {
  rank: number | null;
  team_name: string;
  team_id: string;
  total_score: number;
  accuracy_percentage: number;
  breakdown: TeamScoreBreakdown;
  submission_date: string;
}
