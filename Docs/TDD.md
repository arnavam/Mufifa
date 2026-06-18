# FIFA World Cup 2026 ML Prediction Challenge

# Technical Design Document (TDD)

**Version:** 1.0

---

# 1. System Architecture

## Architecture Style

Monolithic Next.js Application

### Components

```text
Frontend
    ↓
Server Actions / API Routes
    ↓
Supabase
    ↓
PostgreSQL
```

---

# 2. Technology Stack

## Frontend

* Next.js 15 App Router
* TypeScript
* TailwindCSS
* shadcn/ui
* Recharts
* TanStack Table
* React Hook Form
* Zod

## Backend

* Supabase PostgreSQL
* Supabase Auth
* Supabase Storage
* Supabase Realtime

## Deployment

* Vercel

---

# 3. Folder Structure

```text
src/
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   ├── leaderboard/
│   ├── analytics/
│   ├── admin/
│   └── api/
│
├── components/
│   ├── ui/
│   ├── charts/
│   ├── tables/
│   ├── forms/
│   └── football/
│
├── lib/
│   ├── supabase/
│   ├── auth/
│   ├── validation/
│   ├── scoring/
│   ├── csv/
│   └── analytics/
│
├── types/
├── hooks/
└── actions/
```

---

# 4. Database Schema

## users

| Field      | Type        |
| ---------- | ----------- |
| id         | UUID PK     |
| email      | TEXT        |
| role       | TEXT        |
| created_at | TIMESTAMPTZ |

---

## teams

| Field             | Type        |
| ----------------- | ----------- |
| id                | UUID PK     |
| user_id           | UUID FK     |
| team_name         | TEXT        |
| submission_locked | BOOLEAN     |
| created_at        | TIMESTAMPTZ |

---

## matches

| Field        | Type        |
| ------------ | ----------- |
| id           | UUID PK     |
| match_code   | TEXT        |
| stage        | TEXT        |
| home_team    | TEXT        |
| away_team    | TEXT        |
| kickoff_time | TIMESTAMPTZ |
| status       | TEXT        |
| multiplier   | NUMERIC     |
| created_at   | TIMESTAMPTZ |

---

## predictions

| Field             | Type        |
| ----------------- | ----------- |
| id                | UUID PK     |
| team_id           | UUID FK     |
| match_id          | UUID FK     |
| winner            | TEXT        |
| home_score        | INTEGER     |
| away_score        | INTEGER     |
| extra_time_home   | INTEGER     |
| extra_time_away   | INTEGER     |
| penalty_home      | INTEGER     |
| penalty_away      | INTEGER     |
| goal_scorers      | JSONB       |
| first_goal_scorer | TEXT        |
| possession_home   | NUMERIC     |
| possession_away   | NUMERIC     |
| shots_home        | INTEGER     |
| shots_away        | INTEGER     |
| xg_home           | NUMERIC     |
| xg_away           | NUMERIC     |
| yellow_home       | INTEGER     |
| yellow_away       | INTEGER     |
| red_home          | INTEGER     |
| red_away          | INTEGER     |
| confidence        | INTEGER     |
| created_at        | TIMESTAMPTZ |

---

## champion_predictions

| Field      | Type        |
| ---------- | ----------- |
| id         | UUID PK     |
| team_id    | UUID FK     |
| champion   | TEXT        |
| created_at | TIMESTAMPTZ |

---

## actual_results

| Field             | Type        |
| ----------------- | ----------- |
| id                | UUID PK     |
| match_id          | UUID FK     |
| winner            | TEXT        |
| home_score        | INTEGER     |
| away_score        | INTEGER     |
| extra_time_home   | INTEGER     |
| extra_time_away   | INTEGER     |
| penalty_home      | INTEGER     |
| penalty_away      | INTEGER     |
| goal_scorers      | JSONB       |
| first_goal_scorer | TEXT        |
| possession_home   | NUMERIC     |
| possession_away   | NUMERIC     |
| shots_home        | INTEGER     |
| shots_away        | INTEGER     |
| xg_home           | NUMERIC     |
| xg_away           | NUMERIC     |
| yellow_home       | INTEGER     |
| yellow_away       | INTEGER     |
| red_home          | INTEGER     |
| red_away          | INTEGER     |
| updated_at        | TIMESTAMPTZ |

---

## scoring_rules

| Field      | Type        |
| ---------- | ----------- |
| id         | UUID PK     |
| rule_name  | TEXT        |
| rule_key   | TEXT        |
| points     | INTEGER     |
| enabled    | BOOLEAN     |
| updated_at | TIMESTAMPTZ |

---

## leaderboard

| Field               | Type        |
| ------------------- | ----------- |
| id                  | UUID PK     |
| team_id             | UUID FK     |
| total_score         | NUMERIC     |
| accuracy_percentage | NUMERIC     |
| winner_score        | NUMERIC     |
| scoreline_score     | NUMERIC     |
| scorer_score        | NUMERIC     |
| stats_score         | NUMERIC     |
| champion_score      | NUMERIC     |
| confidence_score    | NUMERIC     |
| rank                | INTEGER     |
| updated_at          | TIMESTAMPTZ |

---

## audit_logs

| Field       | Type        |
| ----------- | ----------- |
| id          | UUID PK     |
| actor_id    | UUID        |
| action      | TEXT        |
| entity_type | TEXT        |
| entity_id   | UUID        |
| payload     | JSONB       |
| created_at  | TIMESTAMPTZ |

---

# 5. Storage Design

## Bucket

```text
prediction-files
```

## Structure

```text
prediction-files/
└── team-id/
    └── submission.csv
```

### Access Rules

* Participants can upload their own file
* Admins can access all files
* Public users cannot access raw submissions

---

# 6. Authentication Flow

```text
Register
    ↓
Email Verification
    ↓
Login
    ↓
Create Team
    ↓
Upload Prediction
    ↓
Lock Submission
```

---

# 7. Authorization

## Participant

Access:

* Own Profile
* Own Submission
* Leaderboard
* Analytics

## Admin

Access:

* Full System Access

## Public

Access:

* Leaderboard
* Analytics

---

# 8. CSV Processing Pipeline

```text
Upload CSV
    ↓
Store File
    ↓
Validate Structure
    ↓
Validate Teams
    ↓
Validate Players
    ↓
Validate Match IDs
    ↓
Parse Records
    ↓
Insert Predictions
    ↓
Lock Submission
```

---

# 9. Validation Service

Use Zod.

### Checks

* Required Columns
* Duplicate Matches
* Negative Scores
* Confidence Range
* Player Names
* Possession Sum
* Champion Exists
* Match Count Complete

---

# 10. Scoring Engine

Location:

```text
lib/scoring
```

Functions:

```typescript
calculateWinnerScore()
calculateScorelineScore()
calculateScorerScore()
calculateStatsScore()
calculatePenaltyScore()
calculateChampionScore()
calculateConfidenceScore()
calculateTotalScore()
```

---

# 11. Recalculation Engine

## Triggered When

* Result Updated
* Scoring Rule Updated

## Workflow

```text
Load Teams
    ↓
Load Results
    ↓
Recalculate Scores
    ↓
Update Leaderboard
    ↓
Broadcast Realtime Event
```

---

# 12. Leaderboard Service

## Ranking Formula

```sql
ORDER BY
    total_score DESC,
    accuracy_percentage DESC,
    winner_score DESC,
    created_at ASC
```

---

# 13. Analytics Engine

Metrics:

* Winner Accuracy
* Score Accuracy
* Scorer Accuracy
* Champion Accuracy
* Average Confidence
* Hardest Match
* Easiest Match
* Most Accurate Team

---

# 14. Realtime Updates

Supabase Realtime Channels:

* leaderboard
* analytics
* results

Leaderboard refreshes automatically after recalculation.

---

# 15. Admin Pages

```text
/admin
/admin/matches
/admin/results
/admin/scoring
/admin/users
/admin/logs
```

---

# 16. Participant Pages

```text
/dashboard
/dashboard/upload
/dashboard/score
/dashboard/profile
```

---

# 17. Public Pages

```text
/
/leaderboard
/analytics
```

---

# 18. UI Components

* Leaderboard Table
* Rank Cards
* Score Breakdown Cards
* Analytics Charts
* CSV Upload Wizard
* Result Entry Form
* Scoring Rule Editor
* Match Management Table

---

# 19. Error Handling

* Invalid CSV
* Duplicate Submission
* Unauthorized Access
* Scoring Failure
* Missing Match Result
* Database Failure

---

# 20. Row Level Security

### teams

User owns team

### predictions

User owns prediction

### leaderboard

Public Read

### analytics

Public Read

### actual_results

Admin Write Only

### scoring_rules

Admin Write Only

---

# 21. Caching

Cache:

* Leaderboard
* Analytics
* Scoring Config

Invalidate On:

* Result Update
* Scoring Change

---

# 22. Testing Strategy

## Unit Tests

* CSV Validation
* Scoring Engine
* Statistics Calculations

## Integration Tests

* Submission Flow
* Authentication
* Admin Workflow

## E2E Tests

* Upload
* Leaderboard
* Analytics

---

# 23. Performance Requirements

| Metric           | Target |
| ---------------- | ------ |
| Leaderboard Load | < 2s   |
| Analytics Load   | < 3s   |
| CSV Validation   | < 5s   |
| Recalculation    | < 30s  |
| Participants     | 500+   |

---

# 24. Deployment

```text
GitHub
   ↓
Vercel
   ↓
Supabase
```

## Environment Variables

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
```

---

# 25. Production Readiness Checklist

* RLS Enabled
* Input Validation
* Error Boundaries
* Audit Logging
* Database Indexing
* Realtime Enabled
* Mobile Responsive
* Dark Theme
* Accessibility Checks
* Loading States
* Empty States
* Security Headers
* Rate Limiting
* CSV Validation
* Backup Strategy
