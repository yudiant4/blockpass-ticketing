'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiUrl } from '@/lib/api';
import { TIER_NAMES, TIER_PRICES } from '@/config/contracts';
import { DiagnosticsFrame, PerformanceFrame } from '@/components/three/ProfileScenes';

type OwnedBalance = { tierId: number; name: string; balance: number };

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const [balances, setBalances] = useState<OwnedBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (!address) {
      setBalances([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError('');
    fetch(apiUrl(`/api/ticket?wallet=${address}`))
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.success) setBalances(d.data.balances || []);
        else setError(d.error || 'Gagal memuat tiket');
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [address]);

  const totalTickets = balances.reduce((s, b) => s + b.balance, 0);
  const estValue = balances.reduce((s, b) => {
    const price = Number(TIER_PRICES[b.tierId as keyof typeof TIER_PRICES] || 0);
    return s + price * b.balance;
  }, 0);
  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '—';

  return (
    <main className="bp-page">
      <div className="bp-bg-layer" aria-hidden>
        <DiagnosticsFrame />
      </div>
      <div className="bp-content">
        <Navbar />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '110px 24px 40px' }}>
          <div className="bp-glass" style={{ padding: 28, marginBottom: 28, display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--bp-neon), var(--bp-neon2))', display: 'grid', placeItems: 'center', fontFamily: 'Space Mono, monospace', fontWeight: 800, color: '#04110d' }}>
                0x
              </div>
              <div>
                <div className="bp-mono" style={{ color: 'var(--bp-neon)', fontSize: 11, letterSpacing: '0.18em', marginBottom: 6 }}>
                  {isConnected ? 'CONNECTED WALLET' : 'WALLET NOT CONNECTED'}
                </div>
                <h1 className="bp-mono" style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>
                  {short}
                </h1>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <div className="bp-mono" style={{ fontSize: 10, color: 'var(--bp-muted)' }}>
                  TOTAL TICKETS
                </div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>{totalTickets}</div>
              </div>
              <div>
                <div className="bp-mono" style={{ fontSize: 10, color: 'var(--bp-muted)' }}>
                  EST. VALUE
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--bp-neon)' }}>{estValue.toFixed(3)} ETH</div>
              </div>
              <ConnectButton />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 28, borderBottom: '1px solid var(--bp-border)', marginBottom: 28 }}>
            {['Collected Tickets', 'Past Events (POAP)', 'Listed For Sale'].map((label, idx) => (
              <button
                key={label}
                onClick={() => setTab(idx)}
                className="bp-mono"
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '0 0 14px',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  color: tab === idx ? 'var(--bp-neon)' : 'var(--bp-muted)',
                  borderBottom: tab === idx ? '2px solid var(--bp-neon)' : '2px solid transparent',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {!isConnected && (
            <div className="bp-glass" style={{ padding: 40, textAlign: 'center' }}>
              <PerformanceFrame />
              <p className="bp-mono" style={{ color: 'var(--bp-muted)', marginTop: 18 }}>
                Connect wallet to view your on-chain tickets.
              </p>
            </div>
          )}

          {isConnected && loading && <p className="bp-mono" style={{ textAlign: 'center', color: 'var(--bp-neon)' }}>LOADING TICKETS…</p>}
          {isConnected && error && <p className="bp-mono" style={{ textAlign: 'center', color: 'var(--bp-neon3)' }}>{error}</p>}

          {isConnected && !loading && tab === 0 && balances.length === 0 && (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <p className="bp-mono" style={{ color: 'var(--bp-muted)', marginBottom: 18 }}>
                No tickets in this wallet yet.
              </p>
              <Link href="/marketplace" className="bp-btn bp-btn-solid">
                Explore Marketplace
              </Link>
            </div>
          )}

          {isConnected && !loading && tab === 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
              {balances.map((ticket) => (
                <div key={ticket.tierId} className="bp-glass" style={{ overflow: 'hidden' }}>
                  <div style={{ height: 140, padding: 18, position: 'relative', background: 'linear-gradient(135deg,#0a2010,#0f3d2e)' }}>
                    <span className="bp-mono" style={{ position: 'absolute', top: 18, right: 18, border: '1px solid var(--bp-neon)', color: 'var(--bp-neon)', fontSize: 9, padding: '4px 8px' }}>
                      Active
                    </span>
                    <div className="bp-mono" style={{ position: 'absolute', bottom: 18, left: 18, fontWeight: 800 }}>
                      TIER #{ticket.tierId} × {ticket.balance}
                    </div>
                  </div>
                  <div style={{ padding: 20 }}>
                    <div className="bp-mono" style={{ fontSize: 10, color: 'var(--bp-muted)', marginBottom: 8 }}>
                      {TIER_NAMES[ticket.tierId as keyof typeof TIER_NAMES] || ticket.name}
                    </div>
                    <h3 style={{ margin: '0 0 12px', fontSize: 18 }}>Blockpass Ticket</h3>
                    <div className="bp-mono" style={{ fontSize: 11, color: 'var(--bp-muted)', marginBottom: 16 }}>
                      {TIER_PRICES[ticket.tierId as keyof typeof TIER_PRICES] || '—'} ETH each
                    </div>
                    <Link href="/event/evt-web3-dev-connect" className="bp-btn" style={{ width: '100%' }}>
                      View Event
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 1 && <p className="bp-mono" style={{ textAlign: 'center', color: 'var(--bp-muted)', padding: 48 }}>POAP history coming soon.</p>}
          {tab === 2 && <p className="bp-mono" style={{ textAlign: 'center', color: 'var(--bp-muted)', padding: 48 }}>Secondary listings not active yet.</p>}
        </div>
        <Footer />
      </div>
    </main>
  );
}
