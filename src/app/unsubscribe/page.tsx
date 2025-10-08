"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function UnsubscribeContent() {
  const [loading, setLoading] = useState(false);
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const type = searchParams.get('type') as 'community' | 'blog' | null;
  const already = searchParams.get('already') === 'true';
  const urlError = searchParams.get('error');
  const errorMessage = searchParams.get('message');

  const handleUnsubscribe = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setUnsubscribed(true);
      } else {
        setError(data.error || 'Failed to unsubscribe. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Already unsubscribed
  if (already) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 pb-24 pt-32 text-center">
          <div className="glass-card rounded-3xl p-12 shadow-xl">
            <div className="text-6xl mb-6">📭</div>
            <h1 className="text-3xl font-semibold text-slate-100 mb-4">Already Unsubscribed</h1>
            <p className="text-slate-300 mb-6">
              The email address <strong>{email && decodeURIComponent(email)}</strong> is already unsubscribed.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/community"
                className="glass-card glass-hover inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-slate-100 transition-all duration-300 hover:-translate-y-0.5"
              >
                Back to Community
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-slate-500/30 px-6 py-3 text-sm font-semibold text-slate-100 transition-all duration-300 hover:border-slate-400 hover:bg-slate-700/20"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (urlError) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 pb-24 pt-32 text-center">
          <div className="glass-card rounded-3xl p-12 shadow-xl">
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-3xl font-semibold text-slate-100 mb-4">Unsubscribe Error</h1>
            <p className="text-slate-300 mb-2">
              {urlError === 'missing-token' && 'Invalid unsubscribe link.'}
              {urlError === 'invalid-token' && 'This unsubscribe link is invalid or has expired.'}
            </p>
            {errorMessage && (
              <p className="text-slate-400 text-sm mb-6">{decodeURIComponent(errorMessage)}</p>
            )}
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:work@devanshdubey.com"
                className="glass-card glass-hover inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-slate-100 transition-all duration-300 hover:-translate-y-0.5"
              >
                Contact Support
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-slate-500/30 px-6 py-3 text-sm font-semibold text-slate-100 transition-all duration-300 hover:border-slate-400 hover:bg-slate-700/20"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (unsubscribed) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 pb-24 pt-32 text-center">
          <div className="glass-card rounded-3xl p-12 shadow-xl">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-semibold text-slate-100 mb-4">Successfully Unsubscribed</h1>
            <p className="text-slate-300 mb-6">
              You&apos;ve been unsubscribed from the {type === 'community' ? 'community waitlist' : 'blog newsletter'}. 
              We&apos;re sorry to see you go!
            </p>
            <div className="glass-card rounded-2xl p-6 mb-6 bg-slate-800/50">
              <p className="text-slate-300 text-sm">
                Changed your mind? You can always subscribe again from the{' '}
                <Link href={type === 'community' ? '/community' : '/blog'} className="text-blue-400 hover:text-blue-300">
                  {type === 'community' ? 'community page' : 'blog page'}
                </Link>.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={type === 'community' ? '/community' : '/blog'}
                className="glass-card glass-hover inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-slate-100 transition-all duration-300 hover:-translate-y-0.5"
              >
                {type === 'community' ? 'Community' : 'Blog'}
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-slate-500/30 px-6 py-3 text-sm font-semibold text-slate-100 transition-all duration-300 hover:border-slate-400 hover:bg-slate-700/20"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation state
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 pb-24 pt-32 text-center">
        <div className="glass-card rounded-3xl p-12 shadow-xl">
          <div className="text-6xl mb-6">😢</div>
          <h1 className="text-3xl font-semibold text-slate-100 mb-4">Confirm Unsubscribe</h1>
          <p className="text-slate-300 mb-2">
            Are you sure you want to unsubscribe <strong>{email && decodeURIComponent(email)}</strong> from the{' '}
            <strong>{type === 'community' ? 'community waitlist' : 'blog newsletter'}</strong>?
          </p>
          <p className="text-slate-400 text-sm mb-8">
            You&apos;ll no longer receive {type === 'community' 
              ? 'community updates, early access to workshops, or hackathon invites' 
              : 'monthly engineering insights and deep dives'}.
          </p>
          
          {error && (
            <div className="glass-card rounded-xl p-4 border-red-500/30 bg-red-500/10 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-red-400">✗</span>
                <p className="text-sm text-red-300 font-medium">{error}</p>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleUnsubscribe}
              disabled={loading || !token}
              className="bg-red-500 hover:bg-red-600 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Yes, Unsubscribe'}
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-500/30 px-6 py-3 text-sm font-semibold text-slate-100 transition-all duration-300 hover:border-slate-400 hover:bg-slate-700/20"
            >
              Keep Subscription
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 pb-24 pt-32 text-center">
          <div className="glass-card rounded-3xl p-12 shadow-xl">
            <div className="text-6xl mb-6">⏳</div>
            <h1 className="text-3xl font-semibold text-slate-100 mb-4">Loading...</h1>
          </div>
        </div>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}