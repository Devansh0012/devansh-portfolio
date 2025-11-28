import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, variant = "primary", size = "md", asChild: _asChild = false, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      primary: "bg-white text-black border border-white hover:bg-neutral-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/25",
      secondary: "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/25",
      ghost: "text-white hover:bg-white/10 hover:text-white",
      outline: "border border-white/20 text-white hover:bg-white/5 hover:border-white/40",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
