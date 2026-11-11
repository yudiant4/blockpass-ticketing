'use client';

import Link from 'next/link';
import {
  EmeraldHorizon,
  LiquidMetalButton,
  ParticleWordmark,
  SceneFrame,
} from './three/ClientScenes';

export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '120px 24px 80px',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.85 }}>
        <EmeraldHorizon speed={1.1} glow={1.2} hue={0.08} className="bp-hero-horizon" />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(180deg, rgba(5,7,12,0.15) 0%, rgba(5,7,12,0.55) 55%, rgba(5,7,12,0.92) 100%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <div className="bp-mono" style={{ color: 'var(--bp-neon)', fontSize: 11, letterSpacing: '0.28em', marginBottom: 20 }}>
          BLOCKPASS · POWERED BY THREEUI
        </div>

        <SceneFrame height={180} style={{ marginBottom: 18, borderRadius: 20 }}>
          <ParticleWordmark mode="dark" hue={0.55} saturation={1.1} brightness={1.05} />
        </SceneFrame>

        <h1
          style={{
            fontSize: 'clamp(40px, 8vw, 96px)',
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: '-0.03em',
            margin: '0 0 24px',
            maxWidth: 820,
          }}
        >
          BLOCK<span style={{ color: 'var(--bp-neon)' }}>PASS</span>
          <br />
          FOR <span style={{ color: 'var(--bp-neon)' }}>LIVE</span>
          <br />
          <span style={{ color: 'var(--bp-neon3)' }}>EVENTS.</span>
        </h1>

        <p
          className="bp-mono"
          style={{
            fontSize: 14,
            lineHeight: 1.8,
            color: 'var(--bp-muted)',
            maxWidth: 520,
            marginBottom: 36,
          }}
        >
          Mint, trade, and verify event tickets as NFTs on-chain — wrapped in ThreeUI motion fields,
          liquid metal CTAs, and neon particle type.
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/marketplace" className="bp-btn bp-btn-solid">
            Explore Tickets
          </Link>
          <LiquidMetalButton text="Sign In" variant="pill" rendering="colored" onClick={() => {
            window.location.href = '/login';
          }} />
        </div>
      </div>
    </section>
  );
}
