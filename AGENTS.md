# Agent instructions

## Autonoma test data

Autonoma generates end-to-end tests that drive this site's UI against real data. It
seeds that data by calling `POST /api/autonoma` (`src/app/api/autonoma/route.ts`),
an HMAC-signed endpoint that runs one factory per model and tears the rows down
afterwards. The factories in `src/lib/autonoma/factories/` create records through the
app's own creation code — `SubscriberService.createSubscriber`, `verifySubscriber` and
`unsubscribeSubscriber` in `src/lib/supabase.ts` — so the real validation, defaults and
side effects run instead of a raw insert.

When you add a model to `database/schema.sql`, or change the code that creates an
existing one, add or update the matching factory in `src/lib/autonoma/factories/` and
register it in that directory's `index.ts`. A model with no factory cannot be seeded,
and a stale factory seeds rows the app itself would never produce.
