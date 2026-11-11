'use client';

import { useEffect, useState } from 'react';
import { parseEther } from 'viem';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Ticket, Check } from 'lucide-react';
import { BLOCKPASS_TICKET_ABI, BLOCKPASS_TICKET_ADDRESS } from '@/config/contracts';
import { apiUrl } from '@/lib/api';
import { LaunchButton, SceneFrame } from './three/ClientScenes';

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
      writeContract({
        address: BLOCKPASS_TICKET_ADDRESS,
        abi: BLOCKPASS_TICKET_ABI,
        functionName: 'mintTicket',
        args: [BigInt(data.data.onChainTierId || onChainId), BigInt(1)],
        value: parseEther(String(tier.price)),
      });
      setResult('Confirm transaction di wallet…');
    } catch (e: any) {
      setResult(e.message || 'Gagal membeli tiket');
      setLoading(false);
    }
  };

  return (
    <div className="bp-glass" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14, opacity: disabled && !soldOut ? 0.65 : 1 }}>
      <SceneFrame height={88}>
        <LaunchButton mode="dark" hue={0.45} />
      </SceneFrame>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="bp-mono" style={{ fontSize: 16, fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
          {tier.tierName}
        </h3>
        <span className="bp-mono" style={{ background: soldOut ? '#333' : 'var(--bp-neon)', color: soldOut ? '#999' : '#04110d', padding: '4px 10px', borderRadius: 8, fontWeight: 700, fontSize: 12 }}>
          {tier.price} ETH
        </span>
      </div>

      <div>
        <div className="bp-mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--bp-muted)', marginBottom: 6 }}>
          <span>QUOTA</span>
          <span>
            {remaining} / {tier.quota} remaining
          </span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: soldOut ? '#555' : 'var(--bp-neon)' }} />
        </div>
      </div>

      {tier.perks?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {tier.perks.map((perk, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Check size={12} color="var(--bp-neon)" />
              <span className="bp-mono" style={{ fontSize: 11, color: 'var(--bp-muted)' }}>
                {perk}
              </span>
            </div>
          ))}
        </div>
      )}

      <button className={`bp-btn ${disabled ? '' : 'bp-btn-solid'}`} disabled={disabled} onClick={handleBuy} style={{ width: '100%' }}>
        <Ticket size={16} />
        {isEnded ? 'EVENT ENDED' : soldOut ? 'SOLD OUT' : loading || confirming ? (confirming ? 'CONFIRMING…' : 'MINTING…') : 'BUY TICKET'}
      </button>

      {result && (
        <p className="bp-mono" style={{ fontSize: 11, textAlign: 'center', color: result.toLowerCase().includes('mint') || result.includes('Confirm') ? 'var(--bp-neon)' : 'var(--bp-neon3)', margin: 0 }}>
          {result}
        </p>
      )}

      <p className="bp-mono" style={{ fontSize: 10, color: 'var(--bp-muted)', textAlign: 'center', margin: 0 }}>
        MAX {tier.maxPerWallet} PER WALLET · ON-CHAIN ID {onChainId}
      </p>
    </div>
  );
}
