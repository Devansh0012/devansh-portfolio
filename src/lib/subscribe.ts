// Shared handler for the blog and community subscribe API routes: validates
// the email, creates an unverified subscriber, and sends the verification
// email. The routes differ only in subscription type, sender address, and the
// already-subscribed message.

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { SubscriberService, type SubscriptionType } from '@/lib/supabase';
import { getEmailTemplate } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type SubscribeConfig = {
  type: SubscriptionType;
  /** "From" header for the verification email. */
  from: string;
  /** Error message returned when the email is already verified. */
  alreadySubscribedError: string;
  /** Prefix for server-side error logs, e.g. "Blog subscription error:". */
  errorLogLabel: string;
};

export async function handleSubscribe(request: NextRequest, config: SubscribeConfig) {
  try {
    const body = await request.json();
    const { email } = subscribeSchema.parse(body);

    const existingSubscriber = await SubscriberService.checkExistingSubscriber(email, config.type);

    if (existingSubscriber) {
      if (existingSubscriber.verified) {
        return NextResponse.json(
          {
            error: config.alreadySubscribedError,
            message: 'Already subscribed'
          },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          {
            error: 'Please check your email and verify your subscription.',
            message: 'Verification pending'
          },
          { status: 400 }
        );
      }
    }

    const verificationToken = uuidv4();
    const subscriber = await SubscriberService.createSubscriber(email, config.type, verificationToken);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verificationUrl = `${appUrl}/api/verify?token=${verificationToken}`;
    const unsubscribeUrl = `${appUrl}/unsubscribe?token=${subscriber.unsubscribe_token}`;

    const emailTemplate = getEmailTemplate({
      email,
      verificationUrl,
      unsubscribeUrl,
      type: config.type
    });

    const emailResult = await resend.emails.send({
      from: config.from,
      to: [email],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    if (emailResult.error) {
      console.error('Failed to send email:', emailResult.error);
      return NextResponse.json(
        {
          error: 'Failed to send verification email. Please try again.',
          details: emailResult.error
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Welcome! Please check your email to confirm your subscription.',
      emailId: emailResult.data?.id
    });

  } catch (error) {
    console.error(config.errorLogLabel, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.errors[0]?.message || 'Invalid email address',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Something went wrong. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
