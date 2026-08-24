import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';

export const metadata: Metadata = {
  title: 'PulseLens — Real-Time Observability & Telemetry Platform',
  description: 'Real-time logs, metrics time-series, and automated alert monitoring platform.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.cdnfonts.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.cdnfonts.com/css/instagram-sans"
        />
      </head>
      <body className="min-h-screen bg-[#0e0d08] text-[#e2e7e3] flex flex-col font-sans selection:bg-[#e2e7e3]/20 selection:text-[#e2e7e3]">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
