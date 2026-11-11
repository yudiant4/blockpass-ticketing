'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QRCodeScanner from '@/components/EventDayTicket';
import { ParticleNetwork, SceneFrame } from '@/components/three/ClientScenes';

export default function VerifyPage() {
  const [eventId, setEventId] = useState('evt-web3-dev-connect');
  const [tokenId, setTokenId] = useState(1);
  const [log, setLog] = useState<string[]>([]);

  const push = (msg: string) => setLog((prev) => [msg, ...prev].slice(0, 8));

  return (
    <main className="bp-page">
      <div className="bp-bg-layer" aria-hidden>
        <ParticleNetwork mode="dark" speed={1} />
      </div>
      <div className="bp-content">
        <Navbar />
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '110px 24px 40px' }}>
          <div className="bp-mono" style={{ color: 'var(--bp-neon)', fontSize: 11, letterSpacing: '0.28em', marginBottom: 12 }}>
            ORGANIZER TOOLS
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 10px' }}>Verify Tickets</h1>
          <p className="bp-mono" style={{ fontSize: 13, color: 'var(--bp-muted)', lineHeight: 1.7, marginBottom: 24 }}>
            Scan or mock-verify ERC-1155 ticket ownership on Base Sepolia at the door.
          </p>

          <SceneFrame height={180} style={{ marginBottom: 20 }}>
            <ParticleNetwork mode="dark" density={1.2} />
          </SceneFrame>

          <div className="bp-grid-2" style={{ marginBottom: 18 }}>
            <label>
              <span className="bp-label">Event ID</span>
              <input className="bp-input" value={eventId} onChange={(e) => setEventId(e.target.value)} />
            </label>
            <label>
              <span className="bp-label">Expected Tier ID</span>
              <select className="bp-select" value={tokenId} onChange={(e) => setTokenId(parseInt(e.target.value, 10))}>
                <option value={1}>1 — Regular</option>
                <option value={2}>2 — VIP</option>
                <option value={3}>3 — VVIP</option>
              </select>
            </label>
          </div>

          <div className="bp-glass" style={{ padding: 8 }}>
            <QRCodeScanner
              key={`${eventId}-${tokenId}`}
              eventId={eventId}
              expectedTokenId={tokenId}
              onValid={(wallet) => push(`VALID · ${wallet}`)}
              onInvalid={(reason) => push(`INVALID · ${reason}`)}
            />
          </div>

          {log.length > 0 && (
            <div style={{ marginTop: 22 }}>
              <div className="bp-mono" style={{ fontSize: 10, color: 'var(--bp-muted)', marginBottom: 8 }}>
                SCAN LOG
              </div>
              {log.map((line, i) => (
                <div
                  key={i}
                  className="bp-mono"
                  style={{
                    fontSize: 12,
                    padding: '8px 0',
                    borderBottom: '1px solid var(--bp-border)',
                    color: line.startsWith('VALID') ? 'var(--bp-neon)' : 'var(--bp-neon3)',
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </main>
  );
}
