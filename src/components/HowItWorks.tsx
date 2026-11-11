'use client';

import { ConnectivityGraph, SceneFrame } from './three/ClientScenes';

const steps = [
  {
    n: '01',
    title: 'Connect Wallet',
    body: 'Enter with MetaMask or an injected wallet. No email, no password — just chain identity.',
  },
  {
    n: '02',
    title: 'Mint Ticket NFT',
    body: 'Pick an event tier and confirm on Base Sepolia. Your pass lands in the wallet instantly.',
  },
  {
    n: '03',
    title: 'Verify on Entry',
    body: 'Door scan checks ERC-1155 balance. Zero fraud, full ownership, on-chain proof.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: '80px 24px', position: 'relative', zIndex: 2 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="bp-mono" style={{ color: 'var(--bp-neon)', fontSize: 11, letterSpacing: '0.28em', marginBottom: 14 }}>
          PROTOCOL
        </div>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, margin: '0 0 28px', maxWidth: 640 }}>
          How Blockpass Works
        </h2>

        <SceneFrame height={260} style={{ marginBottom: 36 }}>
          <ConnectivityGraph mode="dark" speed={1.1} density={1.2} opacity={0.95} />
        </SceneFrame>

        <div className="bp-grid-3">
          {steps.map((s) => (
            <div key={s.n} className="bp-glass" style={{ padding: 24 }}>
              <div className="bp-mono" style={{ color: 'var(--bp-neon)', fontSize: 12, letterSpacing: '0.2em', marginBottom: 14 }}>
                {s.n}
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 10px' }}>{s.title}</h3>
              <p className="bp-mono" style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--bp-muted)', margin: 0 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
