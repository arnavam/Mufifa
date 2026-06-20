# Performance Audit Report

## 1. Missing Database Indexes
* **Severity**: High
* **File**: `DATABASE_SPEC.md` vs Current Schema
* **Root Cause**: The database lacks compound indexes for heavily queried paths, specifically `leaderboard.total_score`, `predictions.team_id`, and `actual_results.match_id`.
* **Impact**: Leaderboard queries and prediction validation queries will perform full table scans, resulting in severe degradation (>5s) as the dataset grows.
* **Proposed Fix**: Create a Supabase migration (`010_production_hardening.sql`) to add B-Tree indexes for all highly relational lookup columns.

## 2. Inefficient Recalculation Engine
* **Severity**: High
* **File**: `src/lib/scoring/engine.ts`
* **Root Cause**: Updating a match result triggers a recalculation for *all* teams. If done sequentially in memory, this will easily breach the `< 30s` requirement.
* **Impact**: Serverless functions may timeout during global recalculations.
* **Proposed Fix**: Implement bulk recalculation strategies utilizing Postgres RPC/Functions, or process calculations in parallel chunks. 

## 3. Client-Side Leaderboard Rendering
* **Severity**: Medium
* **File**: `src/components/leaderboard/leaderboard-table.tsx`
* **Root Cause**: Fetching the entire leaderboard and passing it to a client-side TanStack React Table instance.
* **Impact**: Once thousands of teams join, the DOM size and React hydration time will exceed the `< 2s` requirement, causing severe browser lag.
* **Proposed Fix**: Implement server-side pagination for the leaderboard, limiting payload size to top 100 per page.

## 4. Analytics Computation Lag
* **Severity**: Medium
* **File**: `src/app/analytics/page.tsx`
* **Root Cause**: "Hardest Match" and "Most Accurate Team" metrics are calculated on the fly by aggregating all rows in the `predictions` table.
* **Impact**: Analytics page load will exceed the `< 3s` threshold.
* **Proposed Fix**: Implement a materialized view or cron-triggered cache table (`analytics_cache`) as specified in the database spec to serve instant analytics reads.
