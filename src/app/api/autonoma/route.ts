// Autonoma Environment Factory endpoint: handles the discover / up / down
// protocol so Autonoma can seed and tear down realistic test data through the
// app's own creation paths. Every request is HMAC-verified by the SDK against
// AUTONOMA_SHARED_SECRET; unsigned requests get a 401.

import { createHandler } from '@autonoma-ai/server-web';
import { deleteTestRunSubscribers } from '@/lib/autonoma/admin';
import { factories } from '@/lib/autonoma/factories';

const handler = createHandler({
  // The app has no tenant model — subscribers are a flat, public table — so the
  // test run itself is the scope. Every seeded row carries its testRunId.
  scopeField: 'testRunId',
  sharedSecret: process.env.AUTONOMA_SHARED_SECRET!,
  signingSecret: process.env.AUTONOMA_SIGNING_SECRET!,
  factories,

  // The site has no login: a subscriber's identity is their email plus the
  // single-use tokens behind the verify and unsubscribe links. Hand the runner
  // the real tokens the database generated so it can drive those flows.
  auth: async (_user, context) => {
    const seeded = context.refs.subscribers ?? [];
    if (seeded.length === 0) return {};

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const primary = seeded[0];
    const pending = seeded.find((subscriber) => subscriber.verification_token);

    const credentials: Record<string, string> = {
      email: String(primary.email),
      subscriptionType: String(primary.subscription_type),
      unsubscribeToken: String(primary.unsubscribe_token),
      unsubscribeUrl: `${appUrl}/unsubscribe?token=${primary.unsubscribe_token}`,
    };

    if (pending) {
      credentials.pendingVerificationEmail = String(pending.email);
      credentials.verificationToken = String(pending.verification_token);
      credentials.verificationUrl = `${appUrl}/api/verify?token=${pending.verification_token}`;
    }

    return { credentials };
  },

  // Belt and braces: also remove rows this run created outside `up` (e.g. a
  // subscription made through the UI mid-test). Scoped strictly by testRunId.
  beforeDown: async (context) => {
    await deleteTestRunSubscribers(context.scenarioName);
  },
});

// Dark in production unless we are on an Autonoma preview environment.
export const POST = (request: Request) =>
  process.env.NODE_ENV === 'production' && !process.env.AUTONOMA_PREVIEWKIT
    ? new Response('Not Found', { status: 404 })
    : handler(request);
