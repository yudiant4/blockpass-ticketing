'use client';

import { useState } from 'react';
import Link from 'next/link';
import { css } from '../../../styled-system/css';
import dynamic from 'next/dynamic';

const EventDayTicket = dynamic(() => import('../../components/EventDayTicket'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-64">Loading...</div>,
});

// ERC-1155 tiers: tokenId -> { price (wei per ticket), symbol }
const ticketTiers = [
  {
    id: 1,
    name: 'REGULAR',
    price: '0.001 ETH',
    eth: '0.001',
    fiat: 'Rp 50.000',
    supply: 1000,
    benefits: ['Akses Masuk Area Umum', 'Standard Digital Ticket NFT'],
  },
  {
    id: 2,
    name: 'VIP',
    price: '0.003 ETH',
    eth: '0.003',
    fiat: 'Rp 150.000',
    supply: 500,
    benefits: ['Akses Masuk Utama Event', 'Digital POAP Finisher Badge', 'Free Merchandise NFT'],
  },
  {
    id: 3,
    name: 'VVIP',
    price: '0.01 ETH',
    eth: '0.01',
    fiat: 'Rp 500.000',
    supply: 100,
    benefits: ['Akses Backstage Eksklusif', 'Free Merchandise NFT & Fisik', 'Drink Coupon & VIP Lounge', 'Front Row Seat'],
  },
];

export default function EventDetailPage() {
  const [selectedTier, setSelectedTier] = useState(0);
  const [mintHash, setMintHash] = useState<string | null>(null);

  return (
    <main className={css({ minHeight: '100vh', paddingTop: '100px', paddingBottom: '120px' })}>
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-mint-green mb-4">Event Day Ticket</h1>

        {/* Tier Selection */}
        <div className="grid grid-cols-1 gap-4 max-w-md mx-auto mb-8">
          {ticketTiers.map((tier, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedTier(idx)}
              className={`px-6 py-3 rounded-lg cursor-pointer border ${
                selectedTier === idx ? 'bg-mint-green text-slate-900' : 'bg-slate-800 text-slate-200 border-slate-600'}
              `}
            >
              <div className="font-medium">{tier.name}</div>
              <div className="text-sm text-mint-green/60">{tier.price}</div>
            </div>
          ))}
        </div>

        {/* Event Day Ticket Component */}
        <EventDayTicket
          tokenId={ticketTiers[selectedTier].id}
          contractAddress="0xbdb5f9745Db186C25424fA0EC5b81009980B87c2"
          ownerAddress="0x8fc179213fb33f2bf61c8abae3d2a469e9f167b9"
          tier={ticketTiers[selectedTier].name}
          tierData={{
            accent: selectedTier === 0 ? 'cyan' : selectedTier === 1 ? 'emerald' : 'amber',
            glow: selectedTier === 0 ? 'shadow-cyan-500/30' : selectedTier === 1 ? 'shadow-emerald-500/30' : 'shadow-amber-500/30',
            border: selectedTier === 0 ? 'border-cyan-500/50' : selectedTier === 1 ? 'border-emerald-500/50' : 'border-amber-500/50',
            badgeBg: selectedTier === 0 ? 'bg-cyan-500/20' : selectedTier === 1 ? 'bg-emerald-500/20' : 'bg-amber-500/20',
            badgeText: selectedTier === 0 ? 'text-cyan-400' : selectedTier === 1 ? 'text-emerald-400' : 'text-amber-400',
          }}
          perks={ticketTiers[selectedTier].benefits}
          status="UNUSED"
        />

        {/* Mint Section (sederhana) */}
        <div className="mt-8">
          <button
            onClick={() => alert('Fungsi Mint dipanggil (placeholder)')}
            className="px-6 py-3 bg-mint-green text-slate-900 font-semibold rounded-lg hover:bg-mint-green/90 transition-colors"
          >
            Mint Tiket (Placeholder)
          </button>
        </div>
      </div>
    </main>
  );
}