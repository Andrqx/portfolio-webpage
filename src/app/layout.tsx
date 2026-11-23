import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono, Doto } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Dot-matrix display face for headings.
const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Andrew Evans | Mechanical Engineer",
  description: "Portfolio of Andrew Evans, mechanical engineering student at McMaster University and former chassis lead at Mac Formula Electric.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Next 16 only turns off the CSS smooth scrolling during route changes when
      // this is set, so moving between pages jumps instead of animating the scroll.
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${geistMono.variable} ${doto.variable} h-full antialiased`}
    >
      <head>
        {/*
          GitHub Pages serves static files and can't set response headers, so
          the policy has to ride along in a meta tag. That rules out
          frame-ancestors (meta-delivered CSP ignores it), and script-src is
          left off deliberately: Next's static export inlines the RSC payload
          as <script> blocks and needs a nonce to lock that down, which needs a
          server we don't have. Restricting it here would mean 'unsafe-inline'
          anyway, which buys nothing. These three directives cost nothing on a
          site with no object/embed, no <base>, and no forms, and they close
          off the usual escalation paths if injected markup ever lands.
        */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="object-src 'none'; base-uri 'self'; form-action 'self'"
        />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="noise-overlay" />
        <div className="relative z-10 flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}
