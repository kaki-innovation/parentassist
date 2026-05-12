import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ParentAssist — Less thinking, more doing',
  description: 'AI-powered lifestyle app for Indian mothers in Australia. Smart meal plans, kids activities, and festival planning — all in one place.',
  openGraph: {
    title: 'ParentAssist',
    description: 'Less thinking, more doing ✨',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
