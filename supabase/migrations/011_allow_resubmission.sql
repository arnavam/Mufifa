-- 011_allow_resubmission.sql
-- Allow teams to resubmit (overwrite) their predictions until the global
-- submission_deadline. Previously submit_predictions() locked the team after
-- the first successful submission, making it one-shot.
--
-- Change vs 010: we no longer auto-set submission_locked = TRUE on submit.
-- The lock check is KEPT so that submission_locked remains a manual admin
-- override (e.g. to freeze a specific team), it is just no longer set
-- automatically. Resubmission cutoff is now enforced purely by the
-- competition_settings.submission_deadline check in the app layer.

CREATE OR REPLACE FUNCTION submit_predictions(
  p_team_id UUID,
  p_file_path TEXT,
  p_file_name TEXT,
  p_champion TEXT,
  p_predictions JSONB
) RETURNS BOOLEAN AS $$
DECLARE
  v_locked BOOLEAN;
BEGIN
  -- 1. Check if team has been manually locked by an admin
  SELECT submission_locked INTO v_locked FROM teams WHERE id = p_team_id FOR UPDATE;
  IF v_locked THEN
    RAISE EXCEPTION 'Team submission is locked.';
  END IF;

  -- 2. Upsert champion prediction
  IF p_champion IS NOT NULL AND p_champion != '' THEN
    INSERT INTO champion_predictions (team_id, champion)
    VALUES (p_team_id, p_champion)
    ON CONFLICT (team_id) DO UPDATE SET champion = EXCLUDED.champion;
  END IF;

  -- 3. Clear existing predictions so the new file fully replaces them
  DELETE FROM predictions WHERE team_id = p_team_id;

  -- 4. Insert predictions
  INSERT INTO predictions (
    team_id,
    match_id,
    winner,
    home_score,
    away_score,
    extra_time_home,
    extra_time_away,
    penalty_home,
    penalty_away,
    goal_scorers,
    first_goal_scorer,
    possession_home,
    possession_away,
    shots_home,
    shots_away,
    xg_home,
    xg_away,
    yellow_home,
    yellow_away,
    red_home,
    red_away,
    confidence
  )
  SELECT
    p_team_id,
    (p->>'match_id')::UUID,
    p->>'winner',
    (p->>'home_score')::INTEGER,
    (p->>'away_score')::INTEGER,
    (p->>'extra_time_home')::INTEGER,
    (p->>'extra_time_away')::INTEGER,
    (p->>'penalty_home')::INTEGER,
    (p->>'penalty_away')::INTEGER,
    CASE WHEN (p->>'goal_scorers') IS NULL THEN NULL ELSE (p->'goal_scorers')::JSONB END,
    p->>'first_goal_scorer',
    (p->>'possession_home')::NUMERIC,
    (p->>'possession_away')::NUMERIC,
    (p->>'shots_home')::INTEGER,
    (p->>'shots_away')::INTEGER,
    (p->>'xg_home')::NUMERIC,
    (p->>'xg_away')::NUMERIC,
    (p->>'yellow_home')::INTEGER,
    (p->>'yellow_away')::INTEGER,
    (p->>'red_home')::INTEGER,
    (p->>'red_away')::INTEGER,
    (p->>'confidence')::INTEGER
  FROM jsonb_array_elements(p_predictions) AS p;

  -- 5. Record submission. The submissions table has UNIQUE(team_id), so a team
  --    has a single row that we overwrite on each (re)submission. Failed-upload
  --    attempts may have already created this row, so we upsert rather than insert.
  INSERT INTO submissions (team_id, file_path, file_name, is_valid, validation_errors, locked_at)
  VALUES (p_team_id, p_file_path, p_file_name, TRUE, NULL, NOW())
  ON CONFLICT (team_id) DO UPDATE SET
    file_path = EXCLUDED.file_path,
    file_name = EXCLUDED.file_name,
    is_valid = TRUE,
    validation_errors = NULL,
    uploaded_at = NOW(),
    locked_at = NOW();

  -- 6. (Removed) No longer auto-lock the team here — resubmission is allowed
  --    until the deadline. submission_locked stays a manual admin control.

  -- 7. Setup initial leaderboard entry
  INSERT INTO leaderboard (team_id) VALUES (p_team_id)
  ON CONFLICT (team_id) DO NOTHING;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
