import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { SubscriberService } from '@/lib/supabase';
import { getEmailTemplate } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { email } = subscribeSchema.parse(body);

    // Check if subscriber already exists
    const existingSubscriber = await SubscriberService.checkExistingSubscriber(email, 'community');
    
    if (existingSubscriber) {
      if (existingSubscriber.verified) {
        return NextResponse.json(
          { 
            error: 'You are already subscribed to the community waitlist!',
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

    // Generate verification token
    const verificationToken = uuidv4();
    
    // Create subscriber in database
    const subscriber = await SubscriberService.createSubscriber(email, 'community', verificationToken);

    // Generate email URLs
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verificationUrl = `${appUrl}/api/verify?token=${verificationToken}`;
    const unsubscribeUrl = `${appUrl}/unsubscribe?token=${subscriber.unsubscribe_token}`;

    // Get email template
    const emailTemplate = getEmailTemplate({
      email,
      verificationUrl,
      unsubscribeUrl,
      type: 'community'
    });

    // Send verification email
    const emailResult = await resend.emails.send({
      from: 'Devansh Dubey <community@devanshdubey.com>',
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
    console.error('Community subscription error:', error);
    
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