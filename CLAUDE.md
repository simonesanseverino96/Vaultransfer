# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Jest unit tests (tests/*.test.ts)
npm run test:e2e     # Playwright end-to-end tests
npm run analyze      # Bundle analyzer (sets ANALYZE=true)
```

Run a single Jest test file:
```bash
npx jest tests/upload.test.ts
```

## Architecture

**VaultTransfer** is a Next.js 15/16 App Router SaaS for encrypted file transfers.

### Routing & Internationalization
- All user-facing pages live under `app/[locale]/` with `localePrefix: 'always'`
- Supported locales: `en it de fr es pt ja zh ar` (defined in `i18n/routing.ts`)
- Translation files: `messages/{locale}.json`, loaded by `i18n/request.ts`
- API routes under `app/api/` are **not** locale-prefixed
- Use `next-intl`'s `Link`, `redirect`, `useRouter` from `i18n/routing.ts` — never bare Next.js equivalents

### Infrastructure
- **Supabase** — auth, PostgreSQL database, and file storage (bucket: `filedrop`)
- **Stripe** — subscriptions (free / pro / business / enterprise). Price IDs via `STRIPE_PRICE_PRO` and `STRIPE_PRICE_BUSINESS` env vars
- **Upstash Redis** — rate limiting via `@upstash/ratelimit` (requires `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`)
- **Resend** — transactional emails (upload confirmations, storage warnings)
- **Vercel** — hosting + daily cron at midnight hitting `/api/cleanup` to delete expired transfers

### Supabase Clients
- `getBrowserClient()` in `lib/supabase.ts` — singleton browser client (use in client components)
- `supabaseAdmin()` in `lib/supabase.ts` — server-only admin client with `service_role` key; never expose to client

### Upload Flow (two-phase)
1. `POST /api/upload/init` — validates files, creates signed upload URLs, returns `transferId` + per-file `signedUrl`
2. Client uploads files directly to Supabase Storage using the signed URLs
3. `POST /api/upload` — calls `finalizeTransfer()` in `lib/transfers.ts` to write DB records and send confirmation email

### Key Modules
| File | Purpose |
|------|---------|
| `lib/transfers.ts` | `finalizeTransfer()` — core business logic for creating a transfer record |
| `lib/plans.ts` | Plan definitions and limits (`PLANS`, `getPlanLimits()`) |
| `lib/auth.ts` | `getServerSession()`, `getUserPlan()` — always check subscription validity |
| `lib/ratelimit.ts` | Named rate limiters: `uploadRatelimit`, `downloadRatelimit`, `apiRatelimit`, `checkoutRatelimit`, `reportRatelimit` |
| `lib/blocklist.ts` | `isBlockedFile()` — blocks dangerous file extensions on upload |
| `lib/email.ts` | Email helpers using Resend |

### Database Schema
Run `supabase-schema-final.sql` in Supabase SQL Editor to initialize. Key tables:
- `transfers` — one row per transfer, holds expiry, password hash, download count, `user_id` (nullable for anonymous)
- `transfer_files` — files belonging to a transfer; `storage_path` points into the `filedrop` storage bucket
- `profiles` — one row per auth user; holds `plan`, `stripe_customer_id`, `subscription_status`

Row Level Security is enabled on all three tables.

### Plans
`lib/plans.ts` is the single source of truth for per-plan limits. Free plan caps: 7-day expiry, 5 downloads. Pro/Business: 90-day expiry, unlimited downloads. Anonymous uploads are limited to 3 per IP per day and 5 MB per file.

### Environment Variables
Copy `.env.local.example` to `.env.local`. Required variables:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_PRO
STRIPE_PRICE_BUSINESS
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```
Optional: `NEXT_PUBLIC_ADSENSE_ID` (enables AdSense script in layout), `MAX_FILE_SIZE_MB`, `MAX_FILES_PER_TRANSFER`.
