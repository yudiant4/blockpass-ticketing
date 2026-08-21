'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { css } from '../../../../styled-system/css';
import dynamic from 'next/dynamic';

// Wagmi & Viem untuk baca saldo tiket di-chain
import { useAccount, useReadContract, useChainId } from 'wagmi';
import { BLOCKPASS_ABI } from '../../../lib/blockpass';
import { getContractAddress } from '../../../config/contracts';

const EventDayTicket = dynamic(() => import('../../../components/EventDayTicket'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-64 text-mint-green">Loading Gate...</div>,
});

export default function EventDynamicPage() {
  const params = useParams();
  const eventId = params?.id ? parseInt(params.id as string, 10) : 1;

  // Wallet & Chain
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const contractAddress = getContractAddress(chainId) || '0xbdb5f9745Db186C25424fA0EC5b81009980B87c2';

  // --- LOGIKA GATED CONTENT (CEK BALANSER TIKET IN-CHAIN) ---
  // Cek apakah user punya minimal 1 tiket di tier apapun (REGULAR=1, VIP=2, VVIP=3)
  const { data: regularBalance } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: BLOCKPASS_ABI,
    functionName: 'balanceOf',
    args: address ? [address, BigInt(1)] : undefined,
  });

  const { data: vipBalance } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: BLOCKPASS_ABI,
    functionName: 'balanceOf',
    args: address ? [address, BigInt(2)] : undefined,
  });

  const { data: vvipBalance } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: BLOCKPASS_ABI,
    functionName: 'balanceOf',
    args: address ? [address, BigInt(3)] : undefined,
  });

  // User dianggap MEMILIKI TIKET jika saldo di salah satu tier > 0
  const hasTicket = 
    (Number(regularBalance || 0) > 0) ||
    (Number(vipBalance || 0) > 0) ||
    (Number(vvipBalance || 0) > 0);

  // Tab State: 'pre' (Pre-Event/Mint) | 'day' (Event Day/QR) | 'post' (Post-Event/POAP)
  const [activeTab, setActiveTab] = useState<'pre' | 'day' | 'post'>('pre');

  return (
    <main className={css({ minHeight: '100vh', paddingTop: '100px', paddingBottom: '120px', bg: 'slate.900' })}>
      <div className="max-w-4xl mx-auto px-4 text-slate-100">
        
        {/* TAB NAVIGATION DENGAN LOGIKA LOCK */}
        <div className="flex justify-center gap-4 mb-8 bg-slate-800/60 p-2 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('pre')}
            className={`px-6 py-2.5 rounded-lg font-mono text-xs font-bold transition-all ${
              activeTab === 'pre'
                ? 'bg-mint-green text-slate-900 shadow-[0_0_15px_rgba(0,255,163,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1. PRE-EVENT (MINT)
          </button>

          {/* TAB EVENT DAY (LOCKED JIKA BELUM PUNYA TIKET) */}
          <button
            onClick={() => {
              if (hasTicket) setActiveTab('day');
              else alert('🔒 Akses Terkunci! Anda harus membeli/mint tiket terlebih dahulu.');
            }}
            className={`px-6 py-2.5 rounded-lg font-mono text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'day'
                ? 'bg-mint-green text-slate-900 shadow-[0_0_15px_rgba(0,255,163,0.3)]'
                : hasTicket
                ? 'text-slate-400 hover:text-white cursor-pointer'
                : 'text-slate-600 bg-slate-900/50 cursor-not-allowed border border-slate-800'
            }`}
          >
            {!hasTicket && <span>🔒</span>}
            2. EVENT DAY (GATE)
          </button>

          {/* TAB POST-EVENT (LOCKED JIKA BELUM PUNYA TIKET) */}
          <button
            onClick={() => {
              if (hasTicket) setActiveTab('post');
              else alert('🔒 Akses Terkunci! Anda harus membeli/mint tiket terlebih dahulu.');
            }}
            className={`px-6 py-2.5 rounded-lg font-mono text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'post'
                ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : hasTicket
                ? 'text-slate-400 hover:text-white cursor-pointer'
                : 'text-slate-600 bg-slate-900/50 cursor-not-allowed border border-slate-800'
            }`}
          >
            {!hasTicket && <span>🔒</span>}
            3. POST-EVENT (POAP)
          </button>
        </div>

        {/* --- TAMPILAN 1: PRE-EVENT (MINT TIKET) --- */}
        {activeTab === 'pre' && (
          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 text-center space-y-6">
            <h2 className="text-2xl font-bold text-mint-green">Mint Tiket Acara</h2>
            <p className="text-slate-400 text-sm">Pilih tier dan selesaikan transaksi untuk membuka akses Event Day & Gate Pass.</p>
            
            {/* Indikator jika user sudah punya tiket */}
            {hasTicket && (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm font-mono flex items-center justify-center gap-2">
                <span>✅</span> Anda sudah memiliki tiket! Tab <strong>Event Day (Gate)</strong> & <strong>Post-Event</strong> sekarang terbuka.
              </div>
            )}

            <div className="p-8 bg-slate-900/80 rounded-xl border border-slate-700 text-slate-300">
              <p className="font-mono text-xs text-mint-green mb-4">// TIER SELECTION & MINT FORM</p>
              <p className="text-sm">Silakan lakukan mint tiket untuk membuka fitur Event Day (QR Code Gate Pass).</p>
            </div>
          </div>
        )}

        {/* --- TAMPILAN 2: EVENT DAY (GATE PASS QR CODE) --- */}
        {activeTab === 'day' && (
          <div>
            {hasTicket ? (
              <EventDayTicket
                tokenId={1}
                contractAddress={contractAddress}
                ownerAddress={address || '0x...'}
                tier="VIP PASS"
                perks={['Akses Gate Utama', 'Fast-Track Queue', 'Digital POAP Badge']}
                status="UNUSED"
              />
            ) : (
              <div className="bg-slate-800/40 border border-red-500/30 rounded-2xl p-8 text-center">
                <p className="text-4xl mb-4">🔒</p>
                <h3 className="text-xl font-bold text-red-400 mb-2">Akses Terkunci</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Fitur QR Code Gate Pass hanya dapat diakses oleh pemilik tiket terverifikasi di-chain.
                </p>
                <button
                  onClick={() => setActiveTab('pre')}
                  className="px-6 py-2.5 bg-mint-green text-slate-900 font-bold rounded-lg text-xs font-mono hover:bg-mint-green/90 transition-colors"
                >
                  Beli / Mint Tiket Sekarang →
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- TAMPILAN 3: POST-EVENT (POAP & COLLECTIBLE) --- */}
        {activeTab === 'post' && (
          <div>
            {hasTicket ? (
              <div className="bg-slate-800/40 border border-purple-500/30 rounded-2xl p-8 text-center space-y-4">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-mono">FINISHER POAP</span>
                <h3 className="text-2xl font-bold text-purple-400">Digital Souvenir & Attendance POAP</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Acara telah selesai. Tiket NFT Anda kini tersimpan secara permanen di wallet sebagai bukti kehadiran bersejarah.
                </p>
              </div>
            ) : (
              <div className="bg-slate-800/40 border border-red-500/30 rounded-2xl p-8 text-center">
                <p className="text-4xl mb-4">🔒</p>
                <h3 className="text-xl font-bold text-red-400 mb-2">Akses Terkunci</h3>
                <p className="text-slate-400 text-sm">Anda harus memiliki tiket untuk melihat souvenir POAP acara ini.</p>
              </div>
            )}
          </div>
        )}

        {/* Tombol Kembali ke Marketplace */}
        <div className="mt-8 text-center">
          <Link href="/marketplace" className="text-xs font-mono text-slate-500 hover:text-mint-green transition-colors">
            ← Kembali ke Marketplace
          </Link>
        </div>

      </div>
    </main>
  );
}