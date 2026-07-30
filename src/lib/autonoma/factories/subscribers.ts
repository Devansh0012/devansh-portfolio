// Factory for the `subscribers` table.
//
// Rows are created through SubscriberService — the same code path the
// /api/blog/subscribe and /api/community/subscribe routes use — so the real
// side effects run: the email is lowercased/trimmed, `verified` starts false,
// the verification token is stored and the database generates the
// unsubscribe_token. Verified and unsubscribed states are then reached through
// SubscriberService.verifySubscriber / unsubscribeSubscriber, exactly like the
// /api/verify and /api/unsubscribe routes do. Only the columns no app code
// path can set (metadata, historical timestamps, a fixed unsubscribe token)
// are written directly with the service-role client.

import { defineFactory } from '@autonoma-ai/sdk';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { SubscriberService, type Subscriber } from '@/lib/supabase';
import { supabaseAdmin, TEST_RUN_METADATA_KEY } from '@/lib/autonoma/admin';

const subscriptionType = z.enum(['community', 'blog']);

/** Writes seed-only columns on an already-created row and returns it. */
async function patchSubscriber(id: string, values: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin()
    .from('subscribers')
    .update(values)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to seed subscriber columns: ${error.message}`);
  }

  return data as Subscriber;
}

export const subscribers = defineFactory({
  inputSchema: z.object({
    email: z.string().email(),
    subscription_type: subscriptionType,
    /** Runs the real verification flow when true. */
    verified: z.boolean().optional(),
    /** Defaults to a uuid, like the subscribe routes do. */
    verification_token: z.string().optional(),
    unsubscribe_token: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
    created_at: z.string().optional(),
    verified_at: z.string().optional(),
    /** Runs the real unsubscribe flow when set. */
    unsubscribed_at: z.string().optional(),
  }),

  refSchema: z.object({
    id: z.string(),
    email: z.string(),
    subscription_type: subscriptionType,
    verified: z.boolean(),
    verification_token: z.string().nullable(),
    unsubscribe_token: z.string(),
    testRunId: z.string(),
  }),

  create: async (data, ctx) => {
    const verificationToken = data.verification_token ?? uuidv4();

    let subscriber = await SubscriberService.createSubscriber(
      data.email,
      data.subscription_type,
      verificationToken
    );

    const seedOnly: Record<string, unknown> = {
      // The test run marker lets teardown scope strictly by run.
      metadata: { ...(data.metadata ?? {}), [TEST_RUN_METADATA_KEY]: ctx.testRunId },
    };
    if (data.unsubscribe_token) seedOnly.unsubscribe_token = data.unsubscribe_token;
    if (data.created_at) seedOnly.created_at = data.created_at;
    subscriber = await patchSubscriber(subscriber.id, seedOnly);

    if (data.verified) {
      subscriber = await SubscriberService.verifySubscriber(verificationToken);
      if (data.verified_at) {
        subscriber = await patchSubscriber(subscriber.id, { verified_at: data.verified_at });
      }
    }

    if (data.unsubscribed_at) {
      subscriber = await SubscriberService.unsubscribeSubscriber(subscriber.unsubscribe_token);
      subscriber = await patchSubscriber(subscriber.id, {
        unsubscribed_at: data.unsubscribed_at,
      });
    }

    return {
      id: subscriber.id,
      email: subscriber.email,
      subscription_type: subscriber.subscription_type,
      verified: subscriber.verified,
      verification_token: subscriber.verification_token,
      unsubscribe_token: subscriber.unsubscribe_token,
      testRunId: ctx.testRunId,
    };
  },

  teardown: async (record) => {
    const { error } = await supabaseAdmin().from('subscribers').delete().eq('id', record.id);

    if (error) {
      throw new Error(`Failed to delete subscriber ${record.id}: ${error.message}`);
    }
  },
});
