"use client";

import { useState, Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import { AlertCircle, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { mailto } from "@/lib/site";
import type { SubscriptionType } from "@/lib/supabase";

/**
 * Unsubscribe flow.
 *
 * Brought onto the site's black palette (it was the last page still rendering
 * on `bg-slate-950` with blue links) and restructured around one idea: leaving
 * should be as frictionless as joining.
 *
 * Peak-End Rule cuts hardest here. This is the last interaction many
 * subscribers will ever have, and a grudging, guilt-tripping unsubscribe is
 * exactly the ending people remember. So: the destructive action is a single
 * clear button, the escape hatch is equally reachable, and the "sorry to see
 * you go" framing is dropped in favour of telling them precisely what changed
 * and how to come back.
 */

function Shell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex max-w-2xl flex-col px-4 pb-24 pt-24">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12">
          <h1 className="text-3xl font-semibold text-white">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}

function UnsubscribeContent() {
  const [loading, setLoading] = useState(false);
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const type = searchParams.get("type") as SubscriptionType | null;
  const already = searchParams.get("already") === "true";
  const urlError = searchParams.get("error");
  const errorMessage = searchParams.get("message");

  const listName = type === "community" ? "community waitlist" : "blog newsletter";
  const returnPath = (type === "community" ? "/community" : "/blog") as Route;
  const returnLabel = type === "community" ? "community page" : "blog page";

  const handleUnsubscribe = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setUnsubscribed(true);
      } else {
        setError(data.error || "Failed to unsubscribe. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (already) {
    return (
      <Shell title="You're already unsubscribed">
        <p className="mt-4 text-neutral-300">
          {email ? decodeURIComponent(email) : "That address"} isn&apos;t on the list, so there&apos;s
          nothing to do here.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={returnPath} className={buttonVariants({ variant: "secondary" })}>
            Back to the {returnLabel}
          </Link>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Home
          </Link>
        </div>
      </Shell>
    );
  }

  if (urlError) {
    return (
      <Shell title="That link didn't work">
        <p className="mt-4 text-neutral-300">
          {urlError === "missing-token"
            ? "The unsubscribe link was incomplete."
            : "This unsubscribe link is invalid or has expired."}
        </p>
        {errorMessage && (
          <p className="mt-2 text-sm text-neutral-500">{decodeURIComponent(errorMessage)}</p>
        )}
        {/* Tesler's Law: some complexity can't be removed — a broken token
            genuinely can't be resolved in the browser. What can be removed is
            the visitor's share of it, so the fallback is a one-click email
            with the subject pre-filled rather than "contact support". */}
        <p className="mt-6 text-sm text-neutral-400">
          Email me and I&apos;ll remove you manually — no reply needed from you beyond that.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={mailto("Please unsubscribe me")} className={buttonVariants()}>
            Email me to unsubscribe
          </a>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Home
          </Link>
        </div>
      </Shell>
    );
  }

  if (unsubscribed) {
    return (
      <Shell title="Unsubscribed">
        <p className="mt-4 text-neutral-300">
          You&apos;ve been removed from the {listName}. No further emails will be sent.
        </p>
        <p className="mt-4 text-sm text-neutral-400">
          Changed your mind? You can resubscribe any time from the{" "}
          <Link
            href={returnPath}
            className="font-medium text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
          >
            {returnLabel}
          </Link>
          .
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={returnPath} className={buttonVariants({ variant: "secondary" })}>
            Back to the {returnLabel}
          </Link>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Home
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title="Confirm unsubscribe">
      <p className="mt-4 text-neutral-300">
        Remove{" "}
        <strong className="font-semibold text-white">
          {email ? decodeURIComponent(email) : "your address"}
        </strong>{" "}
        from the {listName}?
      </p>
      <p className="mt-3 text-sm text-neutral-400">
        You&apos;ll stop receiving{" "}
        {type === "community"
          ? "community updates, early workshop access, and hackathon invites"
          : "the monthly engineering digest and deep dives"}
        .
      </p>

      {error && (
        <p
          role="alert"
          className="mt-6 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          {error}
        </p>
      )}

      {!token && (
        <p
          role="alert"
          className="mt-6 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          This link is missing its confirmation token, so the button below is disabled. Use the
          unsubscribe link from the original email, or{" "}
          <a href={mailto("Please unsubscribe me")} className="underline underline-offset-4">
            email me
          </a>
          .
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        {/* Destructive action, styled as such. The previous red pill was the
            single most prominent element on the page; here "keep it" is given
            equal weight so the choice isn't nudged either way. */}
        <button
          type="button"
          onClick={handleUnsubscribe}
          disabled={loading || !token}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-red-500/40 bg-red-500/15 px-5 text-sm font-semibold text-red-200 transition-colors hover:bg-red-500/25 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              Unsubscribing…
            </>
          ) : (
            "Yes, unsubscribe"
          )}
        </button>
        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
          Keep my subscription
        </Link>
      </div>
    </Shell>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <Shell title="Loading…">
          <p className="mt-4 text-sm text-neutral-400">Checking your unsubscribe link.</p>
        </Shell>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
