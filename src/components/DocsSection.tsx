'use client';

import Link from 'next/link';
import { DataField, SceneFrame } from './three/ClientScenes';

export default function DocsSection() {
  return (
    <section id="docs" style={{ padding: '80px 24px', position: 'relative', zIndex: 2 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }} className="bp-glass">
        <div className="bp-docs-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 0 }}>
          <div style={{ padding: 36 }}>
            <div className="bp-mono" style={{ color: 'var(--bp-neon2)', fontSize: 11, letterSpacing: '0.28em', marginBottom: 14 }}>
              DOCUMENTATION
            </div>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 800, margin: '0 0 16px' }}>
              Build with Blockpass
            </h2>
            <p className="bp-mono" style={{ fontSize: 13, color: 'var(--bp-muted)', lineHeight: 1.8, maxWidth: 520, marginBottom: 28 }}>
              ERC-1155 on Base Sepolia. Mint with <code>mintTicket(tierId, amount)</code>, verify via{' '}
              <code>balanceOf</code>, cancel with <code>cancelTicket(holder, id, amount)</code>. Visual shell now
              runs on ThreeUI Community components.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/marketplace" className="bp-btn bp-btn-solid">
                Open Marketplace
              </Link>
              <Link href="/create-event" className="bp-btn">
                Create Event
              </Link>
            </div>
          </div>
          <SceneFrame height="100%" style={{ minHeight: 320, borderRadius: '0 18px 18px 0' }}>
            <DataField mode="dark" speed={1} opacity={1} />
          </SceneFrame>
        </div>
      </div>
    </section>
  );
}
