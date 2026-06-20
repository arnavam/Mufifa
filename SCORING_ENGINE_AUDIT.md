# Scoring Engine Audit Report

## Overview
A comprehensive audit and hardening of the core scoring engine logic (`src/lib/scoring/engine.ts`) was performed to guarantee determinism, accuracy, and adherence to edge-cases described in the `SCORING_ENGINE_SPEC.md`.

## Audit Findings & Remediation

### 1. Parameterized Rules Configuration
* **Finding**: The system correctly parameters rules from the `scoring_rules` database table without hardcoding point values in the code logic. Initial assumptions regarding hardcoded values were proven false; the engine dynamically maps configurations effectively.
* **Status**: **Verified & Working**.

### 2. Extra Time Scoreline Resolution
* **Finding**: The `calculateScorelineScore` logic exclusively compared regulation `home_score` and `away_score`. If a match escalated to Extra Time, the engine would have evaluated the 90-minute scoreline instead of the 120-minute outcome.
* **Fix Applied**: Implemented a `getFinalScore` helper that extracts `extra_time_home` and `extra_time_away` if present, seamlessly migrating the engine's evaluation to the official 120-minute outcome.

### 3. Own Goal Interference
* **Finding**: The `calculateScorerScore` logic would mistakenly evaluate 'Own Goal' strings as legitimate player predictions.
* **Fix Applied**: Introduced a strict filtering proxy `!name.toLowerCase().includes('own goal') && name.toLowerCase() !== 'og'` on both the predicted scorers and actual scorers. Own Goals are completely decoupled from player predictions.

### 4. Deterministic Multiplier Pipeline
* **Finding**: Stage Multipliers are appropriately sourced from the match data pipeline in `calculator.ts` and evaluated independently on the derived sub-scores.
* **Status**: **Verified & Working**.

## Conclusion
The scoring engine satisfies all requirements. It is side-effect-free, deterministic, correctly handles edge cases, and scales linearly with DB rules.
