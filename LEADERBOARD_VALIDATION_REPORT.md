# Leaderboard Validation Report

## Overview
The leaderboard generation process (`src/lib/scoring/calculator.ts`) was audited to verify compliance with the canonical ranking specification.

## Validation Checklist

### Primary Ordering: Total Score
* **Status**: **PASS**. The ranking strictly sorts `total_score` in descending order.

### Secondary Ordering: Accuracy Percentage
* **Status**: **PASS**. The ranking strictly sorts `accuracy_percentage` descending to break ties.

### Tertiary Ordering: Winner Score Accuracy
* **Status**: **PASS**. The ranking resolves subsequent ties using `winner_score` descending.

### Quaternary Ordering: Earliest Submission Timestamp
* **Status**: **REMEDIATED**.
* **Finding**: The algorithm originally lacked a time-based tiebreaker if scores and accuracy were identical.
* **Fix Applied**: Added a fourth-level discriminator to the memory sort pipeline that queries `locked_at` from the `submissions` table joined through `teams`, prioritizing earlier ISO dates (`aTime - bTime`).

## Conclusion
Leaderboard ranking mechanics are fully verified. In edge cases involving identical prediction quality across participants, the system explicitly honors the participant who locked their submission first.
