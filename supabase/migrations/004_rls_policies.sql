-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE champion_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE actual_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- profiles
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (is_admin());

-- teams
CREATE POLICY "Users can read own team" ON teams
  FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Users can insert own team" ON teams
  FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Admins can read all teams" ON teams
  FOR SELECT USING (is_admin());

-- matches
CREATE POLICY "Matches are viewable by everyone" ON matches
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage matches" ON matches
  FOR ALL USING (is_admin());

-- submissions
CREATE POLICY "Users can read own submissions" ON submissions
  FOR SELECT USING (
    team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid())
  );
CREATE POLICY "Users can insert own submissions" ON submissions
  FOR INSERT WITH CHECK (
    team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid())
  );
CREATE POLICY "Admins can read all submissions" ON submissions
  FOR SELECT USING (is_admin());

-- predictions
CREATE POLICY "Users can read own predictions" ON predictions
  FOR SELECT USING (
    team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid())
  );
CREATE POLICY "Users can insert own predictions" ON predictions
  FOR INSERT WITH CHECK (
    team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid())
  );
CREATE POLICY "Admins can read all predictions" ON predictions
  FOR SELECT USING (is_admin());

-- champion_predictions
CREATE POLICY "Users can read own champion prediction" ON champion_predictions
  FOR SELECT USING (
    team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid())
  );
CREATE POLICY "Users can insert own champion prediction" ON champion_predictions
  FOR INSERT WITH CHECK (
    team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid())
  );
CREATE POLICY "Admins can read all champion predictions" ON champion_predictions
  FOR SELECT USING (is_admin());

-- actual_results
CREATE POLICY "Results are viewable by everyone" ON actual_results
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage actual results" ON actual_results
  FOR ALL USING (is_admin());

-- scoring_rules
CREATE POLICY "Scoring rules are viewable by everyone" ON scoring_rules
  FOR SELECT USING (true);
CREATE POLICY "Admins can update scoring rules" ON scoring_rules
  FOR UPDATE USING (is_admin());

-- leaderboard
CREATE POLICY "Leaderboard is viewable by everyone" ON leaderboard
  FOR SELECT USING (true);

-- analytics_cache
CREATE POLICY "Analytics are viewable by everyone" ON analytics_cache
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage analytics" ON analytics_cache
  FOR ALL USING (is_admin());

-- audit_logs
CREATE POLICY "Admins can read audit logs" ON audit_logs
  FOR SELECT USING (is_admin());
CREATE POLICY "System can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true); -- Usually inserted via service role, but allowing authenticated for now
