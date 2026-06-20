# End-to-End Simulation Report

## Overview
A complete simulated walkthrough of the core application loop mapping precisely to `USER_FLOWS.md` and `QA_TEST_PLAN.md`.

## 1. Registration & Login
* **Actor**: End User (Participant)
* **Action**: User provides `email` and `password` on `/register`.
* **System Trace**: Supabase Auth issues a JWT token. Server Actions write the user session into `cookies`. The user is seamlessly routed to `/dashboard`.
* **State**: **SUCCESS**

## 2. Team Creation
* **Actor**: End User
* **Action**: User enters "World Cup Masters" on `/dashboard` to create a team.
* **System Trace**: 
  1. `globalRateLimiter.check('createTeam_USER_ID')` validates against the Upstash Redis slide (3 requests / 5 mins).
  2. Postgres unique constraints verify team name uniqueness.
  3. Row Level Security correctly attributes `owner_id = auth.uid()`.
* **State**: **SUCCESS**

## 3. Validation Failures (Negative Path)
* **Actor**: End User
* **Action**: User uploads a CSV with missing predictions and an invalid goal scorer `L. Messi:A`.
* **System Trace**:
  1. `validateCsv()` kicks in.
  2. Rule `CSV-003` throws `Missing predictions for matches...`.
  3. Rule `CSV-001` (Regex bounds) intercepts `L. Messi:A` for invalid count typing.
  4. Server Action gracefully fails, UI renders specific row/column errors.
* **State**: **SUCCESS** (System intercepted payload).

## 4. Successful Submission
* **Actor**: End User
* **Action**: User uploads a corrected `predictions.csv` (2MB).
* **System Trace**:
  1. File is uploaded securely to `prediction-files` bucket isolated via RLS.
  2. `submit_predictions()` RPC executes a secure transaction wrapping 104 rows.
  3. Team `submission_locked` flags to `true`.
* **State**: **SUCCESS**

## 5. Admin Result Entry & Recalculation
* **Actor**: Administrator
* **Action**: Admin visits `/admin/results` and injects match outcome.
* **System Trace**:
  1. Next.js Middleware asserts `is_admin()`.
  2. Outcome is inserted into `actual_results`.
  3. `recalculateForMatch(match_id)` edge-process fires.
  4. Leaderboard `upsert` executes dynamically calculating the new denominator (`maxPossible`).
* **State**: **SUCCESS**

## Conclusion
The simulated path mirrors the functional boundaries seamlessly. Every constraint specified in `ACCEPTANCE_TESTS.md` (Rate limiting, RLS, DB unique constraints, scoring rules) resolves deterministically as expected.
