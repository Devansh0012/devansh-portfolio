-- Email Subscribers Table
-- Run this SQL in your Supabase SQL Editor

-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  subscription_type VARCHAR(50) NOT NULL CHECK (subscription_type IN ('community', 'blog')),
  verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255) UNIQUE,
  unsubscribe_token VARCHAR(255) UNIQUE DEFAULT gen_random_uuid(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_type ON subscribers(subscription_type);
CREATE INDEX IF NOT EXISTS idx_subscribers_verified ON subscribers(verified);
CREATE INDEX IF NOT EXISTS idx_subscribers_verification_token ON subscribers(verification_token);
CREATE INDEX IF NOT EXISTS idx_subscribers_unsubscribe_token ON subscribers(unsubscribe_token);
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscribers_updated_at 
    BEFORE UPDATE ON subscribers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for new subscriptions
CREATE POLICY "Allow anonymous subscription inserts" 
ON subscribers FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow anonymous reads for verification and unsubscribe
CREATE POLICY "Allow anonymous verification reads" 
ON subscribers FOR SELECT 
TO anon 
USING (verification_token IS NOT NULL OR unsubscribe_token IS NOT NULL);

-- Allow anonymous updates for verification and unsubscribe
CREATE POLICY "Allow anonymous verification updates" 
ON subscribers FOR UPDATE 
TO anon 
USING (verification_token IS NOT NULL OR unsubscribe_token IS NOT NULL);

-- Create a view for subscriber statistics (optional)
CREATE OR REPLACE VIEW subscriber_stats AS
SELECT 
  subscription_type,
  COUNT(*) as total_subscribers,
  COUNT(*) FILTER (WHERE verified = true) as verified_subscribers,
  COUNT(*) FILTER (WHERE unsubscribed_at IS NULL AND verified = true) as active_subscribers,
  DATE_TRUNC('month', created_at) as month
FROM subscribers 
WHERE unsubscribed_at IS NULL
GROUP BY subscription_type, DATE_TRUNC('month', created_at)
ORDER BY month DESC;