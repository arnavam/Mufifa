# CSV Validation Report

## Overview
The CSV parsing and validation workflow has been rigorously audited and upgraded to meet the system requirements for production readiness. All critical vulnerabilities and logical flaws have been patched.

## Audit Findings & Remediation

### 1. Row-level Isolation & Comprehensive Error Reporting
* **Finding**: `validateCsv` appropriately continues evaluating rows even if prior rows fail validation (`safeParse` logic or logical checks). This behavior allows for collecting a comprehensive array of errors (the `ValidationResult.errors` payload) so the user sees all mistakes at once.
* **Status**: **Verified & Working**. The `forEach` loop collects errors per row accurately without breaking.

### 2. Possession Constraint Enforcement
* **Finding**: The original parser allowed a `0.1` tolerance variance in the sum of `predicted_possession_home` and `predicted_possession_away`.
* **Fix Applied**: Upgraded the validation rule to enforce a strict `100` total, guarding against floating-point inaccuracies by rounding the arithmetic sum to 2 decimal places before assertion: `Number((possHome + possAway).toFixed(2)) !== 100`.

### 3. Duplicate and Missing Match Detection
* **Finding**: The validation engine incorporates a `seenMatches` Set during iteration and a final check against `validMatchIds`.
* **Status**: **Verified & Working**. Duplicate `match_id` records explicitly push validation errors. A missing match check occurs post-iteration, effectively blocking incomplete submissions.

### 4. File Upload Security (Size & MIME Validation)
* **Finding**: The Server Action `uploadSubmission` blindly accepted any file payload before saving it to Supabase Storage, opening the system to DoS/Storage-bloat vulnerabilities via massive `.exe` or `.zip` files.
* **Fix Applied**: Added explicit MIME type assertion (`text/csv`, `application/vnd.ms-excel`) and a strict 5MB upload size limit on the FormData payload.

### 5. Filename Sanitization
* **Finding**: `file.name` was directly templated into the storage path, posing a theoretical path traversal or injection risk.
* **Fix Applied**: Sanitized filenames on the server via `file.name.replace(/[^a-zA-Z0-9.-]/g, '_')`.

## Conclusion
The CSV Validation subsystem is now secure, atomic, and strictly aligned with the tournament constraints.
