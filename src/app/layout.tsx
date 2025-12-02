import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.devanshdubey.com"),
  title: {
    default: "Devansh Dubey — Engineer, Builder, Storyteller",
    template: "%s | Devansh Dubey",
  },
  description:
    "Software Development Engineer crafting resilient distributed systems, hackathon winner, and lifelong learner.",
  keywords: [
    "Devansh Dubey",
    "Software Engineer",
    "Backend",
    "Distributed Systems",
    "Next.js Portfolio",
  ],
  authors: [{ name: "Devansh Dubey", url: "https://www.devanshdubey.com" }],
  openGraph: {
    title: "Devansh Dubey — Engineer, Builder, Storyteller",
    description:
      "Explore Devansh's work across backend engineering, hackathon wins, and community projects.",
    url: "https://www.devanshdubey.com",
    siteName: "Devansh Dubey Portfolio",
    images: [
      {
        url: "/og-cover.png",
        alt: "Devansh Dubey Portfolio",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@devanshdubey",
    creator: "@devanshdubey",
    title: "Devansh Dubey — Engineer, Builder, Storyteller",
    description:
      "Backend engineer crafting resilient infrastructure, hackathon champion, and NASA Space Apps nominee.",
    images: ["/og-cover.png"],
  },
  alternates: {
    canonical: "https://www.devanshdubey.com",
    languages: {
      "en-US": "https://www.devanshdubey.com",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Devansh Dubey — Engineering Log"
          href="/rss.xml"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black text-white antialiased`}
      >
        <div className="relative min-h-screen">
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <SpeedInsights />
            <Analytics />
          </div>
        </div>
      </body>
    </html>
  );
}
