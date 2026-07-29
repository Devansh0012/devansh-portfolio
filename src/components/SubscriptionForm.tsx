"use client";

import { useId, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { SubscriptionType } from "@/lib/supabase";

interface SubscriptionFormProps {
  type: SubscriptionType;
  placeholder?: string;
  buttonText?: string;
  className?: string;
}

/**
 * Email capture, rebuilt around four laws:
 *
 * - Postel's Law ("be liberal in what you accept"). The raw field value used to
 *   be posted verbatim, so " Me@Example.com " — a stray space from a paste, a
 *   capitalised address — could be rejected or stored as a duplicate. It's now
 *   trimmed and lower-cased before it leaves the browser. One field is asked
 *   for, because one is all that's needed.
 * - Doherty Threshold. Submitting shows a spinner and a changed label inside
 *   the same button, so the interface visibly responds well under 400ms even
 *   when the network doesn't.
 * - Zeigarnik Effect / Goal-Gradient. Subscribing is genuinely a two-part task
 *   (submit, then confirm by email). Saying so — and numbering it — is what
 *   turns a half-finished signup into a completed one instead of a silent
 *   drop-off.
 * - Peak-End Rule. Success and failure both get a real, specific message
 *   rather than a colour change.
 */
function SubscriptionFormContent({
  type,
  placeholder = "you@company.com",
  buttonText = "Subscribe",
  className = "",
}: SubscriptionFormProps) {
  const fieldId = useId();
  const statusId = `${fieldId}-status`;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const searchParams = useSearchParams();
  const isVerified = searchParams.get("verified") === "true";
  const urlError = searchParams.get("error");
  const urlErrorMessage = searchParams.get("message");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Normalise before validating or sending. Whatever shape the visitor typed
    // it in, the server sees one canonical address.
    const normalized = email.trim().toLowerCase();
    if (!normalized) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/${type}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text:
            data.message ||
            "Step 2 of 2 — check your inbox and confirm to finish subscribing.",
        });
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: data.error || "Something went wrong. Please try again.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Network error. Check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Confirmed via the email link: a terminal success state, no form needed.
  if (isVerified) {
    return (
      <div className={`space-y-3 ${className}`}>
        <p
          role="status"
          className="flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200"
        >
          <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          {type === "community"
            ? "You're in. Check your email for next steps."
            : "Subscription confirmed. Your first digest is on the way."}
        </p>
      </div>
    );
  }

  const hasUrlError = Boolean(urlError);

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`} noValidate={false}>
      {/* A failed verification link previously replaced the whole component
          with an error card whose retry form could never show its own result —
          the success and error states were rendered in the *other* branch. The
          banner is now shown above one single form, so retrying works. */}
      {hasUrlError && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <span>
            {urlError === "missing-token"
              ? "That confirmation link was incomplete."
              : "That confirmation link is invalid or has expired."}{" "}
            You can request a new one below.
            {urlErrorMessage && (
              <span className="mt-1 block text-xs text-red-300/80">
                {decodeURIComponent(urlErrorMessage)}
              </span>
            )}
          </span>
        </p>
      )}

      {/* Law of Proximity: label, field, and helper text form one visual unit,
          so it's never ambiguous which text belongs to which input. */}
      <label htmlFor={fieldId} className="block text-sm font-medium text-neutral-300">
        Email address
      </label>
      <input
        id={fieldId}
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        placeholder={placeholder}
        disabled={loading}
        autoComplete="email"
        inputMode="email"
        spellCheck={false}
        aria-describedby={`${statusId} ${fieldId}-hint`}
        aria-invalid={message?.type === "error" || undefined}
        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-white/40 disabled:opacity-50"
      />

      <Button type="submit" disabled={loading || !email.trim()} variant="primary" className="w-full">
        {loading ? (
          <>
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          buttonText
        )}
      </Button>

      {/* aria-live so the outcome reaches a screen reader; it was previously
          only communicated visually. */}
      <div id={statusId} role="status" aria-live="polite" className="empty:hidden">
        {message && (
          <p
            className={`flex items-start gap-2 rounded-xl border p-4 text-sm ${
              message.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                : "border-red-500/30 bg-red-500/10 text-red-200"
            }`}
          >
            {message.type === "success" ? (
              <MailCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            )}
            {message.text}
          </p>
        )}
      </div>

      <p id={`${fieldId}-hint`} className="text-xs text-neutral-500">
        No spam — just the good stuff. Unsubscribe in one click, any time.
      </p>
    </form>
  );
}

export default function SubscriptionForm(props: SubscriptionFormProps) {
  return (
    <Suspense
      fallback={
        // Matches the real form's dimensions so nothing shifts when it swaps in.
        <div className={`space-y-3 ${props.className ?? ""}`} aria-hidden="true">
          <div className="h-5 w-28 rounded bg-white/10" />
          <div className="h-[46px] w-full rounded-xl border border-white/10 bg-white/5" />
          <div className="h-[44px] w-full rounded-full bg-white/20" />
          <div className="h-4 w-56 rounded bg-white/5" />
        </div>
      }
    >
      <SubscriptionFormContent {...props} />
    </Suspense>
  );
}
