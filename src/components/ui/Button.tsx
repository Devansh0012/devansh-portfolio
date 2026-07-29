import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  // Law of Prägnanz: one simple, repeated pill shape for every action on the
  // site, so "this is clickable" needs no re-learning per page.
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  "transition-all duration-200 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  // Fitts's Law: guarantee a comfortable touch target regardless of label length.
  "min-h-[44px]";

const variants: Record<Variant, string> = {
  // Von Restorff Effect: exactly one high-contrast fill. If every action is
  // white-on-black, nothing reads as *the* next step, so `primary` is reserved
  // for the single most important action in a view.
  primary:
    "bg-white text-black border border-white hover:bg-neutral-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/20 active:translate-y-0",
  secondary:
    "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40 hover:-translate-y-0.5 active:translate-y-0",
  ghost: "text-white hover:bg-white/10",
  outline: "border border-white/20 text-white hover:bg-white/5 hover:border-white/40",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

/**
 * Shared visual recipe for anything that should *look* like a button.
 *
 * Exported so links can be styled as buttons directly:
 *
 *   <Link href="/x" className={buttonVariants({ variant: "primary" })}>…</Link>
 *
 * Pages previously wrapped `<Button>` inside `<Link>`, which renders a
 * `<button>` nested in an `<a>`. That's invalid HTML: browsers and assistive
 * tech disagree about which element receives the activation, so the control can
 * be announced twice or swallow the Enter key.
 */
export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
);

Button.displayName = "Button";

export { Button };
