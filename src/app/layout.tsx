import type { Metadata, Viewport } from "next";
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
    default: "Devansh Dubey — AI Infrastructure Engineer",
    template: "%s | Devansh Dubey",
  },
  description:
    "Software Engineer at Palo Alto Networks building AI gateway infrastructure, MCP systems, OAuth integrations, and resilient developer platforms.",
  keywords: [
    "Devansh Dubey",
    "Software Engineer",
    "Backend",
    "Distributed Systems",
    "AI Gateway",
    "Model Context Protocol",
    "MCP",
    "OAuth",
    "Portkey",
    "Palo Alto Networks",
    "Next.js Portfolio",
  ],
  authors: [{ name: "Devansh Dubey", url: "https://www.devanshdubey.com" }],
  openGraph: {
    title: "Devansh Dubey — AI Infrastructure Engineer",
    description:
      "Explore Devansh's work across Palo Alto Networks, Portkey AI, MCP infrastructure, provider integrations, and distributed systems.",
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
    title: "Devansh Dubey — AI Infrastructure Engineer",
    description:
      "Software Engineer at Palo Alto Networks building AI gateway infrastructure, MCP systems, and resilient developer platforms.",
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

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  // Never block pinch-zoom — capping the scale locks out low-vision users.
  maximumScale: 5,
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
        {/* First tab stop: lets keyboard users jump the navbar (Jakob's Law —
            this is the convention they already expect). */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <Footer />
        </div>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
