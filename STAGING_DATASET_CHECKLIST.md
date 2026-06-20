# Staging Dataset Validation Checklist

This checklist is explicitly designed to verify the transition from the legacy `M1-M7` seed testing environment to the official `GS_001 -> F_104` FIFA 2026 104-match topology.

Execute these steps precisely against your **Staging Environment** before pushing to Production.

## Phase 1: Database Initialization
- [ ] **1. Execute Seed Import:** Run `supabase db reset` on the staging environment. 
- [ ] **2. Verify Match Count:** Query the `matches` table to ensure exactly 104 rows exist.
- [ ] **3. Verify Match Codes:** Ensure the `match_code` column begins at `GS_001` and ends at `F_104`.
- [ ] **4. Verify Legacy Eradication:** Run `SELECT * FROM matches WHERE match_code LIKE 'M%'`. The result must be `0` rows.

## Phase 2: CSV Validator Pipeline
- [ ] **1. Fetch the Official Template:** Download `full_submission_template.csv`.
- [ ] **2. Populate Dummy Data:** Create 3 valid variations of the template (predicting different outcomes for `GS_001`).
- [ ] **3. Upload via UI:** As a staging participant, upload the CSV via `/dashboard`.
- [ ] **4. Verify Persistence:** Check the `predictions` table. You should see 104 rows successfully inserted for your `team_id`.
- [ ] **5. Validate Validator Rejection:** Attempt to upload an older `M1-M7` legacy CSV. Ensure the Next.js UI cleanly rejects the upload with `"Missing predictions for matches: GS_001, ..."`

## Phase 3: Admin Operations & Leaderboard
- [ ] **1. Result Entry:** Log in as an Admin and navigate to `/admin/results`.
- [ ] **2. Input Actuals:** Locate match `GS_001` and enter a valid scoreline (e.g., `2-1`).
- [ ] **3. Trigger Recalculation:** Press the **Recalculate Scores** button.
- [ ] **4. Verify Leaderboard:** Navigate to `/leaderboard` (public view). Ensure the 3 dummy teams you created in Phase 2 are ordered correctly based on the `GS_001` outcome.
- [ ] **5. Verify Vercel Cache:** Ensure the Next.js `revalidatePath` successfully updated the `/leaderboard` CDN cache without requiring a hard refresh.

## Architectural Sign-Off
I have audited the codebase. **Zero `M1-M7` assumptions remain in the repository code path.** The runtime dynamic validation strictly inherits boundaries from the Postgres `matches` table. As long as the staging database is properly reset with `fifa_2026_seed.sql`, the application will seamlessly enforce the 104-match structure.
