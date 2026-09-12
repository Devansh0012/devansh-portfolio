/**
 * Single source of truth for the site's outbound links and contact details.
 *
 * These were previously hardcoded in seven places across the navbar, recruiter
 * page, terminal, footer, and unsubscribe flow — with two different email
 * addresses in circulation. A visitor who sees a different address on every
 * page can't build a stable mental model of how to reach you, so they all
 * resolve here.
 */

export const SITE = {
  name: "Devansh Dubey",
  role: "Software Engineer at Palo Alto Networks",
  url: "https://www.devanshdubey.com",
  email: "devanshdubey0012@gmail.com",
  resumeUrl: "/Devansh_Dubey_Resume.pdf",
  github: "https://github.com/Devansh0012",
  githubHandle: "@Devansh0012",
  linkedin: "https://www.linkedin.com/in/devanshdubey1/",
  linkedinHandle: "devanshdubey1",
} as const;

export const mailto = (subject?: string) =>
  subject
    ? `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${SITE.email}`;
