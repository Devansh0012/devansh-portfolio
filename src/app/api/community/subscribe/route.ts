import { NextRequest } from 'next/server';
import { handleSubscribe } from '@/lib/subscribe';

export async function POST(request: NextRequest) {
  return handleSubscribe(request, {
    type: 'community',
    from: 'Devansh Dubey <community@devanshdubey.com>',
    alreadySubscribedError: 'You are already subscribed to the community waitlist!',
    errorLogLabel: 'Community subscription error:',
  });
}
