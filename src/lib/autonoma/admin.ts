// Service-role Supabase client, used ONLY by the Autonoma test-data endpoint.
//
// The app itself talks to Supabase through the anon client in `@/lib/supabase`,
// whose RLS policies allow inserts/updates but no deletes and no writes to the
// columns a subscriber never sets themselves (metadata, historical timestamps).
// Seeding needs both, so the factories create rows through the app's real
// SubscriberService and use this client for the seed-only writes and teardown.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/** Metadata key stamped on every seeded row so teardown can scope by test run. */
export const TEST_RUN_METADATA_KEY = 'autonoma_test_run_id';

let client: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY: the Autonoma test-data endpoint needs the service role key to seed and tear down rows.'
    );
  }

  client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return client;
}

/**
 * Delete every subscriber stamped with this test run, regardless of whether it
 * came from `up` or was created mid-test through the UI. Idempotent.
 */
export async function deleteTestRunSubscribers(testRunId: string) {
  if (!testRunId) return;

  const { error } = await supabaseAdmin()
    .from('subscribers')
    .delete()
    .eq(`metadata->>${TEST_RUN_METADATA_KEY}`, testRunId);

  if (error) {
    throw new Error(`Failed to sweep test run subscribers: ${error.message}`);
  }
}
