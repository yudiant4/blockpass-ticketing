'use client';

import { useState } from 'react';
import { css } from 'styled-system/css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QRCodeScanner from '@/components/EventDayTicket';

export default function VerifyPage() {
  const [eventId, setEventId] = useState('evt-web3-dev-connect');
  const [tokenId, setTokenId] = useState(1);
  const [log, setLog] = useState<string[]>([]);

  const push = (msg: string) => setLog((prev) => [msg, ...prev].slice(0, 8));

  return (
    <main className={css({ minHeight: '100vh', paddingTop: '100px', paddingBottom: '40px' })}>
      <Navbar />
      <div className={css({ maxWidth: '720px', margin: '0 auto', padding: '0 24px' })}>
        <div
          className={css({
            fontFamily: 'mono',
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: 'neon',
            marginBottom: '12px',
            textTransform: 'uppercase',
          })}
        >
          Organizer tools
        </div>
        <h1 className={css({ fontSize: '36px', fontWeight: '800', marginBottom: '12px' })}>Verify Tickets</h1>
        <p className={css({ fontFamily: 'mono', fontSize: '13px', color: 'muted', marginBottom: '32px', lineHeight: '1.7' })}>
          Scan or mock-verify ERC-1155 ticket ownership on Base Sepolia at the door.
        </p>

        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
            gap: '16px',
            marginBottom: '24px',
          })}
        >
          <label className={css({ display: 'block' })}>
            <span className={css({ fontFamily: 'mono', fontSize: '10px', color: 'muted', textTransform: 'uppercase' })}>
              Event ID
            </span>
            <input
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className={css({
                width: '100%',
                mt: '1',
                background: 'surface',
                border: '1px solid token(colors.border)',
                padding: '12px',
                color: 'text',
                fontFamily: 'mono',
                fontSize: '12px',
              })}
            />
          </label>
          <label className={css({ display: 'block' })}>
            <span className={css({ fontFamily: 'mono', fontSize: '10px', color: 'muted', textTransform: 'uppercase' })}>
              Expected Tier ID
            </span>
            <select
              value={tokenId}
              onChange={(e) => setTokenId(parseInt(e.target.value, 10))}
              className={css({
                width: '100%',
                mt: '1',
                background: 'surface',
                border: '1px solid token(colors.border)',
                padding: '12px',
                color: 'text',
                fontFamily: 'mono',
                fontSize: '12px',
              })}
            >
              <option value={1}>1 — Regular</option>
              <option value={2}>2 — VIP</option>
              <option value={3}>3 — VVIP</option>
            </select>
          </label>
        </div>

        <QRCodeScanner
          key={`${eventId}-${tokenId}`}
          eventId={eventId}
          expectedTokenId={tokenId}
          onValid={(wallet) => push(`VALID · ${wallet}`)}
          onInvalid={(reason) => push(`INVALID · ${reason}`)}
        />

        {log.length > 0 && (
          <div className={css({ marginTop: '24px' })}>
            <div className={css({ fontFamily: 'mono', fontSize: '10px', color: 'muted', marginBottom: '8px' })}>
              SCAN LOG
            </div>
            {log.map((line, i) => (
              <div
                key={i}
                className={css({
                  fontFamily: 'mono',
                  fontSize: '12px',
                  padding: '8px 0',
                  borderBottom: '1px solid token(colors.border)',
                  color: line.startsWith('VALID') ? 'neon' : 'neon3',
                })}
              >
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
