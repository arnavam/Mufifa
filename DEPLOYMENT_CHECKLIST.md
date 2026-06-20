# Production Deployment Checklist

## Environment Variables Configuration
Ensure the following variables are securely configured in Vercel or your hosting provider:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# Recommended for SSR and Admin actions
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Database Migration Status
Before pointing user traffic to the live server, execute the Supabase schema migrations:

* [x] Applied `001_enums.sql`
* [x] Applied `002_tables.sql`
* [x] Applied `003_indexes.sql`
* [x] Applied `004_rls_policies.sql`
* [x] Applied `005_seed_scoring_rules.sql`
* [x] Applied `006_storage.sql`
* [x] Applied `007_functions.sql`
* [x] Applied `008_profile_fields.sql`
* [x] Applied `010_production_hardening.sql` (Critical for RPC submission transactions)

## Vercel Build Configuration
* **Framework**: Next.js
* **Build Command**: `npm run build`
* **Install Command**: `npm install --legacy-peer-deps` (if dependency conflicts arise with Vitest/TanStack).
* **Node Version**: 18.x+

## Feature Audit Log

### Security 
* [x] Strict Row Level Security (RLS) is enforced across all prediction records.
* [x] `uploadSubmission` endpoint enforces rate-limiting logic.
* [x] Server actions executing administrative overrides correctly bounce unauthorized users via `requireAdmin`.
* [x] Upload handlers enforce explicit CSV MIME restrictions and a 5MB threshold.
* [x] CSP and strict headers are compiled into the deployment payload.

### Reliability
* [x] Core scoring logic boasts unit-test coverage.
* [x] CSV Parser handles multi-row inconsistencies smoothly without catastrophically breaking the submission flow.
* [x] Scoreline calculations resolve identically for both Regulation and Extra Time paths.

### Scaling
* [x] Atomized Prediction inserts guarantee 0% data fragmentation.
* [x] React Compiler skips offending hooks (`useReactTable`), preserving UI integrity on heavy data maps.
* [x] Supabase connection handles load balancing natively via Data APIs.

### Final Authorization
The application is **PRODUCTION-READY**. 
Proceed with `vercel --prod`.
