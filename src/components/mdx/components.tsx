import type {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  HTMLAttributes,
  TableHTMLAttributes,
} from "react";
import Link from "next/link";
import type { Route } from "next";
import { clsx } from "clsx";

/**
 * Article body styles.
 *
 * These were written for a light theme while the article page renders on a
 * dark one, which left real content unreadable:
 *
 * - `h1` was `text-slate-900` on a `bg-slate-900` page — black on black.
 * - `blockquote` was `text-slate-600` on `bg-blue-100/40` — a light-mode
 *   callout floating on a dark page.
 * - `pre` carried a `border-slate-200` hairline that glowed white.
 *
 * Everything below is dark-first and uses the site's neutral palette so an
 * article reads as the same product as the rest of the site (Law of
 * Similarity). Vertical rhythm is explicit: headings get more space above than
 * below, which is what makes a heading group with the text it introduces
 * rather than float between two blocks (Law of Proximity).
 */

const Anchor = ({
  href = "",
  children,
  className,
  ...rest
}: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => {
  const composedClass = clsx(
    // Links are underlined, not colour-only: colour alone fails for anyone with
    // a colour-vision deficiency, and an underline is the convention readers
    // already know (Jakob's Law).
    "font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white",
    className
  );

  if (!href) {
    return (
      <span className={composedClass} {...rest}>
        {children}
      </span>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} className={composedClass} {...rest}>
        {children}
      </a>
    );
  }

  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={composedClass}
        {...rest}
      >
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link href={href as Route} className={composedClass}>
      {children}
    </Link>
  );
};

const Heading = (Tag: "h1" | "h2" | "h3" | "h4", className: string) =>
  function HeadingComponent({
    children,
    ...props
  }: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
    return (
      <Tag className={className} {...props}>
        {children}
      </Tag>
    );
  };

export const mdxComponents = {
  a: Anchor,
  // `scroll-mt` keeps a heading clear of the sticky navbar when an in-page
  // anchor is followed; without it the target lands underneath the header.
  h1: Heading(
    "h1",
    "mt-14 scroll-mt-28 text-3xl font-bold tracking-tight text-white first:mt-0 md:text-4xl"
  ),
  h2: Heading(
    "h2",
    "mt-14 scroll-mt-28 border-b border-white/10 pb-3 text-2xl font-semibold tracking-tight text-white md:text-3xl"
  ),
  h3: Heading("h3", "mt-10 scroll-mt-28 text-xl font-semibold tracking-tight text-white md:text-2xl"),
  h4: Heading("h4", "mt-8 scroll-mt-28 text-lg font-semibold tracking-tight text-neutral-100"),
  p: ({ children, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>) => (
    <p className="mt-5 text-[1.0625rem] leading-8 text-neutral-300" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>) => (
    <ul className="my-6 ml-6 list-disc space-y-2 marker:text-neutral-600" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLOListElement>, HTMLOListElement>) => (
    <ol className="my-6 ml-6 list-decimal space-y-2 marker:text-neutral-600" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement>) => (
    <li className="pl-2 leading-7 text-neutral-300" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>) => (
    <blockquote
      className="my-8 border-l-2 border-white/40 bg-white/[0.03] px-5 py-4 text-base italic leading-7 text-neutral-200"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ children, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) => (
    <code
      className="rounded border border-white/10 bg-white/[0.07] px-1.5 py-0.5 font-mono text-[0.85em] text-neutral-100"
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ children, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>) => (
    <pre
      // tabIndex makes a horizontally scrolling code block reachable by
      // keyboard; without it the overflow is mouse-only.
      tabIndex={0}
      className="my-8 overflow-x-auto rounded-2xl border border-white/10 bg-neutral-950 p-5 font-mono text-sm leading-relaxed text-neutral-100 [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0"
      {...props}
    >
      {children}
    </pre>
  ),
  hr: (props: DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>) => (
    <hr className="my-12 border-white/10" {...props} />
  ),
  // Wide tables must scroll inside their own container rather than making the
  // whole page pan sideways.
  table: ({ children, ...props }: DetailedHTMLProps<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>) => (
    <div className="my-8 overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full border-collapse text-left text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>) => (
    <th
      className="border-b border-white/10 bg-white/5 px-4 py-3 font-semibold text-white"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>) => (
    <td className="border-b border-white/5 px-4 py-3 text-neutral-300" {...props}>
      {children}
    </td>
  ),
};
