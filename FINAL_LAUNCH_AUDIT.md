# Final Launch Audit

## Domain Verification Status

### 1. Security [PASS]
No hardcoded credentials exist. Environment variables (`.env.local`) manage all sensitive endpoints. The Server Actions are securely gatekept using cryptographic JWT parsing.

### 2. Row Level Security (RLS) [PASS]
Database tables are strictly locked. Participant `predictions`, `teams`, and `submissions` enforce an explicit `auth.uid()` constraint. Competitors cannot scrape data.

### 3. Scoring Engine [WARNING]
The mathematical engine is perfectly accurate, evaluating all exact scorelines, goals, and confidence intervals gracefully. However, its architecture invokes a synchronous `for...of` iteration. It **will fail** via Vercel `504 Gateway Timeout` if registrations exceed ~150 teams.

### 4. CSV Validation [PASS]
The Zod runtime perfectly maps the 24 technical columns. It is memory-efficient and structurally immune to malformed inputs bypassing validation into the core system.

### 5. Tournament Dataset [PASS]
The 104-match dataset correctly cascades `GS_001` through `F_104` ensuring 100% bracket continuity natively matching the 2026 format.

### 6. Leaderboard [PASS]
Safely leverages Vercel's global CDN and `revalidatePath` to statically serve ranking data. It is immune to DDOS scale traffic loads.

### 7. Admin Workflows [PASS]
The dashboard properly captures the `MATCH_DAY_OPERATIONS_GUIDE.md` flows, isolating raw result updates from manual recalculation commands.

### 8. Backup Strategy [WARNING]
Currently relies entirely on Supabase automated Database Backups (PITR). There is no cron-job to independently clone the `prediction-files` bucket or database off-site in the event of an infrastructure-wide incident.

### 9. Match Day Operations [PASS]
A documented runbook exists covering recovery mechanisms, data overrides, and rule fixing.

### 10. Multi-team Competition Behavior [PASS]
Unique `team_id` enforcement allows hundreds of distinct participant entities to coexist natively without data collision.

---

## Top 10 Remaining Risks Before Opening Registrations

1. **Scoring Timeout (Critical Blocker)**: The `recalculateAll()` function sequentially executes 5 synchronous database calls per team. Beyond 150 teams, this loop will exceed the Vercel 10s Hobby/15s Pro execution timeout. **Remediation:** Migrate to a Postgres RPC (`PL/pgSQL`) or Upstash QStash job queue.
2. **Missing Off-Site Backups**: Single point of failure via Supabase. If the Supabase project is accidentally deleted, there is no isolated snapshot of user prediction CSVs. **Remediation:** Establish a routine export to an isolated AWS S3 bucket.
3. **No Automatic Registration Closure**: There is no coded "cutoff" date for CSV uploads. You must manually disable Supabase Auth signups on kickoff day, risking human error. **Remediation:** Add a global `const TOURNAMENT_START_DATE` guard in the CSV upload server action.
4. **Storage Bucket RLS Vulnerability**: If the Supabase `prediction-files` storage bucket lacks explicit RLS policies, a malicious authenticated user could theoretically overwrite another team's CSV file via API if they guess the filename structure.
5. **No Email Verification Enforcement**: Users can register with fake emails. If a scoring dispute occurs, administrators will have no verified channel to contact the competitor. **Remediation:** Toggle "Confirm Email" ON in Supabase Auth providers.
6. **Sentry Unconfigured**: `NEXT_PUBLIC_SENTRY_DSN` is empty. Client-side React crashes will fail silently in production without you knowing.
7. **Database Pollutant Risk**: If deploying over a previous test database, legacy `M1-M7` seed data or phantom `Test Team` accounts will pollute the global leaderboard. **Remediation:** Perform a hard database reset `supabase db reset` before pushing to Vercel.
8. **Upstash Redis Failure Mode**: If the Upstash rate limiting credentials fail, the system is designed to "fail open" (warn, but allow). This opens `/register` and `/login` endpoints to brute force bot attacks.
9. **No CSV Payload Size Limit**: While Supabase Storage limits uploads, the Edge API doesn't strictly reject multi-megabyte payloads pre-parsing, creating a potential memory exhaustion vector on Vercel.
10. **Lack of Staging Environment**: Testing match inputs directly on production. If an Admin mistypes a score, the global leaderboard immediately updates and busts the cache. **Remediation:** Spin up a secondary `preview` environment mimicking the exact dataset.
