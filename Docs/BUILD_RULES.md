# Build Rules

The application must be production-ready.

Do NOT generate placeholders.

Do NOT generate mock implementations.

Do NOT generate TODO comments.

Do NOT skip functionality defined in the PRD.

Do NOT create fake APIs.

Do NOT create fake data sources.

All features must be implemented fully.

Requirements:

* Strict TypeScript
* No `any`
* Zod validation everywhere
* React Hook Form
* Server Actions preferred
* Proper error handling
* Loading states
* Empty states
* Mobile responsiveness
* Accessibility support

Authentication:

* Supabase Auth
* Email/password login
* Protected routes

Database:

* PostgreSQL
* Supabase migrations
* Proper indexes
* RLS policies

UI:

* shadcn/ui only
* TailwindCSS
* Dark theme
* Football-inspired design

Performance:

* Avoid unnecessary re-renders
* Use caching where appropriate

Code Quality:

* Modular architecture
* Reusable components
* Typed APIs
* Clean folder structure

Testing:

* Unit tests for scoring engine
* Integration tests for uploads
* E2E tests for submission workflow

Deployment Target:

* Vercel
* Production-ready
