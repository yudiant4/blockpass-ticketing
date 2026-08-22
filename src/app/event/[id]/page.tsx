'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const EventDayTicket = dynamic(() => import('../../../components/EventDayTicket'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 text-cyan-400 font-mono text-xs uppercase tracking-widest">
      // Loading Gate...
    </div>
  ),
});

const ticketTiers = [
  {
    id: 1,
    name: 'REGULAR',
    price: '0.001 ETH',
    network: 'Ethereum',
    accent: 'cyan',
    glow: 'shadow-cyan-500/30',
    border: 'border-cyan-500/50',
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-cyan-400',
  },
  {
    id: 2,
    name: 'VIP',
    price: '0.003 ETH',
    network: 'Ethereum',
    accent: 'emerald',
    glow: 'shadow-emerald-500/30',
    border: 'border-emerald-500/50',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-400',
  },
  {
    id: 3,
    name: 'VVIP',
    price: '0.01 ETH',
    network: 'Ethereum',
    accent: 'amber',
    glow: 'shadow-amber-500/30',
    border: 'border-amber-500/50',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-400',
  },
];

export default function EventDynamicPage() {
  const params = useParams();
  const eventId = params?.id ? parseInt(params.id as string, 10) : 1;

  const [activeTab, setActiveTab] = useState<'pre' | 'day' | 'post'>('pre');
  const [selectedTier, setSelectedTier] = useState<number>(2);

  const selectedTierData = ticketTiers[selectedTier - 1] || ticketTiers[1];

  return (
    <main
      className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden pt-[100px] pb-[120px]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-24">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block px-3 py-1 border border-slate-700 rounded-md font-mono text-xs uppercase tracking-widest text-cyan-400 mb-4">
            Event #{eventId} • NFT Ticketing
          </div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase text-white tracking-wide">
            ALAS TRAIL RUN <span className="text-cyan-400">2026</span>
          </h1>
          <p className="mt-3 text-slate-400 text-sm font-mono">
            Pacet, Mojokerto • <span className="text-emerald-400">Aug 15, 2026</span>
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-3 mb-8 p-2 bg-slate-900/80 border border-slate-700 rounded-xl backdrop-blur-xl">
          {[
            { key: 'pre', label: '01 // PRE-EVENT' },
            { key: 'day', label: '02 // EVENT DAY' },
            { key: 'post', label: '03 // POST-EVENT' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'pre' | 'day' | 'post')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-cyan-500 text-slate-950 shadow-xl shadow-cyan-500/30'
                  : 'bg-slate-950/60 text-slate-400 border border-slate-700 hover:text-cyan-400 hover:border-cyan-500/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'pre' && (
          <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
                Tier Selection
              </span>
            </div>

            <h2 className="text-xl font-bold text-white uppercase mb-1">Select Your Tier</h2>
            <p className="text-slate-400 text-xs font-mono mb-6">
              // Pilih tier & selesaikan transaksi untuk membuka Event Day Gate Pass
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {ticketTiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`relative p-4 rounded-xl text-left transition-all duration-300 bg-slate-900/60 backdrop-blur-xl overflow-hidden border ${
                    selectedTier === tier.id
                      ? `${tier.border} ${tier.glow} scale-[1.02]`
                      : 'border-slate-700 hover:border-cyan-500/60 hover:scale-[1.02]'
                  }`}
                >
                  {/* Tier accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-emerald-500 to-amber-500" />

                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-mono text-xs uppercase tracking-widest ${tier.badgeText} ${tier.badgeBg} border ${tier.border} px-2 py-0.5 rounded`}>
                      {tier.name} PASS
                    </span>
                    <span className="font-mono text-xs text-emerald-400 uppercase">
                      {tier.network}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{tier.price}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">
                    ≈ Rp {tier.id === 1 ? '50.000' : tier.id === 2 ? '150.000' : '500.000'}
                  </div>
                </button>
              ))}
            </div>

            <button className="w-full py-3 px-6 bg-cyan-500 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-cyan-400 transition-all duration-200 shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/40">
              {'>'} MINT TIKET SEKARANG
            </button>

            <div className="mt-4 p-3 bg-slate-950/60 border border-slate-700 rounded-lg font-mono text-xs text-slate-400">
              <span className="text-cyan-400">// STATUS:</span> Wallet belum terhubung. Klik "Connect Wallet" di header untuk mulai mint.
            </div>
          </div>
        )}

        {activeTab === 'day' && (
          <EventDayTicket
            tokenId={selectedTier}
            contractAddress="0xbdb5f9745Db186C25424fA0EC5b81009980B87c2"
            ownerAddress="0x8fc179213fb33f2bf61c8abae3d2a469e9f167b9"
            tier={selectedTierData.name}
            tierData={selectedTierData}
            perks={['Akses Gate Utama', 'Fast-Track Queue', 'Digital POAP Badge']}
            status="UNUSED"
          />
        )}

        {activeTab === 'post' && (
          <div className="bg-slate-900/60 border border-emerald-500/40 rounded-2xl p-8 text-center backdrop-blur-xl">
            <div className="inline-block px-3 py-1 border border-emerald-500/40 rounded-md font-mono text-xs uppercase tracking-widest text-emerald-400 mb-4">
              FINISHER POAP
            </div>
            <h3 className="text-2xl font-bold uppercase text-white mb-2">
              Digital Souvenir & Attendance POAP
            </h3>
            <p className="text-slate-400 text-sm font-mono max-w-md mx-auto">
              // Acara telah selesai. Tiket NFT Anda kini tersimpan permanen di wallet sebagai bukti kehadiran bersejarah.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 text-center">
          <Link
            href="/marketplace"
            className="inline-block font-mono text-xs uppercase tracking-widest text-slate-500 hover:text-cyan-400 transition-colors border border-slate-700 hover:border-cyan-500/40 px-4 py-2 rounded"
          >
            {'< KEMBALI KE MARKETPLACE'}
          </Link>
        </div>
      </div>
    </main>
  );
}