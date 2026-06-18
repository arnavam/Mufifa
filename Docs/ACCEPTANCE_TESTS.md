# ACCEPTANCE_TESTS.md

# FIFA World Cup 2026 ML Prediction Challenge

## Acceptance Test Specification

Version: 1.0

---

# Purpose

This document defines the minimum acceptance criteria for the platform.

A feature is not complete unless all associated acceptance tests pass.

The implementation must satisfy every test below.

---

# SECTION 1: Authentication

---

## AUTH-001

Scenario:

User registers with valid credentials.

Expected Result:

* Account created
* Verification email sent
* User can verify email
* User can log in

Status:

PASS

---

## AUTH-002

Scenario:

Register with existing email.

Expected Result:

* Registration blocked
* Clear error shown

Status:

PASS

---

## AUTH-003

Scenario:

Login with valid credentials.

Expected Result:

* Session created
* Dashboard loads

Status:

PASS

---

## AUTH-004

Scenario:

Login with invalid credentials.

Expected Result:

* Authentication denied
* Error displayed

Status:

PASS

---

## AUTH-005

Scenario:

Logout.

Expected Result:

* Session destroyed
* Redirect to homepage

Status:

PASS

---

# SECTION 2: Team Management

---

## TEAM-001

Scenario:

Create team.

Expected Result:

* Team created
* Team linked to user

Status:

PASS

---

## TEAM-002

Scenario:

Create duplicate team name.

Expected Result:

* Validation error
* Team not created

Status:

PASS

---

## TEAM-003

Scenario:

User attempts second team.

Expected Result:

* Blocked

Status:

PASS

---

# SECTION 3: CSV Submission

---

## CSV-001

Scenario:

Upload valid CSV.

Expected Result:

* File stored
* Predictions parsed
* Submission created

Status:

PASS

---

## CSV-002

Scenario:

Upload CSV missing required columns.

Expected Result:

* Upload rejected
* Validation errors displayed

Status:

PASS

---

## CSV-003

Scenario:

Upload duplicate match predictions.

Expected Result:

* Validation failure

Status:

PASS

---

## CSV-004

Scenario:

Upload invalid player names.

Expected Result:

* Validation failure

Status:

PASS

---

## CSV-005

Scenario:

Upload incomplete tournament prediction.

Expected Result:

* Validation failure

Status:

PASS

---

## CSV-006

Scenario:

Upload second submission.

Expected Result:

* Blocked

Status:

PASS

---

## CSV-007

Scenario:

Successful upload.

Expected Result:

* Submission locked
* No further modifications allowed

Status:

PASS

---

# SECTION 4: Match Management

---

## MATCH-001

Scenario:

Admin creates match.

Expected Result:

* Match stored

Status:

PASS

---

## MATCH-002

Scenario:

Admin edits match.

Expected Result:

* Match updated

Status:

PASS

---

## MATCH-003

Scenario:

Non-admin edits match.

Expected Result:

* Access denied

Status:

PASS

---

# SECTION 5: Result Entry

---

## RESULT-001

Scenario:

Admin enters completed match result.

Expected Result:

* Result stored

Status:

PASS

---

## RESULT-002

Scenario:

Admin updates result.

Expected Result:

* Result updated
* Recalculation triggered

Status:

PASS

---

## RESULT-003

Scenario:

Participant enters result.

Expected Result:

* Access denied

Status:

PASS

---

# SECTION 6: Scoring Engine

---

## SCORE-001

Scenario:

Correct winner predicted.

Expected Result:

* Winner points awarded

Status:

PASS

---

## SCORE-002

Scenario:

Exact scoreline predicted.

Expected Result:

* Exact score points awarded

Status:

PASS

---

## SCORE-003

Scenario:

Correct goal difference predicted.

Expected Result:

* Goal difference points awarded

Status:

PASS

---

## SCORE-004

Scenario:

Correct scorer predicted.

Expected Result:

* Scorer points awarded

Status:

PASS

---

## SCORE-005

Scenario:

Correct scorer goal count predicted.

Expected Result:

* Goal count bonus awarded

Status:

PASS

---

## SCORE-006

Scenario:

Exact scorer list predicted.

Expected Result:

* Exact list bonus awarded

Status:

PASS

---

## SCORE-007

Scenario:

Possession prediction within tolerance.

Expected Result:

* Possession points awarded

Status:

PASS

---

## SCORE-008

Scenario:

Shots prediction within tolerance.

Expected Result:

* Shot points awarded

Status:

PASS

---

## SCORE-009

Scenario:

xG prediction within tolerance.

Expected Result:

* xG points awarded

Status:

PASS

---

## SCORE-010

Scenario:

Correct penalty winner predicted.

Expected Result:

* Penalty winner points awarded

Status:

PASS

---

## SCORE-011

Scenario:

Exact penalty score predicted.

Expected Result:

* Penalty score points awarded

Status:

PASS

---

## SCORE-012

Scenario:

Correct champion predicted.

Expected Result:

* Champion bonus awarded

Status:

PASS

---

## SCORE-013

Scenario:

Correct winner prediction with confidence >80%.

Expected Result:

* Confidence bonus awarded

Status:

PASS

---

## SCORE-014

Scenario:

Incorrect winner prediction with confidence >80%.

Expected Result:

* Confidence penalty applied

Status:

PASS

---

## SCORE-015

Scenario:

Stage multiplier applied.

Expected Result:

* Match score multiplied correctly

Status:

PASS

---

# SECTION 7: Leaderboard

---

## LEADERBOARD-001

Scenario:

Scores calculated.

Expected Result:

* Leaderboard populated

Status:

PASS

---

## LEADERBOARD-002

Scenario:

Leaderboard sorted.

Expected Result:

* Highest score ranked first

Status:

PASS

---

## LEADERBOARD-003

Scenario:

Tied score.

Expected Result:

Tie-breakers applied:

1. Accuracy %
2. Winner Accuracy
3. Earlier Submission

Status:

PASS

---

## LEADERBOARD-004

Scenario:

Match result updated.

Expected Result:

* Leaderboard recalculated automatically

Status:

PASS

---

## LEADERBOARD-005

Scenario:

Public visitor opens leaderboard.

Expected Result:

* Read access granted

Status:

PASS

---

# SECTION 8: Analytics

---

## ANALYTICS-001

Scenario:

Analytics page loads.

Expected Result:

* Charts displayed

Status:

PASS

---

## ANALYTICS-002

Scenario:

Compare Team A vs Team B.

Expected Result:

* Comparison generated

Status:

PASS

---

## ANALYTICS-003

Scenario:

Most Accurate Team metric.

Expected Result:

* Correct team displayed

Status:

PASS

---

## ANALYTICS-004

Scenario:

Hardest Match metric.

Expected Result:

* Correct match displayed

Status:

PASS

---

# SECTION 9: Security

---

## SECURITY-001

Scenario:

Participant accesses another participant's predictions.

Expected Result:

* Access denied

Status:

PASS

---

## SECURITY-002

Scenario:

Participant accesses admin dashboard.

Expected Result:

* Access denied

Status:

PASS

---

## SECURITY-003

Scenario:

Anonymous user accesses protected route.

Expected Result:

* Redirect login

Status:

PASS

---

## SECURITY-004

Scenario:

Direct database query bypass attempt.

Expected Result:

* Blocked by RLS

Status:

PASS

---

# SECTION 10: Realtime Updates

---

## REALTIME-001

Scenario:

Result entered.

Expected Result:

* Leaderboard refreshes automatically

Status:

PASS

---

## REALTIME-002

Scenario:

Scoring rule updated.

Expected Result:

* Recalculation triggered

Status:

PASS

---

# SECTION 11: Mobile Experience

---

## MOBILE-001

Scenario:

Leaderboard viewed on mobile.

Expected Result:

* Fully usable

Status:

PASS

---

## MOBILE-002

Scenario:

CSV uploaded from mobile.

Expected Result:

* Upload works

Status:

PASS

---

## MOBILE-003

Scenario:

Admin dashboard on tablet.

Expected Result:

* Responsive layout

Status:

PASS

---

# SECTION 12: Performance

---

## PERF-001

Scenario:

Leaderboard load.

Expected Result:

< 2 seconds

Status:

PASS

---

## PERF-002

Scenario:

Analytics load.

Expected Result:

< 3 seconds

Status:

PASS

---

## PERF-003

Scenario:

CSV validation.

Expected Result:

< 5 seconds

Status:

PASS

---

## PERF-004

Scenario:

Full leaderboard recalculation.

Expected Result:

< 30 seconds

Status:

PASS

---

# SECTION 13: Production Readiness

---

## PROD-001

Row Level Security enabled.

PASS

---

## PROD-002

Audit logging implemented.

PASS

---

## PROD-003

Error boundaries implemented.

PASS

---

## PROD-004

Loading states implemented.

PASS

---

## PROD-005

Empty states implemented.

PASS

---

## PROD-006

Dark mode implemented.

PASS

---

## PROD-007

Accessibility checks passed.

PASS

---

## PROD-008

No mock data in production.

PASS

---

## PROD-009

All database migrations created.

PASS

---

## PROD-010

Deployment successful on Vercel.

PASS

---

# Final Acceptance Criteria

The project is considered complete only if:

* All acceptance tests pass
* No critical bugs remain
* All PRD requirements implemented
* All TDD requirements implemented
* Security requirements implemented
* Production deployment successful
* Leaderboard calculations verified
* Mobile experience verified
* Admin workflows verified

Completion Requirement:

100% PASS