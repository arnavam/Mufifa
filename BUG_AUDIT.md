# Bug Audit Report

## 1. CSV Row-Level Validation Failure
* **Severity**: High
* **File**: `src/lib/csv/validator.ts`
* **Root Cause**: The current `validateCsv` function fails the entire submission if a single row has a formatting error, rather than isolating row-level validation.
* **Impact**: Participants with one minor typo in a non-essential column cannot submit their predictions, violating the "Row-level validation only" requirement.
* **Proposed Fix**: Restructure `validateCsv` to collect errors per row and only reject the specific invalid properties, allowing the rest of the parsing to proceed so comprehensive error reporting can be delivered.

## 2. Possession Total Validation Missing
* **Severity**: Medium
* **File**: `src/lib/csv/validator.ts`
* **Root Cause**: The parser extracts `possession_home` and `possession_away` but does not enforce that their sum equals exactly 100.
* **Impact**: Participants can submit statistically impossible possession metrics (e.g., 60% and 60%).
* **Proposed Fix**: Add a strict check: `if (home_poss + away_poss !== 100) error()`.

## 3. Duplicate and Missing Match Detection
* **Severity**: High
* **File**: `src/lib/csv/validator.ts`
* **Root Cause**: The validation logic only maps over the provided CSV rows but doesn't check if the total distinct match codes provided equal the required 104 matches, nor does it explicitly reject duplicate match codes.
* **Impact**: Submissions could be missing knockout matches or predicting the same match twice.
* **Proposed Fix**: Create a Set of submitted match IDs and compare it strictly against the master list of match IDs from the database.

## 4. Scoring Engine Hardcoded Values
* **Severity**: Critical
* **File**: `src/lib/scoring/engine.ts`
* **Root Cause**: The scoring engine relies on hardcoded point values instead of dynamically loading them from the `scoring_rules` database table.
* **Impact**: Violates `SCORING_ENGINE_SPEC.md`. Admin updates to point values in the database will not take effect.
* **Proposed Fix**: Modify `calculator.ts` to accept a `rules` configuration object fetched from the DB, replacing all hardcoded integers.

## 5. React Compiler Memoization Incompatibilities
* **Severity**: Low
* **File**: `src/components/dashboard/match-predictions-table.tsx`
* **Root Cause**: `@tanstack/react-table` uses hooks that violate React 19 Compiler memoization rules, throwing ESLint warnings.
* **Impact**: Potential stale UI or hydration bugs if memoized values rely on table instance methods.
* **Proposed Fix**: Update table component wrappers or use `eslint-disable` if strictly necessary, following Next.js 15+ best practices for TanStack table.

## 6. Unused Variables & Imports (Linting)
* **Severity**: Low
* **File**: Multiple files (e.g., `src/actions/submission.ts`, `src/app/admin/page.tsx`)
* **Root Cause**: Dead code and unused imports from previous iterations.
* **Impact**: Fails the `npm run lint` strict requirement.
* **Proposed Fix**: Clean up all unused variables, parameters, and imports.
