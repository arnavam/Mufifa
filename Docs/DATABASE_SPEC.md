# DATABASE_SPEC.md

# FIFA World Cup 2026 ML Prediction Challenge

## Database Specification

Version: 1.0

---

# Database Engine

PostgreSQL (Supabase)

Requirements:

* UUID primary keys
* Foreign key constraints
* Row Level Security enabled
* Proper indexing
* Audit logging
* Soft delete where appropriate

---

# ENUMS

## UserRole

```sql
participant
admin
```

## MatchStatus

```sql
scheduled
live
completed
cancelled
```

## TournamentStage

```sql
group_stage
round_of_32
round_of_16
quarter_final
semi_final
third_place
final
```

---

# TABLE: profiles

Purpose:

Stores application user metadata linked to Supabase Auth.

Columns:

```sql
id UUID PRIMARY KEY
```

References:

```sql
auth.users(id)
```

Additional Columns:

```sql
email TEXT NOT NULL UNIQUE

role UserRole NOT NULL DEFAULT 'participant'

is_active BOOLEAN NOT NULL DEFAULT TRUE

created_at TIMESTAMPTZ NOT NULL

updated_at TIMESTAMPTZ NOT NULL
```

Indexes:

```sql
email
role
```

---

# TABLE: teams

Purpose:

Competition team identity.

Each authenticated user owns one team.

Columns:

```sql
id UUID PRIMARY KEY

owner_id UUID NOT NULL

team_name TEXT NOT NULL UNIQUE

submission_locked BOOLEAN NOT NULL DEFAULT FALSE

created_at TIMESTAMPTZ NOT NULL

updated_at TIMESTAMPTZ NOT NULL
```

Foreign Keys:

```sql
owner_id -> profiles.id
```

Indexes:

```sql
team_name
owner_id
```

Constraints:

```sql
one user owns one team
```

---

# TABLE: matches

Purpose:

Stores FIFA World Cup matches.

Columns:

```sql
id UUID PRIMARY KEY

match_code TEXT NOT NULL UNIQUE

stage TournamentStage NOT NULL

home_team TEXT NOT NULL

away_team TEXT NOT NULL

kickoff_time TIMESTAMPTZ NOT NULL

status MatchStatus NOT NULL

multiplier NUMERIC(4,2) NOT NULL

created_at TIMESTAMPTZ NOT NULL

updated_at TIMESTAMPTZ NOT NULL
```

Indexes:

```sql
match_code

stage

status

kickoff_time
```

Default Multipliers:

```sql
group_stage = 1.0

round_of_32 = 1.2

round_of_16 = 1.5

quarter_final = 2.0

semi_final = 3.0

third_place = 2.5

final = 5.0
```

---

# TABLE: submissions

Purpose:

Stores uploaded prediction file metadata.

Columns:

```sql
id UUID PRIMARY KEY

team_id UUID NOT NULL

file_path TEXT NOT NULL

file_name TEXT NOT NULL

uploaded_at TIMESTAMPTZ NOT NULL

is_valid BOOLEAN NOT NULL

validation_errors JSONB

locked_at TIMESTAMPTZ
```

Foreign Keys:

```sql
team_id -> teams.id
```

Constraints:

```sql
one submission per team
```

Unique:

```sql
team_id
```

---

# TABLE: predictions

Purpose:

Stores prediction data for every match.

Columns:

```sql
id UUID PRIMARY KEY

team_id UUID NOT NULL

match_id UUID NOT NULL

winner TEXT

home_score INTEGER

away_score INTEGER

extra_time_home INTEGER

extra_time_away INTEGER

penalty_home INTEGER

penalty_away INTEGER

goal_scorers JSONB

first_goal_scorer TEXT

possession_home NUMERIC(5,2)

possession_away NUMERIC(5,2)

shots_home INTEGER

shots_away INTEGER

xg_home NUMERIC(5,2)

xg_away NUMERIC(5,2)

yellow_home INTEGER

yellow_away INTEGER

red_home INTEGER

red_away INTEGER

confidence INTEGER

created_at TIMESTAMPTZ NOT NULL
```

Foreign Keys:

```sql
team_id -> teams.id

match_id -> matches.id
```

Unique:

```sql
(team_id, match_id)
```

Indexes:

```sql
team_id

match_id
```

---

# TABLE: champion_predictions

Purpose:

Stores predicted tournament winner.

Columns:

```sql
id UUID PRIMARY KEY

team_id UUID NOT NULL UNIQUE

champion TEXT NOT NULL

created_at TIMESTAMPTZ NOT NULL
```

Foreign Keys:

```sql
team_id -> teams.id
```

---

# TABLE: actual_results

Purpose:

Official results entered by admins.

Columns:

```sql
id UUID PRIMARY KEY

match_id UUID NOT NULL UNIQUE

winner TEXT

home_score INTEGER

away_score INTEGER

extra_time_home INTEGER

extra_time_away INTEGER

penalty_home INTEGER

penalty_away INTEGER

goal_scorers JSONB

first_goal_scorer TEXT

possession_home NUMERIC(5,2)

possession_away NUMERIC(5,2)

shots_home INTEGER

shots_away INTEGER

xg_home NUMERIC(5,2)

xg_away NUMERIC(5,2)

yellow_home INTEGER

yellow_away INTEGER

red_home INTEGER

red_away INTEGER

updated_by UUID

updated_at TIMESTAMPTZ NOT NULL
```

Foreign Keys:

```sql
match_id -> matches.id

updated_by -> profiles.id
```

Indexes:

```sql
match_id
```

---

# TABLE: scoring_rules

Purpose:

Admin configurable scoring system.

Columns:

```sql
id UUID PRIMARY KEY

rule_key TEXT NOT NULL UNIQUE

rule_name TEXT NOT NULL

points INTEGER NOT NULL

is_enabled BOOLEAN NOT NULL DEFAULT TRUE

updated_at TIMESTAMPTZ NOT NULL
```

Default Rules:

```sql
correct_winner = 20

correct_draw = 20

exact_scoreline = 40

correct_goal_difference = 15

one_team_score_correct = 10

correct_scorer = 10

correct_goal_count = 10

exact_scorer_list = 25

possession_accuracy = 10

shots_accuracy = 10

xg_accuracy = 10

yellow_cards_accuracy = 5

red_cards_exact = 10

penalty_winner = 20

penalty_score = 30

confidence_bonus = 10

confidence_penalty = -10

champion_prediction = 250
```

---

# TABLE: leaderboard

Purpose:

Pre-calculated rankings.

Columns:

```sql
id UUID PRIMARY KEY

team_id UUID NOT NULL UNIQUE

rank INTEGER

total_score NUMERIC(10,2)

accuracy_percentage NUMERIC(5,2)

winner_score NUMERIC(10,2)

scoreline_score NUMERIC(10,2)

scorer_score NUMERIC(10,2)

stats_score NUMERIC(10,2)

champion_score NUMERIC(10,2)

confidence_score NUMERIC(10,2)

updated_at TIMESTAMPTZ NOT NULL
```

Foreign Keys:

```sql
team_id -> teams.id
```

Indexes:

```sql
rank

total_score DESC
```

---

# TABLE: analytics_cache

Purpose:

Stores precomputed analytics.

Columns:

```sql
id UUID PRIMARY KEY

metric_key TEXT UNIQUE

metric_value JSONB

updated_at TIMESTAMPTZ
```

---

# TABLE: audit_logs

Purpose:

Tracks administrative actions.

Columns:

```sql
id UUID PRIMARY KEY

actor_id UUID

action TEXT

entity_type TEXT

entity_id UUID

payload JSONB

created_at TIMESTAMPTZ NOT NULL
```

Indexes:

```sql
actor_id

entity_type

created_at
```

---

# ROW LEVEL SECURITY

## profiles

Participant:

Read own record.

Admin:

Read all.

---

## teams

Participant:

Read own team.

Admin:

Read all.

---

## predictions

Participant:

Read own predictions.

Admin:

Read all predictions.

---

## submissions

Participant:

Read own submission.

Admin:

Read all submissions.

---

## actual_results

Public:

Read.

Admin:

Create / Update.

---

## leaderboard

Public:

Read.

Admin:

Read.

---

## analytics_cache

Public:

Read.

Admin:

Update.

---

## scoring_rules

Public:

Read.

Admin:

Update.

---

# STORAGE

Bucket:

prediction-files

Structure:

```text
prediction-files/
    team-id/
        predictions.csv
```

Permissions:

Participant:

Upload own file.

Admin:

Read all files.

Public:

No access.

---

# DATABASE INDEXING REQUIREMENTS

Create indexes for:

```sql
leaderboard.total_score

matches.stage

matches.status

predictions.team_id

predictions.match_id

actual_results.match_id

audit_logs.created_at
```

---

# DATABASE DESIGN RULES

Do not modify schema without migration.

Do not store derived scores in prediction rows.

Leaderboard is generated.

Analytics are cached.

All primary keys must use UUID.

All timestamps must use TIMESTAMPTZ.

Enable Row Level Security on every table.

Use cascading deletes only where explicitly required.
