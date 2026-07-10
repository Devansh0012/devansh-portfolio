import { NextRequest } from 'next/server';
import { handleSubscribe } from '@/lib/subscribe';

export async function POST(request: NextRequest) {
  return handleSubscribe(request, {
    type: 'blog',
    from: 'Devansh Dubey <blog@devanshdubey.com>',
    alreadySubscribedError: 'You are already subscribed to the blog newsletter!',
    errorLogLabel: 'Blog subscription error:',
  });
}
