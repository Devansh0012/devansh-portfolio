import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { SubscriberService } from '@/lib/supabase';

const unsubscribeSchema = z.object({
  token: z.string().min(1, 'Unsubscribe token is required'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { token } = unsubscribeSchema.parse(body);

    // Unsubscribe the subscriber
    const subscriber = await SubscriberService.unsubscribeSubscriber(token);

    return NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed.',
      email: subscriber.email,
      type: subscriber.subscription_type
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: error.errors[0]?.message || 'Invalid request',
          details: error.errors
        }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to unsubscribe. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/unsubscribe?error=missing-token', request.url));
    }

    // Get subscriber info to show on unsubscribe page
    const subscriber = await SubscriberService.getSubscriberByUnsubscribeToken(token);

    if (subscriber.unsubscribed_at) {
      return NextResponse.redirect(new URL(`/unsubscribe?already=true&email=${encodeURIComponent(subscriber.email)}`, request.url));
    }

    return NextResponse.redirect(new URL(`/unsubscribe?token=${token}&email=${encodeURIComponent(subscriber.email)}&type=${subscriber.subscription_type}`, request.url));

  } catch (error) {
    console.error('Unsubscribe GET error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.redirect(
      new URL(`/unsubscribe?error=invalid-token&message=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }
}