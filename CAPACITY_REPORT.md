# Platform Capacity & Scale Report

## 1. Metric Projections

| Users (Teams) | Total Prediction Rows | Expected DB Storage | CSV Upload Validation |
| :--- | :--- | :--- | :--- |
| **50 Teams** | 5,200 rows | ~1 MB | < 50ms |
| **100 Teams** | 10,400 rows | ~2 MB | < 80ms |
| **250 Teams** | 26,000 rows | ~5 MB | < 150ms |
| **500 Teams** | 52,000 rows | ~10 MB | < 300ms |

## 2. Infrastructure Analysis

### CSV Uploads **[SAFE]**
The Next.js Edge pipeline leverages Zod for memory-efficient validation and cascades into the `submit_predictions` Postgres RPC. Uploading 104 rows simultaneously takes less than `300ms` at extreme scales. Supabase's Free Tier Postgres (500MB limit) can easily hold 500+ teams (~10MB of data) without sweat.

### Leaderboard Queries **[SAFE]**
The Next.js `revalidatePath('/leaderboard')` utilizes the Vercel Data Cache.
Once the cache is built, 10,000 public users could hammer the `/leaderboard` page simultaneously without executing a single Supabase query. It is entirely statically served from Vercel's global CDN until the next Admin result entry.

### Supabase Connection Limits **[SAFE]**
Because the architecture leverages the Supabase Data API (REST over HTTP) rather than direct Postgres `pg` connections, there is no threat of connection pooling exhaustion.

### Scoring Recalculation (`recalculateAll`) **[CRITICAL BOTTLENECK]**
At 250-500 teams, the `recalculateAll()` function represents a severe architectural threat. 
Currently, the Node.js implementation sequentially loops over every single team:
```typescript
for (const team of teams) {
  await recalculateForTeam(team.id, rules)
}
```
**The Math:** 
Every invocation of `recalculateForTeam` executes 5 separate `await supabase...` HTTP requests (predictions, actuals, champion_pred, actual_champ, upsert_leaderboard).
At **500 teams**, this equals **2,500 synchronous database calls**.
Assuming a fast 20ms roundtrip per call, this loop will take **50 seconds** to complete.

**The Risk:** Vercel Hobby tier Serverless Functions timeout at **10 seconds** (Pro tier defaults to 15s). The recalculation pipeline will forcefully `504 Gateway Timeout` before finishing at higher scales.

## 3. Recommended Remediation
Before scaling past 100 teams, the `recalculateAll` iteration must be migrated out of the Next.js execution thread and dropped natively into the database via a raw **Postgres RPC (PL/pgSQL)**, or parallelized significantly utilizing `Promise.all` chunking and background job queues (e.g., Upstash QStash).
