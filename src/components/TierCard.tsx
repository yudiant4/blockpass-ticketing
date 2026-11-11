'use client';

import { useEffect, useState } from 'react';
import { css } from 'styled-system/css';
import { Ticket, Check } from 'lucide-react';
import { parseEther } from 'viem';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { BLOCKPASS_TICKET_ABI, BLOCKPASS_TICKET_ADDRESS } from '@/config/contracts';
import { apiUrl } from '@/lib/api';

interface Tier {
  tierId: string;
  tierName: string;
  price: number;
  quota: number;
  sold: number;
  maxPerWallet: number;
  perks: string[];
  onChainTierId?: number;
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
  const pct = tier.quota > 0 ? (tier.sold / tier.quota) * 100 : 0;
  const disabled = isEnded || soldOut || loading;
  const onChainId = tier.onChainTierId || 1;

  const { writeContract, data: txHash, error: writeError, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (!isSuccess || !txHash) return;
    (async () => {
      try {
        await fetch(apiUrl(`/api/events/${eventId}/confirm-mint`), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tierId: tier.tierId, quantity: 1, txHash }),
        });
        setResult(`Minted on-chain. Tx: ${txHash.slice(0, 10)}…`);
      } catch {
        setResult(`Minted on-chain (sync pending). Tx: ${txHash.slice(0, 10)}…`);
      } finally {
        setLoading(false);
      }
    })();
  }, [isSuccess, txHash, eventId, tier.tierId]);

  useEffect(() => {
    if (writeError) {
      setResult(writeError.message.split('\n')[0] || 'Transaksi gagal');
      setLoading(false);
    }
  }, [writeError]);

  const handleBuy = async () => {
    if (disabled) return;
    if (!walletAddress) {
      setResult('Connect wallet terlebih dahulu');
      return;
    }

    setLoading(true);
    setResult('');
    reset();

    try {
      const res = await fetch(apiUrl(`/api/events/${eventId}/buy-intent`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId: tier.tierId, wallet: walletAddress, quantity: 1 }),
      });
      const data = await res.json();
      if (data.status !== 'success') {
        setResult(data.message || 'Gagal reserve slot');
        setLoading(false);
        return;
      }

      const value = parseEther(String(tier.price));
      writeContract({
        address: BLOCKPASS_TICKET_ADDRESS,
        abi: BLOCKPASS_TICKET_ABI,
        functionName: 'mintTicket',
        args: [BigInt(data.data.onChainTierId || onChainId), BigInt(1)],
        value,
      });
      setResult('Confirm transaction di wallet…');
    } catch (e: any) {
      setResult(e.message || 'Gagal membeli tiket');
      setLoading(false);
    }
  };

  return (
    <div
      className={css({
        bg: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        rounded: 'lg',
        p: '6',
        display: 'flex',
        flexDirection: 'column',
        gap: '4',
        opacity: disabled && !soldOut ? '0.6' : '1',
      })}
    >
      <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' })}>
        <h3
          className={css({
            fontFamily: 'mono',
            fontSize: 'lg',
            fontWeight: '700',
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          })}
        >
          {tier.tierName}
        </h3>
        <span
          className={css({
            fontFamily: 'mono',
            fontSize: 'sm',
            fontWeight: '700',
            px: '3',
            py: '1',
            rounded: 'md',
            bg: soldOut ? 'gray.700' : 'neon',
            color: soldOut ? 'gray.400' : 'black',
          })}
        >
          {tier.price} ETH
        </span>
      </div>

      <div>
        <div className={css({ display: 'flex', justifyContent: 'space-between', mb: '1' })}>
          <span className={css({ fontFamily: 'mono', fontSize: 'xs', color: 'gray.400', textTransform: 'uppercase' })}>
            QUOTA
          </span>
          <span className={css({ fontFamily: 'mono', fontSize: 'xs', color: 'gray.300' })}>
            {remaining} / {tier.quota} remaining
          </span>
        </div>
        <div className={css({ w: 'full', h: '2', bg: 'gray.800', rounded: 'full' })}>
          <div
            className={css({
              h: 'full',
              rounded: 'full',
              bg: soldOut ? 'gray.600' : 'neon',
              transition: 'width 0.3s',
            })}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>

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

      <button
        onClick={handleBuy}
        disabled={disabled}
        className={css({
          w: 'full',
          py: '3',
          rounded: 'md',
          bg: disabled ? 'gray.700' : 'neon',
          color: disabled ? 'gray.500' : 'black',
          fontWeight: 'bold',
          fontFamily: 'mono',
          fontSize: 'sm',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2',
          transition: 'background 0.2s',
        })}
      >
        <Ticket size={16} />
        {isEnded
          ? 'EVENT ENDED'
          : soldOut
            ? 'SOLD OUT'
            : loading || confirming
              ? confirming
                ? 'CONFIRMING…'
                : 'MINTING…'
              : 'BUY TICKET'}
      </button>

      {result && (
        <p
          className={css({
            fontFamily: 'mono',
            fontSize: 'xs',
            textAlign: 'center',
            color: result.toLowerCase().includes('mint') || result.includes('Confirm') ? 'neon' : 'red.400',
          })}
        >
          {result}
        </p>
      )}

      <p className={css({ fontFamily: 'mono', fontSize: 'xs', color: 'gray.600', textAlign: 'center' })}>
        MAX {tier.maxPerWallet} PER WALLET · ON-CHAIN ID {onChainId}
      </p>
    </div>
  );
}
