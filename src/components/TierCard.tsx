'use client';

import { useState } from 'react';
import { css } from 'styled-system/css';
import { Ticket, Check } from 'lucide-react';

interface Tier {
  tierId: string;
  tierName: string;
  price: number;
  quota: number;
  sold: number;
  maxPerWallet: number;
  perks: string[];
}

type Props = {
  tier: Tier;
  eventId: string;
  isEnded: boolean;
  walletAddress?: string;
};

export default function TierCard({ tier, eventId, isEnded, walletAddress }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const remaining = tier.quota - tier.sold;
  const soldOut = remaining <= 0;
  const pct = tier.quota > 0 ? ((tier.quota - remaining) / tier.quota) * 100 : 0;
  const disabled = isEnded || soldOut || loading;

  const handleBuy = async () => {
    if (disabled || !walletAddress) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/events/${eventId}/buy-intent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tierId: tier.tierId, wallet: walletAddress, quantity: 1 }),
        }
      );
      const data = await res.json();
      if (data.status === 'success') {
        setResult('Slot reserved. Proceed to wallet confirmation.');
      } else {
        setResult(data.message);
      }
    } catch (e: any) {
      setResult(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css({
      bg: 'rgba(255,255,255,0.02)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.08)',
      rounded: 'lg',
      p: '6',
      display: 'flex',
      flexDirection: 'column',
      gap: '4',
      opacity: disabled && !soldOut ? '0.6' : '1',
    })}>
      {/* Header */}
      <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' })}>
        <h3 className={css({ fontFamily: 'mono', fontSize: 'lg', fontWeight: '700', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' })}>
          {tier.tierName}
        </h3>
        <span className={css({
          fontFamily: 'mono', fontSize: 'sm', fontWeight: '700',
          px: '3', py: '1', rounded: 'md',
          bg: soldOut ? 'gray.700' : 'neon',
          color: soldOut ? 'gray.400' : 'black',
        })}>
          {tier.price} ETH
        </span>
      </div>

      {/* Progress Bar */}
      <div>
        <div className={css({ display: 'flex', justifyContent: 'space-between', mb: '1' })}>
          <span className={css({ fontFamily: 'mono', fontSize: 'xs', color: 'gray.400', textTransform: 'uppercase' })}>QUOTA</span>
          <span className={css({ fontFamily: 'mono', fontSize: 'xs', color: 'gray.300' })}>
            {remaining} / {tier.quota} remaining
          </span>
        </div>
        <div className={css({ w: 'full', h: '2', bg: 'gray.800', rounded: 'full' })}>
          <div className={css({
            h: 'full', rounded: 'full',
            bg: soldOut ? 'gray.600' : 'neon',
            transition: 'width 0.3s',
          })} style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
      </div>

      {/* Perks */}
      {tier.perks && tier.perks.length > 0 && (
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '1' })}>
          {tier.perks.map((perk, i) => (
            <div key={i} className={css({ display: 'flex', alignItems: 'center', gap: '2' })}>
              <Check size={12} className={css({ color: 'neon' })} />
              <span className={css({ fontFamily: 'mono', fontSize: 'xs', color: 'gray.300' })}>{perk}</span>
            </div>
          ))}
        </div>
      )}

      {/* Button */}
      <button
        onClick={handleBuy}
        disabled={disabled}
        className={css({
          w: 'full', py: '3', rounded: 'md',
          bg: disabled ? 'gray.700' : 'neon',
          color: disabled ? 'gray.500' : 'black',
          fontWeight: 'bold', fontFamily: 'mono', fontSize: 'sm',
          textTransform: 'uppercase', letterSpacing: '0.1em',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2',
          transition: 'background 0.2s',
        })}
      >
        <Ticket size={16} />
        {isEnded ? 'EVENT ENDED' : soldOut ? 'SOLD OUT' : loading ? 'RESERVING...' : 'BUY TICKET'}
      </button>

      {/* Result message */}
      {result && (
        <p className={css({
          fontFamily: 'mono', fontSize: 'xs', textAlign: 'center',
          color: result.includes('reserved') ? 'neon' : 'red.400',
        })}>{result}</p>
      )}

      {/* Max per wallet note */}
      <p className={css({ fontFamily: 'mono', fontSize: 'xs', color: 'gray.600', textAlign: 'center' })}>
        MAX {tier.maxPerWallet} PER WALLET
      </p>
    </div>
  );
}