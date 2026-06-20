# Admin Operations Guide

## 1. Identity & Authorization
### User Creation
Admin users are provisioned by registering a standard account via the `/register` public endpoint.

### Role Storage
Roles are securely stored in the `public.profiles` database table inside the `role` column, utilizing the `user_role` ENUM (`'participant'` or `'admin'`).

### Promotion SQL
To promote an account, execute this query within the Supabase SQL Editor:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin-email@example.com';
```
*(Note: The user must log out and log back in to refresh their active JWT claim).*

### Security Boundary
All admin-level Server Actions and UI routes are gatekept by `requireAdmin()` (located in `src/actions/admin/require-admin.ts`). It performs a server-side DB fetch against the `profiles` table to cryptographically verify the role before executing logic.

## 2. Navigating the Dashboard
Once promoted, administrators can access the protected control plane by visiting `/admin`.

## 3. Managing Matches
Matches can be created, edited, and deleted using the built-in UI at `/admin/matches`. Alternatively, matches can be rapidly batched into the system using direct SQL into the `public.matches` table.

## 4. Entering Official Results
Administrators visit `/admin/results`. This page lists all matches grouped by status. The admin inputs the final `home_score` and `away_score`. The `adminUpdateMatchResult` server action safely transacts this into the `actual_results` table.

## 5. Recalculation Architecture
### Scoring Engine
When an admin submits a result, `adminUpdateMatchResult` seamlessly calls `recalculateForMatch(matchId)` in the background. It dynamically loops through all team predictions for that specific match and executes the pure mathematical evaluation logic against the active `scoring_rules`.
### Leaderboard Re-Ranking
The system then drops into `recalculateAll()`, which aggregates total scores, resolves ties via locked timestamp priority (`submissions(locked_at)`), updates the `leaderboard` table, and triggers a `revalidatePath('/leaderboard')` to instantly invalidate the Next.js cache for the public.

## 6. Development & Testing Reset
To reset a specific "Test Team" back to an unlocked state to test CSV validation again, execute the following SQL in Supabase:
```sql
BEGIN;
  -- Wipe historical prediction data
  DELETE FROM submissions WHERE team_id = (SELECT id FROM teams WHERE team_name = 'Test Team');
  DELETE FROM predictions WHERE team_id = (SELECT id FROM teams WHERE team_name = 'Test Team');
  DELETE FROM champion_predictions WHERE team_id = (SELECT id FROM teams WHERE team_name = 'Test Team');
  DELETE FROM leaderboard WHERE team_id = (SELECT id FROM teams WHERE team_name = 'Test Team');
  
  -- Unlock the dashboard
  UPDATE teams SET submission_locked = FALSE WHERE team_name = 'Test Team';
COMMIT;
```
