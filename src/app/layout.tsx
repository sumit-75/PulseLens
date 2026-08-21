import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PulseLens — Mini Observability Platform',
  description: 'Real-time logs, metrics time-series, and automated alert monitoring platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
