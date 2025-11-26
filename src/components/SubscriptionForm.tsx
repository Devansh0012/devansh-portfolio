"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface SubscriptionFormProps {
  type: 'community' | 'blog';
  placeholder?: string;
  buttonText?: string;
  className?: string;
}

function SubscriptionFormContent({ 
  type, 
  placeholder = "you@amazingteam.com", 
  buttonText = "Subscribe",
  className = ""
}: SubscriptionFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const searchParams = useSearchParams();
  const isVerified = searchParams.get('verified') === 'true';
  const error = searchParams.get('error');
  const errorMessage = searchParams.get('message');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/${type}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: data.message || 'Success! Please check your email to confirm your subscription.' 
        });
        setEmail("");
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Something went wrong. Please try again.' 
        });
      }
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Show verification success message
  if (isVerified) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="glass-card rounded-xl p-4 border-emerald-500/30 bg-emerald-500/10">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            <p className="text-sm text-emerald-300 font-medium">
              {type === 'community' 
                ? "Welcome to the community! Check your email for next steps." 
                : "Blog subscription confirmed! You'll receive your first digest soon."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show verification error message
  if (error) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="glass-card rounded-xl p-4 border-red-500/30 bg-red-500/10">
          <div className="flex items-center gap-2">
            <span className="text-red-400">✗</span>
            <div>
              <p className="text-sm text-red-300 font-medium">
                {error === 'verification-failed' ? 'Verification failed' : 'Error'}
              </p>
              {errorMessage && (
                <p className="text-xs text-red-400 mt-1">{decodeURIComponent(errorMessage)}</p>
              )}
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={placeholder}
            disabled={loading}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600 disabled:opacity-50"
          />
          <Button
            type="submit"
            disabled={loading || !email.trim()}
            variant="primary"
            size="md"
            className="w-full"
          >
            {loading ? 'Sending...' : buttonText}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      <label className="sr-only" htmlFor={`${type}-email`}>
        Email address
      </label>
      <input
        id={`${type}-email`}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder={placeholder}
        disabled={loading}
        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600 disabled:opacity-50"
      />
      <Button
        type="submit"
        disabled={loading || !email.trim()}
        variant="primary"
        size="md"
        className="w-full"
      >
        {loading ? 'Sending...' : buttonText}
      </Button>
      
      {message && (
        <div className={`glass-card rounded-xl p-4 ${
          message.type === 'success' 
            ? 'border-emerald-500/30 bg-emerald-500/10' 
            : 'border-red-500/30 bg-red-500/10'
        }`}>
          <div className="flex items-center gap-2">
            <span className={message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}>
              {message.type === 'success' ? '✓' : '✗'}
            </span>
            <p className={`text-sm ${
              message.type === 'success' ? 'text-emerald-300' : 'text-red-300'
            } font-medium`}>
              {message.text}
            </p>
          </div>
        </div>
      )}
      
      <p className="text-[0.7rem] text-slate-500">
        No spam—just the good stuff. You can opt out anytime.
      </p>
    </form>
  );
}

export default function SubscriptionForm(props: SubscriptionFormProps) {
  return (
    <Suspense fallback={
      <div className={`space-y-3 ${props.className}`}>
        <input
          disabled
          placeholder="Loading..."
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 shadow-sm opacity-50"
        />
        <Button
          disabled
          variant="primary"
          size="md"
          className="w-full"
        >
          Loading...
        </Button>
      </div>
    }>
      <SubscriptionFormContent {...props} />
    </Suspense>
  );
}