'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { css } from '../../../styled-system/css';
import { BLOCKPASS_ADDRESS, BLOCKPASS_ABI } from '../../lib/blockpass';

const ticketTiers = [
    {
        name: 'VIP PASS',
        price: '0.01 ETH',
        fiat: 'Rp 500.000',
        benefits: ['Akses Backstage Eksklusif', 'Free Merchandise NFT & Fisik', 'Drink Coupon & VIP Lounge'],
    },
    {
        name: 'EARLY BIRD',
        price: '0.003 ETH',
        fiat: 'Rp 150.000',
        benefits: ['Akses Masuk Utama Event', 'Digital POAP Finisher Badge'],
    },
    {
        name: 'GENERAL ADMISSION',
        price: '0.005 ETH',
        fiat: 'Rp 250.000',
        benefits: ['Akses Masuk Area Umum', 'Standard Digital Ticket NFT'],
    },
];

export default function EventDetailPage() {
    // State untuk mensimulasikan 3 fase: 'pre' | 'day' | 'post'
    const [phase, setPhase] = useState<'pre' | 'day' | 'post'>('pre');
    const [selectedTier, setSelectedTier] = useState(0);
    const [mintHash, setMintHash] = useState<string | null>(null);

    const { writeContract, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: mintHash as `0x${string}` | undefined });

    const mintTicket = () => {
        const tier = ticketTiers[selectedTier];
        writeContract(
            {
                address: BLOCKPASS_ADDRESS,
                abi: BLOCKPASS_ABI,
                functionName: 'mintTicket',
                args: [BigInt(1), tier.name, 'Pacet, Mojokerto, East Java', '2026-08-15', `https://blockpass.app/token/${tier.name.toLowerCase().replace(/\s+/g, '-')}.json`],
            },
            { onSuccess: (h) => setMintHash(h) }
        );
    };

    return (
        <main className={css({ minHeight: '100vh', paddingTop: '100px', paddingBottom: '120px' })}>

            {/* SIMULATION TOGGLE (Untuk uji coba 3 fase secara real-time) */}
            <div className={css({ position: 'fixed', bottom: '24px', right: '24px', zIndex: 50, background: 'surface', border: '1px solid token(colors.neon)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 0 20px rgba(0,245,196,0.2)' })}>
                <span className={css({ fontFamily: 'mono', fontSize: '10px', color: 'muted', textTransform: 'uppercase' })}>Simulate Phase:</span>
                <div className={css({ display: 'flex', gap: '8px' })}>
                    <button onClick={() => setPhase('pre')} className={css({ background: phase === 'pre' ? 'neon' : 'bg', color: phase === 'pre' ? 'bg' : 'text', border: '1px solid token(colors.border)', padding: '6px 10px', fontFamily: 'mono', fontSize: '10px', cursor: 'pointer', fontWeight: '700' })}>Pre-Event</button>
                    <button onClick={() => setPhase('day')} className={css({ background: phase === 'day' ? 'neon' : 'bg', color: phase === 'day' ? 'bg' : 'text', border: '1px solid token(colors.border)', padding: '6px 10px', fontFamily: 'mono', fontSize: '10px', cursor: 'pointer', fontWeight: '700' })}>Event Day</button>
                    <button onClick={() => setPhase('post')} className={css({ background: phase === 'post' ? 'neon' : 'bg', color: phase === 'post' ? 'bg' : 'text', border: '1px solid token(colors.border)', padding: '6px 10px', fontFamily: 'mono', fontSize: '10px', cursor: 'pointer', fontWeight: '700' })}>Post-Event</button>
                </div>
            </div>

            <div className={css({ maxWidth: '1200px', margin: '0 auto', padding: { base: '0 20px', md: '0 40px' } })}>

                {/* Tombol Kembali */}
                <div className={css({ marginBottom: '24px' })}>
                    <Link href="/marketplace" className={css({ display: 'inline-block', fontFamily: 'mono', fontSize: '11px', color: 'muted', textDecoration: 'none', textTransform: 'uppercase', _hover: { color: 'neon' } })}>
                        ← Back to Marketplace
                    </Link>
                </div>

                {/* HEADER & BANNER EVENT */}
                <div className={css({ marginBottom: '40px' })}>
                    <div className={css({ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(0,245,196,0.1)', border: '1px solid token(colors.neon)', fontFamily: 'mono', fontSize: '10px', color: 'neon', textTransform: 'uppercase', marginBottom: '16px' })}>
                        <span>✓ Verified Organizer</span> • Mojokerto Extreme DAO
                    </div>

                    <h1 className={css({ fontSize: { base: '32px', md: '56px' }, fontWeight: '800', lineHeight: '1.1', marginBottom: '16px' })}>
                        ALAS TRAIL RUN 2026
                    </h1>

                    <div className={css({ display: 'flex', gap: { base: '16px', md: '32px' }, fontFamily: 'mono', fontSize: '12px', color: 'muted', marginBottom: '24px', flexWrap: 'wrap' })}>
                        <div>📅 Aug 15, 2026 — 05:00 AM WIB</div>
                        <div>📍 Pacet, Mojokerto, East Java</div>
                    </div>

                    {/* Banner & Video Teaser */}
                    <div className={css({ width: '100%', height: { base: '200px', md: '380px' }, background: 'linear-gradient(135deg, #0a2010 0%, #0f3d2e 100%)', border: '1px solid token(colors.border)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' })}>
                        <div className={css({ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' })}></div>
                        <div className={css({ position: 'relative', zIndex: 2, textAlign: 'center' })}>
                            <div className={css({ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,245,196,0.2)', border: '2px solid token(colors.neon)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', cursor: 'pointer' })}>▶</div>
                            <span className={css({ fontFamily: 'mono', fontSize: '11px', color: 'neon', textTransform: 'uppercase', letterSpacing: '0.1em' })}>Watch Official Teaser Trailer</span>
                        </div>
                    </div>
                </div>

                {/* KONTEN UTAMA DUA KOLOM */}
                <div className={css({ display: 'grid', gridTemplateColumns: { base: '1fr', lg: '1.4fr 1fr' }, gap: '40px' })}>

                    {/* KOLOM KIRI: Informasi Detail Acara */}
                    <div className={css({ display: 'flex', flexDirection: 'column', gap: '32px' })}>

                        {/* Deskripsi & Lineup */}
                        <div className={css({ background: 'card', border: '1px solid token(colors.border)', padding: { base: '20px', md: '28px' } })}>
                            <h3 className={css({ fontSize: '18px', fontWeight: '700', marginBottom: '12px' })}>About The Event & Lineup</h3>
                            <p className={css({ fontSize: '13px', lineHeight: '1.7', color: 'muted', marginBottom: '20px' })}>
                                Navigate through dense forests, sharp ascents, and technical downhills. Fully integrated with on-chain verification to guarantee zero scalping.
                            </p>
                            <div className={css({ fontFamily: 'mono', fontSize: '11px', color: 'text', borderTop: '1px solid token(colors.border)', paddingTop: '16px' })}>
                                <span className={css({ color: 'neon' })}>Speakers / Pro Athletes:</span> Arief W. (Ultra Pro) • Sarah K. (Trail Master) • Dr. Hendra
                            </div>
                        </div>

                        {/* Jadwal Rundown */}
                        <div className={css({ background: 'card', border: '1px solid token(colors.border)', padding: { base: '20px', md: '28px' } })}>
                            <h3 className={css({ fontSize: '18px', fontWeight: '700', marginBottom: '16px' })}>Schedule Rundown</h3>
                            <div className={css({ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'mono', fontSize: '11px' })}>
                                <div className={css({ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid token(colors.border)', pb: '8px' })}>
                                    <span className={css({ color: 'neon' })}>04:00 AM</span><span className={css({ color: 'muted' })}>Mandatory Gear Check & Validation</span>
                                </div>
                                <div className={css({ display: 'flex', justifyContent: 'space-between' })}>
                                    <span className={css({ color: 'neon' })}>05:30 AM</span><span className={css({ color: 'muted' })}>Flag Off 42K Category</span>
                                </div>
                            </div>
                        </div>

                        {/* Syarat & Lokasi Maps */}
                        <div className={css({ background: 'card', border: '1px solid token(colors.border)', padding: { base: '20px', md: '28px' } })}>
                            <h3 className={css({ fontSize: '18px', fontWeight: '700', marginBottom: '12px' })}>Terms & Location</h3>
                            <p className={css({ fontSize: '12px', color: 'muted', marginBottom: '16px' })}>
                                ✦ Wajib membawa perlengkapan keselamatan.<br />✦ Tiket berbasis NFT, aman dari pemalsuan.
                            </p>
                            <div className={css({ width: '100%', height: '140px', background: 'surface', border: '1px solid token(colors.border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'mono', fontSize: '11px', color: 'muted' })}>
                                🗺️ [Google Maps Integration: Pacet Highland]
                            </div>
                        </div>

                    </div>

                    {/* KOLOM KANAN: DINAMIS BERDASARKAN FASE WAKTU */}
                    <div>

                        {/* FASE A: SEBELUM EVENT (PRE-EVENT PHASE) */}
                        {phase === 'pre' && (
                            <div className={css({ background: 'card', border: '1px solid token(colors.border)', padding: { base: '20px', md: '28px' }, position: 'sticky', top: '100px' })}>
                                <div className={css({ fontFamily: 'mono', fontSize: '11px', color: 'neon', letterSpacing: '0.2em', marginBottom: '12px', textTransform: 'uppercase' })}>
                  // Pre-Event Phase: Tiering Tiket
                                </div>

                                <div className={css({ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' })}>
                                    {ticketTiers.map((tier, idx) => (
                                        <div key={idx} onClick={() => setSelectedTier(idx)} className={css({ padding: '14px', background: selectedTier === idx ? 'surface' : 'bg', border: `1px solid ${selectedTier === idx ? 'token(colors.neon)' : 'token(colors.border)'}`, cursor: 'pointer' })}>
                                            <div className={css({ display: 'flex', justifyContent: 'space-between', fontFamily: 'mono', fontSize: '12px', fontWeight: '700', marginBottom: '4px' })}>
                                                <span>{tier.name}</span><span className={css({ color: 'neon' })}>{tier.price}</span>
                                            </div>
                                            <div className={css({ fontFamily: 'mono', fontSize: '10px', color: 'muted' })}>~ {tier.fiat}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className={css({ background: 'surface', border: '1px solid token(colors.border)', padding: '12px', marginBottom: '20px', fontFamily: 'mono', fontSize: '11px' })}>
                                    <div className={css({ color: 'neon2', marginBottom: '6px', textTransform: 'uppercase' })}>Benefits:</div>
                                    {ticketTiers[selectedTier].benefits.map((b, i) => (<div key={i} className={css({ color: 'muted' })}>✓ {b}</div>))}
                                </div>

                                <button
                                    onClick={mintTicket}
                                    disabled={isPending || isConfirming}
                                    className={css({ width: '100%', padding: '14px', background: 'neon', color: 'bg', fontFamily: 'mono', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', border: 'none', cursor: 'pointer', _disabled: { opacity: 0.6, cursor: 'not-allowed' } })}
                                >
                                    {isConfirming ? 'Confirming…' : isPending ? 'Check Wallet…' : `Mint ${ticketTiers[selectedTier].name}`}
                                </button>
                                {mintHash && (
                                    <div className={css({ marginTop: '12px', fontFamily: 'mono', fontSize: '10px', color: isSuccess ? 'neon' : 'muted', wordBreak: 'break-all' })}>
                                        {isSuccess ? `✅ Minted! Tx: ${mintHash}` : `Tx pending: ${mintHash}`}
                                    </div>
                                )}
                                {error && (
                                    <div className={css({ marginTop: '12px', fontFamily: 'mono', fontSize: '10px', color: 'neon2', wordBreak: 'break-all' })}>
                                        ❌ {error.message}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* FASE B: SAAT EVENT DIBUKA (EVENT DAY PHASE) */}
                        {phase === 'day' && (
                            <div className={css({ background: '#0a0d14', border: '1px solid token(colors.neon)', boxShadow: '0 0 30px rgba(0,245,196,0.15)', padding: { base: '20px', md: '28px' }, position: 'sticky', top: '100px', textAlign: 'center' })}>
                                <div className={css({ display: 'inline-block', padding: '4px 10px', background: 'rgba(0,245,196,0.1)', color: 'neon', fontFamily: 'mono', fontSize: '9px', textTransform: 'uppercase', marginBottom: '16px', border: '1px solid token(colors.neon)' })}>
                                    Status: Unused (Ready to Scan)
                                </div>

                                {/* Dynamic QR Code */}
                                <div className={css({ width: '180px', height: '180px', margin: '0 auto 20px', background: 'white', position: 'relative', overflow: 'hidden', padding: '8px' })}>
                                    <div className={css({ width: '100%', height: '100%', backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '16px 16px', backgroundPosition: '0 0, 8px 8px' })}></div>
                                    <div className={css({ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'neon', animation: 'scanLine 2s linear infinite' })}></div>
                                </div>

                                <div className={css({ fontFamily: 'mono', fontSize: '11px', color: 'muted', marginBottom: '20px', textAlign: 'left', background: 'surface', padding: '12px', border: '1px solid token(colors.border)' })}>
                                    <span className={css({ color: 'text', fontWeight: '700' })}>On-Chain Metadata:</span><br />
                                    • Token ID: #1088<br />
                                    • Contract: 0x71C...32a9<br />
                                    • Tier: VIP Pass - Seat A12<br />
                                    • Perks: 1x T-Shirt, Fast-track Queue
                                </div>

                                <div className={css({ display: 'flex', flexDirection: 'column', gap: '8px' })}>
                                    <button className={css({ width: '100%', padding: '12px', background: 'neon', color: 'bg', fontFamily: 'mono', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', border: 'none', cursor: 'pointer' })}>
                                        Scan QR at Gate
                                    </button>
                                    <div className={css({ display: 'flex', gap: '8px' })}>
                                        <button className={css({ flex: 1, padding: '10px', background: 'transparent', border: '1px solid token(colors.border)', color: 'text', fontFamily: 'mono', fontSize: '10px', cursor: 'pointer' })}>Transfer / Sell</button>
                                        <button className={css({ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'text', fontFamily: 'mono', fontSize: '10px', cursor: 'pointer' })}>Claim Perks</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* FASE C: PASCA-EVENT (POST-EVENT / COLLECTIBLE NFT PHASE) */}
                        {phase === 'post' && (
                            <div className={css({ background: 'card', border: '1px solid token(colors.neon2)', boxShadow: '0 0 30px rgba(123,47,255,0.15)', padding: { base: '20px', md: '28px' }, position: 'sticky', top: '100px', textAlign: 'center' })}>
                                <div className={css({ display: 'inline-block', padding: '4px 10px', background: 'rgba(123,47,255,0.2)', color: '#a78bfa', fontFamily: 'mono', fontSize: '9px', textTransform: 'uppercase', marginBottom: '16px', border: '1px solid #7b2fff' })}>
                                    Status: Used / POAP Collectible
                                </div>

                                <div className={css({ width: '100%', height: '140px', background: 'linear-gradient(135deg, #1a0f2e 0%, #2d0f4f 100%)', border: '1px solid #7b2fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', position: 'relative' })}>
                                    <span className={css({ fontFamily: 'mono', fontSize: '14px', fontWeight: '800', color: '#a78bfa', letterSpacing: '0.1em' })}>🌟 FINISHER POAP #1088</span>
                                </div>

                                <p className={css({ fontFamily: 'mono', fontSize: '11px', color: 'muted', marginBottom: '20px', lineHeight: '1.6' })}>
                                    Event telah selesai! QR Code telah dinonaktifkan secara otomatis. Tiket Anda kini berubah menjadi <strong>Digital Souvenir (POAP)</strong> yang menyimpan riwayat kehadiran, foto eksklusif, dan setlist acara di wallet Anda.
                                </p>

                                <button className={css({ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #7b2fff', color: '#a78bfa', fontFamily: 'mono', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', cursor: 'pointer', _hover: { background: 'rgba(123,47,255,0.1)' } })}>
                                    View on Marketplace (Trade)
                                </button>
                            </div>
                        )}

                    </div>

                </div>

            </div>
        </main>
    );
}