import type { AnchorHTMLAttributes, DetailedHTMLProps, HTMLAttributes } from "react";
import Link from "next/link";
import type { Route } from "next";
import { clsx } from "clsx";

const Anchor = ({
  href = "",
  children,
  className,
  ...rest
}: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => {
  const composedClass = clsx(
    "font-semibold text-blue-400 underline decoration-dotted underline-offset-4 hover:text-blue-300",
    className,
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
      </a>
    );
  }

  return (
    <Link href={href as Route} className={composedClass}>
      {children}
    </Link>
  );
};

const Heading = (
  Tag: "h1" | "h2" | "h3" | "h4",
  className: string,
) =>
  function HeadingComponent({ children, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
    return (
      <Tag className={className} {...props}>
        {children}
      </Tag>
    );
  };

export const mdxComponents = {
  a: Anchor,
  h1: Heading("h1", "mt-12 scroll-m-20 text-4xl font-bold tracking-tight text-slate-900 first:mt-0"),
  h2: Heading("h2", "mt-12 scroll-m-20 border-b border-slate-200 pb-2 text-3xl font-semibold tracking-tight"),
  h3: Heading("h3", "mt-10 scroll-m-20 text-2xl font-semibold tracking-tight"),
  h4: Heading("h4", "mt-8 scroll-m-20 text-xl font-semibold tracking-tight"),
  p: ({ children, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>) => (
    <p className="leading-7 text-slate-300" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>) => (
    <ul className="my-6 ml-6 list-disc space-y-2 text-slate-300" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLOListElement>, HTMLOListElement>) => (
    <ol className="my-6 ml-6 list-decimal space-y-2 text-slate-300" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement>) => (
    <li className="pl-2 text-slate-300" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>) => (
    <blockquote className="mt-6 border-l-4 border-blue-400/60 bg-blue-100/40 px-4 py-3 text-sm italic text-slate-600" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ children, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) => (
    <code className="rounded bg-slate-900 px-1.5 py-0.5 text-[0.85em] font-semibold text-slate-100" {...props}>
      {children}
    </code>
  ),
  pre: ({ children, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>) => (
    <pre className="my-6 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-900 p-4 text-sm text-slate-50" {...props}>
      {children}
    </pre>
  ),
};
