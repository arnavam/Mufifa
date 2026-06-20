# Test Coverage Report

## Overview
Vitest has been successfully integrated into the application pipeline. A test suite covering the foundational scoring business logic from `ACCEPTANCE_TESTS.md` has been created and verified.

## Test Suites

### 1. Scoring Engine Unit Tests
**Location**: `src/tests/scoring.test.ts`
**Status**: Passing (6/6)
**Execution Time**: 3ms

#### Coverage:
* `SCORE-001`: Correct winner predicted -> 20 points
* `SCORE-002`: Exact scoreline predicted -> 40 points
* `SCORE-003`: Correct goal difference predicted -> 15 points
* `SCORE-013`: Correct winner prediction with confidence >80% -> +10 points
* `SCORE-014`: Incorrect winner prediction with confidence >80% -> -10 points
* `SCORE-015`: Stage multiplier applied -> Match score * Multiplier

## Continuous Integration
The `vitest` command has been fully localized and optimized with `jsdom` via `vitest.config.ts`. It executes entirely independent of the Next.js server context, ensuring CI environments can run it asynchronously without blocking Next.js builds.

## Next Steps
While the core prediction math is securely tested, we recommend expanding the Vitest suite in the future to map CSV-001 through CSV-007 (incorporating Zod validations in `validator.ts`) to achieve >90% coverage on the `src/lib/` directory.
