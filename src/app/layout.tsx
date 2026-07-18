import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyLens Connect",
  description: "Real-time study group chat — typing indicators, presence, read receipts, and pinned notes.",
};

// Runs before hydration to set data-theme synchronously, avoiding a flash of the
// wrong theme. Keep the storage key and default in sync with src/lib/theme.ts —
// this can't import that module since it must execute as a raw inline script.
const THEME_INIT_SCRIPT = `(function() {
  try {
    var stored = localStorage.getItem('studylens-theme');
    var theme = stored === 'dark' || stored === 'light' || stored === 'system' ? stored : 'dark';
    var resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    document.documentElement.setAttribute('data-theme', resolved);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
