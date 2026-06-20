# Knockout-Only Migration Plan & Risk Assessment

## Executive Summary
This document assesses the architectural impact of reducing the FIFA 2026 Prediction Challenge from a 104-match full-tournament scope to a 32-match Knockout-Only scope (beginning at the Round of 32). 

Because the platform was intentionally built using a highly decoupled, data-driven architecture, the transition requires **almost zero code modifications**. The system natively adapts to whatever dataset is seeded into the `matches` table.

## Component Impact Assessment

### 1. Template Generator (`src/lib/csv/template-generator.ts`)
- **Impact:** `[NONE]`
- **Reasoning:** The CSV generator does not hardcode `104` matches. It dynamically queries the `matches` database table. If only 32 matches exist in the DB, it will instantly generate a 32-row CSV template.

### 2. Upload Validator (`src/lib/csv/validator.ts`)
- **Impact:** `[NONE]`
- **Reasoning:** The validator runtime-fetches the `match_code` array from the database. It enforces that the uploaded CSV matches the database exactly. Submitting a 32-row CSV against a 32-row database will parse flawlessly.

### 3. Dashboard Data Presentation
- **Impact:** `[NONE]`
- **Reasoning:** The `MatchPredictionsTable` component renders dynamically based on the user's prediction rows. It will simply render 32 rows instead of 104 without UI breakages.

### 4. Scoring & Analytics Engine (`src/lib/scoring/calculator.ts`)
- **Impact:** `[NONE]`
- **Reasoning:** The scoring mechanics execute a `GROUP BY` equivalent loop aggregating points per `match_id`. A reduction in matches reduces computational load but fundamentally operates identically. All stage multipliers (e.g., Final = 5.0x) will apply normally.

### 5. Homepage Copy (`src/app/page.tsx`)
- **Impact:** `[LOW]`
- **Reasoning:** The homepage currently contains hardcoded text stating: *"Comprehensive coverage of 104 matches."*
- **Action Required:** This specific text string must be updated to state *"Comprehensive coverage of all 32 Knockout Stage matches."*

### 6. The Database Seed
- **Impact:** `[CRITICAL]`
- **Reasoning:** The entire pivot relies exclusively on dropping the existing `matches` table and seeding a brand new structure.
- **Action Required:** We must construct a completely accurate `fifa_2026_r32_seed.sql` that properly maps the authentic FIFA 48-team knockout bracket (12 group winners, 12 runners-up, 8 third-place wildcards). As noted in our previous Bracket Audit, this requires careful football logic to map out properly.

## Migration Steps (When Approved)

1. Rebuild `fifa_2026_r32_seed.sql` with accurate 32-team football wildcard logic.
2. Truncate the existing `matches` and `predictions` tables.
3. Inject the new seed SQL into the production database.
4. Update the "104 matches" string in `src/app/page.tsx`.
5. The platform is instantly ready for Knockout-Only mode.
