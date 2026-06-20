# Official Match Day Runbook

This runbook acts as the standard operating procedure (SOP) for administering the µFifa '26 platform during live tournament operations.

## 1. Opening Registrations
**Procedure:**
Registrations are natively open by default. Ensure that Supabase Authentication is enabled (Email/Password) and that your Vercel URL is live. 
*To announce*: Distribute the `full_submission_template.csv` to your audience.

## 2. Closing Registrations
**Procedure:**
To establish a hard deadline and prevent new accounts from bypassing deadlines:
1. Open your **Supabase Dashboard** -> **Authentication** -> **Providers**.
2. Toggle off **Email** login (or disable new signups).
*Alternative*: Use Vercel Edge Middleware to explicitly redirect the `/register` route to a `Registration Closed` holding page.

## 3. Entering Match Results
**Procedure:**
As matches finish in the real world:
1. Navigate to `https://yourdomain.com/admin/results`.
2. Locate the specific match code (e.g., `GS_001`).
3. Enter the final **Home Score** and **Away Score**.
4. Click **Submit**.

## 4. Recalculating Scores
**Procedure:**
1. **Automatic**: Submitting a result natively triggers the Edge Calculator to recompute points for all affected teams and cascades into a global leaderboard re-rank.
2. **Manual Force**: Navigate to `https://yourdomain.com/admin` and click the red **"Recalculate All Scores"** button to force a master aggregation against the active `scoring_rules`.

## 5. Handling Participant Disputes
**Procedure:**
If a participant claims the Leaderboard has awarded them the wrong points:
1. Verify their raw data: Navigate to Supabase **Storage** -> `prediction-files`. Download their original, cryptographically stamped `.csv` file.
2. Verify system interpretation: Cross-reference the CSV against the `predictions` database table.
3. If the CSV matches the database but the score is wrong, the issue is within `scoring_rules`.

## 6. Unlocking a Team
**Procedure:**
If a team uploads a corrupted file or requests a mulligan prior to kickoff, you must manually reset their lock state:
1. Open Supabase **SQL Editor**.
2. Execute:
```sql
UPDATE teams SET submission_locked = FALSE WHERE team_name = 'The Target Team Name';
-- Optionally delete their flawed predictions:
DELETE FROM predictions WHERE team_id = (SELECT id FROM teams WHERE team_name = 'The Target Team Name');
DELETE FROM submissions WHERE team_id = (SELECT id FROM teams WHERE team_name = 'The Target Team Name');
```

## 7. Correcting an Incorrect Result
**Procedure:**
If an admin accidentally inputs the wrong score (e.g., France 1 - 2 Brazil, instead of 2 - 1):
1. Navigate back to `/admin/results`.
2. Locate the match (it will say `Result Entered`).
3. Input the *correct* scoreline and submit.
4. **Resolution**: The `adminUpdateMatchResult` server action utilizes an `UPSERT` on the `actual_results` table. It will silently overwrite the bad data and automatically trigger a clean recalculation for all teams.

## 8. Recovering from a Bad Scoring Rule Update
**Procedure:**
If a scoring rule was modified (e.g., Champion points accidentally set to 500 instead of 50):
1. Navigate to `/admin/scoring` (or use the Supabase UI).
2. Correct the point value for the specific rule.
3. Navigate to `/admin`.
4. Click **"Recalculate All Scores"**. The engine will dump the previous leaderboard cache and mathematically reconstruct the entire tournament using the fixed ruleset.

## 9. Restoring a Backup
**Procedure:**
In the event of catastrophic data corruption or accidental admin deletions:
1. Navigate to **Supabase Dashboard** -> **Database** -> **Backups**.
2. If on a Pro plan, utilize **PITR (Point in Time Recovery)** to rewind the exact state of the database to an hour prior to the incident.
3. The Vercel frontend is entirely stateless; once the database restores, simply click the **"Recalculate All Scores"** button on the Admin Dashboard to re-sync the caches.
