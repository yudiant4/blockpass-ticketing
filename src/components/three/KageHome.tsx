'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Prefer the package path export — barrel `@designcodeio/threeui` also pulls
// Gallery.js (legacy three encodings) and breaks Next/webpack.
const KageLandingPage = dynamic(
  () =>
    import('@designcodeio/threeui/components/KageLandingPage').then(
      (m) => m.KageLandingPage
    ),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: '100vh',
          background: '#05070a',
          display: 'grid',
          placeItems: 'center',
          color: '#dfe7e0',
          fontFamily: 'Space Mono, monospace',
          letterSpacing: '0.2em',
        }}
      >
        LOADING BLOCKPASS…
      </div>
    ),
  }
);

/**
 * Full-viewport ThreeUI Kage landing as the Blockpass home experience,
 * with a thin Blockpass nav overlay for marketplace / wallet entry.
 */
export default function KageHome() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#05070a' }}>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '16px 24px',
          background: 'linear-gradient(180deg, rgba(5,7,10,0.88) 0%, rgba(5,7,10,0) 100%)',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: 'Space Mono, monospace',
              fontWeight: 700,
              letterSpacing: '0.16em',
              color: '#00f5c4',
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            BLOCK<span style={{ color: '#dfe7e0' }}>PASS</span>
          </Link>
          <Link href="/marketplace" className="bp-btn" style={{ pointerEvents: 'auto', padding: '8px 14px' }}>
            Marketplace
          </Link>
          <Link href="/create-event" className="bp-btn" style={{ pointerEvents: 'auto', padding: '8px 14px' }}>
            Create Event
          </Link>
          <Link href="/verify" className="bp-btn" style={{ pointerEvents: 'auto', padding: '8px 14px' }}>
            Verify
          </Link>
        </div>
        <div style={{ pointerEvents: 'auto' }}>
          <ConnectButton />
        </div>
      </header>

      <KageLandingPage
        primaryColor="#00f5c4"
        headingSize={1}
        bodySize={1}
        style={{
          width: '100%',
          minHeight: '100vh',
          height: '100vh',
          border: 'none',
          display: 'block',
        }}
      />

      <div
        style={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          zIndex: 40,
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
        }}
      >
        <Link href="/marketplace" className="bp-btn bp-btn-solid">
          Explore Tickets
        </Link>
        <Link href="/login" className="bp-btn">
          Sign In
        </Link>
      </div>
    </div>
  );
}
