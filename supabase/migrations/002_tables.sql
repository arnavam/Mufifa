-- 1. profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role user_role DEFAULT 'participant',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  team_name TEXT NOT NULL UNIQUE,
  submission_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_code TEXT NOT NULL UNIQUE,
  stage tournament_stage NOT NULL,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  kickoff_time TIMESTAMPTZ NOT NULL,
  status match_status DEFAULT 'scheduled',
  multiplier NUMERIC(4,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL UNIQUE REFERENCES teams(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_valid BOOLEAN NOT NULL,
  validation_errors JSONB,
  locked_at TIMESTAMPTZ
);

-- 5. predictions table
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  winner TEXT,
  home_score INTEGER,
  away_score INTEGER,
  extra_time_home INTEGER,
  extra_time_away INTEGER,
  penalty_home INTEGER,
  penalty_away INTEGER,
  goal_scorers JSONB,
  first_goal_scorer TEXT,
  possession_home NUMERIC(5,2),
  possession_away NUMERIC(5,2),
  shots_home INTEGER,
  shots_away INTEGER,
  xg_home NUMERIC(5,2),
  xg_away NUMERIC(5,2),
  yellow_home INTEGER,
  yellow_away INTEGER,
  red_home INTEGER,
  red_away INTEGER,
  confidence INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, match_id)
);

-- 6. champion_predictions table
CREATE TABLE champion_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL UNIQUE REFERENCES teams(id) ON DELETE CASCADE,
  champion TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. actual_results table
CREATE TABLE actual_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL UNIQUE REFERENCES matches(id) ON DELETE CASCADE,
  winner TEXT,
  home_score INTEGER,
  away_score INTEGER,
  extra_time_home INTEGER,
  extra_time_away INTEGER,
  penalty_home INTEGER,
  penalty_away INTEGER,
  goal_scorers JSONB,
  first_goal_scorer TEXT,
  possession_home NUMERIC(5,2),
  possession_away NUMERIC(5,2),
  shots_home INTEGER,
  shots_away INTEGER,
  xg_home NUMERIC(5,2),
  xg_away NUMERIC(5,2),
  yellow_home INTEGER,
  yellow_away INTEGER,
  red_home INTEGER,
  red_away INTEGER,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. scoring_rules table
CREATE TABLE scoring_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_key TEXT NOT NULL UNIQUE,
  rule_name TEXT NOT NULL,
  points INTEGER NOT NULL,
  is_enabled BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. leaderboard table
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL UNIQUE REFERENCES teams(id) ON DELETE CASCADE,
  rank INTEGER,
  total_score NUMERIC(10,2) DEFAULT 0,
  accuracy_percentage NUMERIC(5,2) DEFAULT 0,
  winner_score NUMERIC(10,2) DEFAULT 0,
  scoreline_score NUMERIC(10,2) DEFAULT 0,
  scorer_score NUMERIC(10,2) DEFAULT 0,
  stats_score NUMERIC(10,2) DEFAULT 0,
  champion_score NUMERIC(10,2) DEFAULT 0,
  confidence_score NUMERIC(10,2) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. analytics_cache table
CREATE TABLE analytics_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key TEXT UNIQUE NOT NULL,
  metric_value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. audit_logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
