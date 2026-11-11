import type { Metadata } from 'next';
import { Syne, Space_Mono } from 'next/font/google';
import '@designcodeio/threeui/style.css';
import './globals.css';
import { Providers } from './providers';

const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space',
});

export const metadata: Metadata = {
  title: 'Blockpass — Web3 Ticketing · ThreeUI Kage',
  description: 'Mint, trade, and verify event tickets as NFTs — home powered by ThreeUI KageLandingPage.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${spaceMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
