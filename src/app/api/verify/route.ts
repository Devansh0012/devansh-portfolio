import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SubscriberService } from '@/lib/supabase';
import { getWelcomeEmail } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/community?error=missing-token', request.url));
    }

    const subscriber = await SubscriberService.verifySubscriber(token);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const unsubscribeUrl = `${appUrl}/unsubscribe?token=${subscriber.unsubscribe_token}`;

    const welcomeEmail = getWelcomeEmail({
      email: subscriber.email,
      unsubscribeUrl,
      type: subscriber.subscription_type
    });

    const emailResult = await resend.emails.send({
      from: subscriber.subscription_type === 'community' 
        ? 'Devansh Dubey <community@devanshdubey.com>'
        : 'Devansh Dubey <blog@devanshdubey.com>',
      to: [subscriber.email],
      subject: welcomeEmail.subject,
      html: welcomeEmail.html,
      text: welcomeEmail.text,
    });

    if (emailResult.error) {
      console.error('Failed to send welcome email:', emailResult.error);
      // The subscriber is already verified in the DB at this point, so a
      // failed welcome email must not turn the verification into an error.
    }

    const successUrl = subscriber.subscription_type === 'community'
      ? '/community?verified=true'
      : '/blog?verified=true';

    return NextResponse.redirect(new URL(successUrl, request.url));

  } catch (error) {
    console.error('Email verification error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.redirect(
      new URL(`/community?error=verification-failed&message=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }
}