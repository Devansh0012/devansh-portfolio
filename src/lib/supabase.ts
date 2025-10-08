import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Subscriber {
  id: string;
  email: string;
  subscription_type: 'community' | 'blog';
  verified: boolean;
  verification_token: string | null;
  unsubscribe_token: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  verified_at: string | null;
  unsubscribed_at: string | null;
}

// Database helper functions
export class SubscriberService {
  
  /**
   * Create a new subscriber with verification token
   */
  static async createSubscriber(email: string, type: 'community' | 'blog', verificationToken: string) {
    const { data, error } = await supabase
      .from('subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        subscription_type: type,
        verification_token: verificationToken,
        verified: false,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create subscriber: ${error.message}`);
    }

    return data as Subscriber;
  }

  /**
   * Verify a subscriber using verification token
   */
  static async verifySubscriber(verificationToken: string) {
    const { data, error } = await supabase
      .from('subscribers')
      .update({
        verified: true,
        verified_at: new Date().toISOString(),
        verification_token: null, // Clear token after verification
      })
      .eq('verification_token', verificationToken)
      .eq('verified', false)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to verify subscriber: ${error.message}`);
    }

    if (!data) {
      throw new Error('Invalid or expired verification token');
    }

    return data as Subscriber;
  }

  /**
   * Check if email already exists for a subscription type
   */
  static async checkExistingSubscriber(email: string, type: 'community' | 'blog') {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('subscription_type', type)
      .is('unsubscribed_at', null)
      .single();

    // If no error and data exists, subscriber already exists
    if (!error && data) {
      return data as Subscriber;
    }

    // If error is not "No rows returned", throw it
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to check subscriber: ${error.message}`);
    }

    return null;
  }

  /**
   * Unsubscribe a subscriber using unsubscribe token
   */
  static async unsubscribeSubscriber(unsubscribeToken: string) {
    const { data, error } = await supabase
      .from('subscribers')
      .update({
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('unsubscribe_token', unsubscribeToken)
      .is('unsubscribed_at', null)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to unsubscribe: ${error.message}`);
    }

    if (!data) {
      throw new Error('Invalid unsubscribe token or already unsubscribed');
    }

    return data as Subscriber;
  }

  /**
   * Get subscriber by unsubscribe token
   */
  static async getSubscriberByUnsubscribeToken(unsubscribeToken: string) {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('unsubscribe_token', unsubscribeToken)
      .single();

    if (error) {
      throw new Error(`Failed to get subscriber: ${error.message}`);
    }

    return data as Subscriber;
  }

  /**
   * Get all verified subscribers for a specific type
   */
  static async getVerifiedSubscribers(type: 'community' | 'blog') {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('subscription_type', type)
      .eq('verified', true)
      .is('unsubscribed_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get subscribers: ${error.message}`);
    }

    return data as Subscriber[];
  }

  /**
   * Get subscriber statistics
   */
  static async getSubscriberStats() {
    const { data, error } = await supabase
      .from('subscriber_stats')
      .select('*')
      .order('month', { ascending: false });

    if (error) {
      throw new Error(`Failed to get subscriber stats: ${error.message}`);
    }

    return data;
  }
}