# Security Audit Report

## 1. Unrestricted File Upload Vulnerability
* **Severity**: Critical
* **File**: `src/actions/submission.ts`
* **Root Cause**: `uploadSubmission` does not validate file size or MIME type before uploading to Supabase Storage.
* **Impact**: Malicious users could upload massive files (e.g., 50GB) or executable payloads (e.g., `.exe`, `.sh`), leading to Denial of Service or storage exhaustion.
* **Proposed Fix**: Implement strict validation: `if (file.size > 5MB) throw Error` and `if (file.type !== 'text/csv') throw Error`.

## 2. Unsanitized Filename Storage
* **Severity**: High
* **File**: `src/actions/submission.ts`
* **Root Cause**: The file path is constructed as `${team.id}/${Date.now()}_${file.name}`. `file.name` is not sanitized.
* **Impact**: Path traversal attacks (`../../../malicious.csv`) or XSS vectors if filenames contain script tags and are later rendered unescaped in the admin dashboard.
* **Proposed Fix**: Sanitize filenames using a strict regex (e.g., `file.name.replace(/[^a-zA-Z0-9.-]/g, '_')`) or drop the original filename entirely and use a UUID.

## 3. Lack of Rate Limiting
* **Severity**: High
* **File**: `src/actions/auth.ts`, `src/actions/submission.ts`
* **Root Cause**: No rate limiting mechanism is implemented for authentication routes, team creation, or file submissions.
* **Impact**: Vulnerable to brute-force credential stuffing and API abuse/spamming.
* **Proposed Fix**: Implement `@upstash/ratelimit` or an in-memory LRU cache to restrict actions per IP/user session.

## 4. Incomplete Admin Authorization Enforcement
* **Severity**: High
* **File**: Admin Server Actions & Routes
* **Root Cause**: Admin status is often checked loosely or only on the frontend. Server actions modifying database state (like entering match results) must strictly enforce the `role === 'admin'` database claim.
* **Impact**: Privilege escalation if an attacker bypasses the UI and hits the server actions directly.
* **Proposed Fix**: Create a dedicated `requireAdmin()` utility function that verifies the Supabase profile role before executing any admin server action.

## 5. Missing Security Headers
* **Severity**: Medium
* **File**: `next.config.mjs`
* **Root Cause**: The application lacks default security headers (Content-Security-Policy, Strict-Transport-Security, X-Frame-Options).
* **Impact**: Increased susceptibility to Clickjacking, XSS, and MIME-sniffing attacks.
* **Proposed Fix**: Inject security headers via `next.config.mjs` or the Next.js Middleware/Proxy.
