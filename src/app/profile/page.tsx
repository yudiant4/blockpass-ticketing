'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { css } from '../../../styled-system/css';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiUrl } from '@/lib/api';
import { TIER_NAMES, TIER_PRICES } from '@/config/contracts';

type OwnedBalance = {
  tierId: number;
  name: string;
  balance: number;
};

const tierBg: Record<number, string> = {
  1: 'linear-gradient(135deg, #0a2010 0%, #0f3d2e 100%)',
  2: 'linear-gradient(135deg, #0d1f2d 0%, #1a2030 100%)',
  3: 'linear-gradient(135deg, #1a0d2d 0%, #2d1a30 100%)',
};

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
    <main className={css({ minHeight: '100vh', paddingTop: '100px', paddingBottom: '40px' })}>
      <Navbar />
      <div className={css({ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' })}>
        <div
          className={css({
            background: 'surface',
            border: '1px solid token(colors.border)',
            padding: '40px',
            marginBottom: '40px',
            display: 'flex',
            flexDirection: { base: 'column', md: 'row' },
            alignItems: { base: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: '24px',
          })}
        >
          <div className={css({ display: 'flex', alignItems: 'center', gap: '24px' })}>
            <div
              className={css({
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, token(colors.neon), token(colors.neon2))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'mono',
                fontSize: '24px',
                fontWeight: '800',
                color: 'bg',
              })}
            >
              0x
            </div>
            <div>
              <div
                className={css({
                  fontFamily: 'mono',
                  fontSize: '11px',
                  color: 'neon',
                  letterSpacing: '0.2em',
                  marginBottom: '8px',
                })}
              >
                {isConnected ? 'CONNECTED WALLET' : 'WALLET NOT CONNECTED'}
              </div>
              <h1 className={css({ fontSize: '28px', fontWeight: '800', fontFamily: 'mono' })}>{short}</h1>
            </div>
          </div>

          <div className={css({ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' })}>
            <div>
              <div
                className={css({
                  fontFamily: 'mono',
                  fontSize: '11px',
                  color: 'muted',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                })}
              >
                Total Tickets
              </div>
              <div className={css({ fontSize: '24px', fontWeight: '800', color: 'text' })}>{totalTickets}</div>
            </div>
            <div>
              <div
                className={css({
                  fontFamily: 'mono',
                  fontSize: '11px',
                  color: 'muted',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                })}
              >
                Est. Value
              </div>
              <div className={css({ fontSize: '24px', fontWeight: '800', color: 'neon' })}>
                {estValue.toFixed(3)} ETH
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>

        <div
          className={css({
            display: 'flex',
            gap: '32px',
            borderBottom: '1px solid token(colors.border)',
            marginBottom: '40px',
          })}
        >
          {['Collected Tickets', 'Past Events (POAP)', 'Listed For Sale'].map((label, idx) => (
            <button
              key={label}
              onClick={() => setTab(idx)}
              className={css({
                background: 'transparent',
                border: 'none',
                padding: '0 0 16px 0',
                fontFamily: 'mono',
                fontSize: '13px',
                textTransform: 'uppercase',
                color: tab === idx ? 'neon' : 'muted',
                borderBottom: tab === idx ? '2px solid token(colors.neon)' : '2px solid transparent',
                cursor: 'pointer',
                _hover: { color: 'neon' },
              })}
            >
              {label}
            </button>
          ))}
        </div>

        {!isConnected && (
          <div className={css({ textAlign: 'center', padding: '60px 20px', fontFamily: 'mono', color: 'muted' })}>
            Connect wallet to view your on-chain tickets.
          </div>
        )}

        {isConnected && loading && (
          <div className={css({ textAlign: 'center', padding: '40px', fontFamily: 'mono', color: 'neon' })}>
            LOADING TICKETS…
          </div>
        )}

        {isConnected && error && (
          <div className={css({ textAlign: 'center', padding: '40px', fontFamily: 'mono', color: 'red' })}>{error}</div>
        )}

        {isConnected && !loading && tab === 0 && balances.length === 0 && (
          <div className={css({ textAlign: 'center', padding: '60px 20px' })}>
            <p className={css({ fontFamily: 'mono', color: 'muted', marginBottom: '24px' })}>
              Belum ada tiket di wallet ini.
            </p>
            <Link href="/marketplace" className={css({ textDecoration: 'none' })}>
              <span
                className={css({
                  display: 'inline-block',
                  padding: '12px 24px',
                  background: 'neon',
                  color: 'bg',
                  fontFamily: 'mono',
                  fontSize: '12px',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                })}
              >
                Explore Marketplace
              </span>
            </Link>
          </div>
        )}

        {isConnected && !loading && tab === 0 && (
          <div
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: '24px',
            })}
          >
            {balances.map((ticket) => (
              <div
                key={ticket.tierId}
                className={css({
                  background: 'card',
                  border: '1px solid token(colors.border)',
                  transition: 'transform 0.3s, border-color 0.3s',
                  _hover: { transform: 'translateY(-4px)', borderColor: 'neon' },
                })}
              >
                <div
                  className={css({ height: '160px', padding: '20px', position: 'relative' })}
                  style={{ background: tierBg[ticket.tierId] || tierBg[1] }}
                >
                  <span
                    className={css({
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      padding: '4px 8px',
                      background: 'rgba(0,0,0,0.8)',
                      border: '1px solid token(colors.neon)',
                      color: 'neon',
                      fontFamily: 'mono',
                      fontSize: '9px',
                      textTransform: 'uppercase',
                    })}
                  >
                    Active
                  </span>
                  <div
                    className={css({
                      position: 'absolute',
                      bottom: '20px',
                      left: '20px',
                      fontFamily: 'mono',
                      fontSize: '14px',
                      fontWeight: '800',
                      color: 'white',
                    })}
                  >
                    TIER #{ticket.tierId} × {ticket.balance}
                  </div>
                </div>

                <div className={css({ padding: '24px' })}>
                  <div
                    className={css({
                      fontFamily: 'mono',
                      fontSize: '10px',
                      color: 'muted',
                      letterSpacing: '0.1em',
                      marginBottom: '8px',
                    })}
                  >
                    {TIER_NAMES[ticket.tierId as keyof typeof TIER_NAMES] || ticket.name}
                  </div>
                  <h3 className={css({ fontSize: '18px', fontWeight: '700', marginBottom: '16px' })}>
                    Blockpass Ticket
                  </h3>
                  <div
                    className={css({
                      fontFamily: 'mono',
                      fontSize: '11px',
                      color: 'muted',
                      marginBottom: '24px',
                    })}
                  >
                    {TIER_PRICES[ticket.tierId as keyof typeof TIER_PRICES] || '—'} ETH each
                  </div>
                  <Link
                    href={`/event/evt-web3-dev-connect`}
                    className={css({
                      display: 'block',
                      textAlign: 'center',
                      width: '100%',
                      padding: '12px',
                      background: 'transparent',
                      color: 'neon',
                      border: '1px solid token(colors.neon)',
                      fontFamily: 'mono',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      _hover: { background: 'rgba(0,245,196,0.1)' },
                    })}
                  >
                    View Event
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 1 && (
          <div className={css({ textAlign: 'center', padding: '60px', fontFamily: 'mono', color: 'muted' })}>
            POAP history coming soon — gunakan tiket yang sudah di-scan di event day.
          </div>
        )}
        {tab === 2 && (
          <div className={css({ textAlign: 'center', padding: '60px', fontFamily: 'mono', color: 'muted' })}>
            Secondary listings belum aktif. Transfer NFT via wallet explorer untuk saat ini.
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
