# Production Gap Analysis

## 1. Lack of Automated Test Suite
* **Severity**: Critical
* **Gap**: The project lacks a configured testing framework (`vitest` or `jest`) and has no automated test coverage for core business logic.
* **Impact**: Prevents CI/CD validation. Logic regressions cannot be caught before deployment.
* **Proposed Fix**: Install `vitest`, set up test runners, and translate `ACCEPTANCE_TESTS.md` into executable unit and integration tests. Target >90% coverage.

## 2. Non-Transactional Submission Workflow
* **Severity**: Critical
* **Gap**: The `uploadSubmission` action in `src/actions/submission.ts` performs sequential Supabase inserts (`predictions`, `champion_predictions`, `teams` locking).
* **Impact**: If a network failure occurs halfway through, the database enters an inconsistent state (partial predictions stored, but team not locked). No rollback mechanism exists.
* **Proposed Fix**: Migrate the insertion logic to a Supabase RPC (Stored Procedure) to guarantee atomic database transactions and automatic rollback on failure.

## 3. Missing Sentry Error Tracking
* **Severity**: High
* **Gap**: No application performance monitoring or error tracking is installed.
* **Impact**: Production runtime errors will fail silently in the browser or be lost in Vercel function logs, making debugging incredibly difficult.
* **Proposed Fix**: Install `@sentry/nextjs` and configure error boundaries and API route handlers.

## 4. Lack of Structured Logging
* **Severity**: Medium
* **Gap**: `console.log` is used arbitrarily.
* **Impact**: Hard to parse logs for specific correlation IDs or audit trails in a production logging environment.
* **Proposed Fix**: Implement `pino` for JSON structured logging. Use it exclusively for critical server actions and error catching.

## 5. Submission Deadline Enforcement
* **Severity**: High
* **Gap**: There is no hardcoded or database-driven deadline check preventing uploads after the tournament begins.
* **Impact**: Users could upload predictions after the first match kicks off.
* **Proposed Fix**: Add a strict timestamp check against a `config` variable or the first match's `kickoff_time` to permanently disable submissions platform-wide.
