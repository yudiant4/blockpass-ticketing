'use client';

import Link from 'next/link';
import { BrandOrbs, SceneFrame } from './three/ClientScenes';

const nfts = [
  {
    name: 'VIP PASS',
    event: 'Web3 Dev Connect 2026',
    eventId: 'evt-web3-dev-connect',
    price: '0.003 ETH',
    badge: 'VIP',
    orb: 'react' as const,
  },
  {
    name: '42K ULTRA',
    event: 'ALAS TRAIL RUN 2026',
    eventId: 'evt-alas-trail-run',
    price: '0.005 ETH',
    badge: 'VIP Pass',
    orb: 'cursor' as const,
  },
  {
    name: 'VVIP',
    event: 'Web3 Dev Connect 2026',
    eventId: 'evt-web3-dev-connect',
    price: '0.01 ETH',
    badge: 'VVIP',
    orb: 'neuform' as const,
  },
  {
    name: '21K',
    event: 'ALAS TRAIL RUN 2026',
    eventId: 'evt-alas-trail-run',
    price: '0.002 ETH',
    badge: 'Regular',
    orb: 'github' as const,
  },
  {
    name: 'REGULAR',
    event: 'Web3 Dev Connect 2026',
    eventId: 'evt-web3-dev-connect',
    price: '0.001 ETH',
    badge: 'Tier 1',
    orb: 'designcode' as const,
  },
  {
    name: 'VVIP ART',
    event: 'NFT Art Exhibition',
    eventId: 'evt-nft-art-exhibition',
    price: '0.02 ETH',
    badge: 'Sold Out',
    orb: 'figma' as const,
  },
];

export default function NFTShowcase() {
  return (
    <section style={{ padding: '80px 24px', position: 'relative', zIndex: 2 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="bp-mono" style={{ color: 'var(--bp-neon2)', fontSize: 11, letterSpacing: '0.28em', marginBottom: 12 }}>
          LIVE MARKETPLACE
        </div>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, margin: '0 0 32px' }}>
          Available Tickets
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
          }}
        >
          {nfts.map((nft) => (
            <Link
              key={`${nft.eventId}-${nft.name}`}
              href={`/event/${nft.eventId}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="bp-glass" style={{ overflow: 'hidden', transition: 'transform 0.25s' }}>
                <SceneFrame height={180} style={{ borderRadius: 0 }}>
                  <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', background: '#070b14' }}>
                    <BrandOrbs variant={nft.orb} size="medium" mode="dark" speed={1} />
                  </div>
                </SceneFrame>
                <div style={{ padding: 18 }}>
                  <div className="bp-mono" style={{ fontSize: 9, color: 'var(--bp-neon)', letterSpacing: '0.14em', marginBottom: 8 }}>
                    {nft.badge}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{nft.name}</div>
                  <div className="bp-mono" style={{ fontSize: 10, color: 'var(--bp-muted)', marginBottom: 14 }}>
                    {nft.event}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="bp-mono" style={{ color: 'var(--bp-neon)', fontWeight: 700, fontSize: 13 }}>
                      {nft.price}
                    </span>
                    <span className="bp-btn" style={{ padding: '8px 12px', fontSize: 10 }}>
                      Mint Now
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
