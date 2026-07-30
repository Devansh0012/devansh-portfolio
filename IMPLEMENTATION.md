# Autonoma SDK integration — checklist

Endpoint: `POST /api/autonoma` (`src/app/api/autonoma/route.ts`)
Recipe: `/Users/devanshdubey/.autonoma/devansh-portfolio/recipe.json`

## Entities (from the planner's entity audit)

- [x] `subscribers` — created via `SubscriberService.createSubscriber`
      (`src/lib/supabase.ts`), verified via `SubscriberService.verifySubscriber`,
      unsubscribed via `SubscriberService.unsubscribeSubscriber`.
      Validated with a 3-record slice: `up` → rows present in Postgres with the
      right type, verified/unsubscribed states, tokens, metadata and historical
      timestamps → `down` → rows gone.

## Integration

- [x] Endpoint handling discover / up / down through the SDK handler
      (`discover` returns the `subscribers` model and `scopeField: testRunId`)
- [x] Teardown (per-record delete + testRunId sweep) — 0 rows left after `down`
- [x] Auth callback returning real credentials (seeded subscriber's email plus the
      database-generated unsubscribe token and the live verification token/URL)
- [x] Maintenance note in `AGENTS.md`
- [x] Full-recipe up/down pass — 8 rows created, verified in the DB, all removed
- [x] Wrong-signature rejected (401 `INVALID_SIGNATURE`; missing signature too)
- [x] Two concurrent instances coexist — `concurrent-a` and `concurrent-b` both up
      at once (8 + 8 rows), `down a` left b's 8 rows untouched, `down b` left 0

## Local environment

- Stack: Next.js 15 (App Router), TypeScript, npm, Supabase (`@supabase/supabase-js`),
  raw SQL schema in `database/schema.sql`.
- Database: local Supabase stack (`supabase start`) — API `http://127.0.0.1:54321`,
  Postgres `postgresql://postgres:postgres@127.0.0.1:54322/postgres`. The schema in
  `database/schema.sql` is applied to it, plus the table grants
  (`GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscribers TO anon, ...`) that the
  schema's anon RLS policies assume.
- App: `npm run dev` on `http://localhost:3000`.
- Env (`.env.local`, gitignored): `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
  `NEXT_PUBLIC_APP_URL`, `AUTONOMA_SIGNING_SECRET`. `AUTONOMA_SHARED_SECRET` comes
  from the process environment and is not written to a file.

## Notes

- **No tenant to scope by.** The schema has a single flat `subscribers` table with no
  organization/workspace root, so teardown deletes each created record by id (the
  SDK's reverse-dependency order) and a `beforeDown` hook additionally deletes any row
  stamped with this run's `metadata.autonoma_test_run_id`, which also catches rows a
  test created through the UI. `scopeField` is therefore `testRunId`.
- **Seed-only columns.** `createSubscriber` only accepts email, type and verification
  token; `metadata`, `created_at`, `verified_at`, `unsubscribed_at` and a fixed
  `unsubscribe_token` have no app code path, so the factory writes them with the
  service-role client after the real creation call. Everything the app *does* own
  (email normalisation, `verified` false on create, DB-generated unsubscribe token,
  single-use verification token cleared on verify) runs for real.
- **Uniqueness.** `subscribers` has three unique constraints — `email`,
  `verification_token`, `unsubscribe_token` (confirmed against the live database).
  The recipe puts `{{testRunShortId}}` inside all three, so concurrent runs never
  collide. Verified rows end with a null `verification_token` (the app clears it on
  verify), which is unique-safe.
- **Resend is not called.** The factory calls `SubscriberService` directly rather than
  the subscribe route, so the verification email side effect is dropped, per the
  handler/external-service rule.
