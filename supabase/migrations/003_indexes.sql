CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

CREATE INDEX idx_teams_team_name ON teams(team_name);
CREATE INDEX idx_teams_owner_id ON teams(owner_id);

CREATE INDEX idx_matches_match_code ON matches(match_code);
CREATE INDEX idx_matches_stage ON matches(stage);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_kickoff_time ON matches(kickoff_time);

CREATE INDEX idx_predictions_team_id ON predictions(team_id);
CREATE INDEX idx_predictions_match_id ON predictions(match_id);

CREATE INDEX idx_actual_results_match_id ON actual_results(match_id);

CREATE INDEX idx_leaderboard_rank ON leaderboard(rank);
CREATE INDEX idx_leaderboard_total_score ON leaderboard(total_score DESC);

CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
