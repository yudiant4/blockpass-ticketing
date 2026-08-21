'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { css } from '../../../styled-system/css';

// Mock Data Tiket Lengkap dengan semua parameter
const marketplaceEvents = [
    {
        id: 1,
        title: 'ALAS TRAIL RUN 2026',
        organizer: 'Mojokerto Extreme',
        category: 'Festival',
        location: 'Pacet, Mojokerto',
        date: 'Aug 15, 2026',
        network: 'Ethereum',
        cryptoPrice: '0.005 ETH',
        fiatPrice: 'Rp 250.000',
        status: 'Live Minting',
        statusColor: 'neon',
        supply: { minted: 85, total: 150 },
        rarity: 'VIP Pass',
        action: 'Mint Now',
        bg: 'linear-gradient(135deg, #0a2010 0%, #0f3d2e 100%)',
        trending: true,
    },
    {
        id: 2,
        title: 'TALUS WEB3 SUMMIT',
        organizer: 'Talus Network',
        category: 'Konferensi',
        location: 'Jakarta, Indonesia',
        date: 'Sep 22, 2026',
        network: 'Base',
        cryptoPrice: '0.002 ETH',
        fiatPrice: 'Rp 100.000',
        status: 'Live Minting',
        statusColor: 'neon',
        supply: { minted: 420, total: 500 },
        rarity: 'Tier 1',
        action: 'Mint Now',
        bg: 'linear-gradient(135deg, #0d1f2d 0%, #1a2030 100%)',
        trending: true,
    },
    {
        id: 3,
        title: 'ANIME MATSURI: SOUL SOCIETY',
        organizer: 'OtakuVerse',
        category: 'Exhibition',
        location: 'Surabaya, East Java',
        date: 'Oct 10, 2026',
        network: 'Polygon',
        cryptoPrice: '50 MATIC',
        fiatPrice: 'Rp 250.000',
        status: 'Selling Fast',
        statusColor: 'neon3',
        supply: { minted: 890, total: 1000 },
        rarity: 'General Admission',
        action: 'Buy on Secondary',
        bg: 'linear-gradient(135deg, #2d0f1a 0%, #1a0f2e 100%)',
        trending: false,
    },
    {
        id: 4,
        title: 'RINJANI EXPEDITION VIP',
        organizer: 'Trekker DAO',
        category: 'Festival',
        location: 'Lombok, NTB',
        date: 'Nov 01, 2026',
        network: 'Ethereum',
        cryptoPrice: '0.01 ETH',
        fiatPrice: 'Rp 500.000',
        status: 'Upcoming',
        statusColor: 'neon2',
        supply: { minted: 0, total: 50 },
        rarity: 'Legendary',
        action: 'Join Whitelist',
        bg: 'linear-gradient(135deg, #1f1c0d 0%, #302b1a 100%)',
        trending: true,
    },
    {
        id: 5,
        title: 'NEON CITY RAVE VOL. 4',
        organizer: 'Electronic Horizon',
        category: 'Konser',
        location: 'Bali, Indonesia',
        date: 'Dec 31, 2026',
        network: 'Polygon',
        cryptoPrice: '120 MATIC',
        fiatPrice: 'Rp 1.500.000',
        status: 'Sold Out',
        statusColor: 'muted',
        supply: { minted: 2000, total: 2000 },
        rarity: 'Tier 2',
        action: 'Buy on Secondary',
        bg: 'linear-gradient(135deg, #1a0d2d 0%, #2d1a30 100%)',
        trending: false,
    },
    {
        id: 6,
        title: 'BLOCKPASS ESPORTS ARENA',
        organizer: 'Gaming Guild',
        category: 'Esports',
        location: 'Jakarta, Indonesia',
        date: 'Aug 28, 2026',
        network: 'Base',
        cryptoPrice: '0.001 ETH',
        fiatPrice: 'Rp 50.000',
        status: 'Live Minting',
        statusColor: 'neon',
        supply: { minted: 150, total: 1000 },
        rarity: 'General Admission',
        action: 'Mint Now',
        bg: 'linear-gradient(135deg, #0d2d2d 0%, #1a3030 100%)',
        trending: false,
    },
    {
        id: 7,
        title: 'JAVA HIKING COMMUNITY MEETUP',
        organizer: 'Trekker DAO',
        category: 'Festival',
        location: 'Bogor, West Java',
        date: 'Sep 05, 2026',
        network: 'Ethereum',
        cryptoPrice: '0.001 ETH',
        fiatPrice: 'Rp 50.000',
        status: 'Live Minting',
        statusColor: 'neon',
        supply: { minted: 30, total: 100 },
        rarity: 'General Admission',
        action: 'Mint Now',
        bg: 'linear-gradient(135deg, #0f2d0d 0%, #1a3030 100%)',
        trending: false,
    },
    {
        id: 8,
        title: 'NFT ART JAKARTA EXPO',
        organizer: 'OtakuVerse',
        category: 'Exhibition',
        location: 'Jakarta, Indonesia',
        date: 'Oct 02, 2026',
        network: 'Base',
        cryptoPrice: '0.0015 ETH',
        fiatPrice: 'Rp 75.000',
        status: 'Upcoming',
        statusColor: 'neon2',
        supply: { minted: 0, total: 300 },
        rarity: 'Early Bird',
        action: 'Join Whitelist',
        bg: 'linear-gradient(135deg, #1a0f2d 0%, #2d1a30 100%)',
        trending: true,
    },
    {
        id: 9,
        title: 'BANDUNG INDIE MUSIC FEST',
        organizer: 'Electronic Horizon',
        category: 'Konser',
        location: 'Bandung, West Java',
        date: 'Oct 18, 2026',
        network: 'Polygon',
        cryptoPrice: '30 MATIC',
        fiatPrice: 'Rp 100.000',
        status: 'Live Minting',
        statusColor: 'neon',
        supply: { minted: 210, total: 800 },
        rarity: 'Tier 1',
        action: 'Mint Now',
        bg: 'linear-gradient(135deg, #2d0f1a 0%, #1a0f2e 100%)',
        trending: false,
    },
    {
        id: 10,
        title: 'BALI SUNSET YOGA RETREAT',
        organizer: 'Mojokerto Extreme',
        category: 'Festival',
        location: 'Uluwatu, Bali',
        date: 'Nov 14, 2026',
        network: 'Ethereum',
        cryptoPrice: '0.004 ETH',
        fiatPrice: 'Rp 200.000',
        status: 'Upcoming',
        statusColor: 'neon2',
        supply: { minted: 0, total: 200 },
        rarity: 'VIP Pass',
        action: 'Join Whitelist',
        bg: 'linear-gradient(135deg, #1f1c0d 0%, #302b1a 100%)',
        trending: true,
    },
    {
        id: 11,
        title: 'SURABAYA STREET FOOD FEST',
        organizer: 'Gaming Guild',
        category: 'Festival',
        location: 'Surabaya, East Java',
        date: 'Sep 26, 2026',
        network: 'Base',
        cryptoPrice: '0.001 ETH',
        fiatPrice: 'Rp 50.000',
        status: 'Selling Fast',
        statusColor: 'neon3',
        supply: { minted: 450, total: 500 },
        rarity: 'General Admission',
        action: 'Buy on Secondary',
        bg: 'linear-gradient(135deg, #0d2d1a 0%, #1a3030 100%)',
        trending: false,
    },
    {
        id: 12,
        title: 'WEB3 DEV HACKATHON 2026',
        organizer: 'Talus Network',
        category: 'Konferensi',
        location: 'Yogyakarta, Indonesia',
        date: 'Dec 05, 2026',
        network: 'Ethereum',
        cryptoPrice: '0.0015 ETH',
        fiatPrice: 'Rp 75.000',
        status: 'Live Minting',
        statusColor: 'neon',
        supply: { minted: 89, total: 200 },
        rarity: 'Hacker Pass',
        action: 'Mint Now',
        bg: 'linear-gradient(135deg, #0d1f2d 0%, #1a2030 100%)',
        trending: false,
    },
];

export default function MarketplacePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [status, setStatus] = useState('All');
    const [network, setNetwork] = useState('All');
    const [sort, setSort] = useState('Most Popular');

    // Logika Filter Berlapis
    const filteredEvents = marketplaceEvents.filter((ev) => {
        const matchSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || ev.organizer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = category === 'All' || ev.category === category;
        const matchStatus = status === 'All' || ev.status.includes(status);
        const matchNetwork = network === 'All' || ev.network === network;
        return matchSearch && matchCategory && matchStatus && matchNetwork;
    });

    const trendingEvents = marketplaceEvents.filter(ev => ev.trending);

    // ===== PAGINATION =====
    const PAGE_SIZE = 6;
    const [page, setPage] = useState(1);
    useEffect(() => { setPage(1); }, [searchQuery, category, status, network, sort]);
    const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const paginatedEvents = filteredEvents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <main className={css({ minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' })}>
            <div className={css({ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' })}>

                {/* Tombol Kembali */}
                <Link href="/" className={css({
                    display: 'inline-block', fontFamily: 'mono', fontSize: '11px', color: 'muted',
                    textDecoration: 'none', marginBottom: '24px', textTransform: 'uppercase',
                    _hover: { color: 'neon' }
                })}>
                    ← Back to Home
                </Link>

                {/* Highlight Trending Section */}
                <div className={css({ marginBottom: '60px' })}>
                    <div className={css({ fontFamily: 'mono', fontSize: '11px', letterSpacing: '0.3em', color: 'neon', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' })}>
                        <span className={css({ width: '8px', height: '8px', background: 'neon', borderRadius: '50%', animation: 'blink 2s infinite' })}></span>
                        TRENDING & FEATURED
                    </div>
                    <div className={css({ display: 'grid', gridTemplateColumns: { base: '1fr', lg: 'repeat(3, 1fr)' }, gap: '20px' })}>
                        {trendingEvents.map(ev => (
                            <Link key={`trend-${ev.id}`} href={`/event/${ev.id}`} className={css({ textDecoration: 'none', color: 'inherit' })}>                                <div className={css({ background: 'card', border: '1px solid token(colors.neon)', padding: '20px', position: 'relative', overflow: 'hidden', transition: 'transform 0.3s', _hover: { transform: 'translateY(-4px)', boxShadow: '0 10px 30px rgba(0,245,196,0.15)' } })}>
                                    <div className={css({ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(0,245,196,0.2) 0%, transparent 70%)', filter: 'blur(20px)' })}></div>
                                    <h3 className={css({ fontSize: '18px', fontWeight: '800', marginBottom: '4px', color: 'white' })}>{ev.title}</h3>
                                    <p className={css({ fontFamily: 'mono', fontSize: '10px', color: 'neon' })}>{ev.cryptoPrice} • {ev.network}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className={css({ background: 'surface', border: '1px solid token(colors.border)', padding: '24px', marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '20px' })}>
                    <input
                        type="text"
                        placeholder="Search events, organizers, or locations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={css({ width: '100%', background: 'bg', border: '1px solid token(colors.border)', padding: '16px 24px', color: 'text', fontFamily: 'mono', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s', _focus: { borderColor: 'neon' } })}
                    />

                    <div className={css({ display: 'grid', gridTemplateColumns: { base: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: '16px' })}>
                        {/* Dropdown Kategori */}
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className={css({ background: 'bg', border: '1px solid token(colors.border)', padding: '12px', color: 'text', fontFamily: 'mono', fontSize: '11px', outline: 'none' })}>
                            <option value="All">All Categories</option>
                            <option value="Konser">Konser</option>
                            <option value="Konferensi">Konferensi</option>
                            <option value="Exhibition">Exhibition</option>
                            <option value="Festival">Festival</option>
                            <option value="Esports">Esports</option>
                        </select>

                        {/* Dropdown Status */}
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className={css({ background: 'bg', border: '1px solid token(colors.border)', padding: '12px', color: 'text', fontFamily: 'mono', fontSize: '11px', outline: 'none' })}>
                            <option value="All">All Status</option>
                            <option value="Live Minting">Live Minting</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Sold Out">Sold Out</option>
                        </select>

                        {/* Dropdown Network */}
                        <select value={network} onChange={(e) => setNetwork(e.target.value)} className={css({ background: 'bg', border: '1px solid token(colors.border)', padding: '12px', color: 'text', fontFamily: 'mono', fontSize: '11px', outline: 'none' })}>
                            <option value="All">All Networks</option>
                            <option value="Ethereum">Ethereum</option>
                            <option value="Polygon">Polygon</option>
                            <option value="Base">Base</option>
                        </select>

                        {/* Dropdown Sort */}
                        <select value={sort} onChange={(e) => setSort(e.target.value)} className={css({ background: 'bg', border: '1px solid token(colors.border)', padding: '12px', color: 'text', fontFamily: 'mono', fontSize: '11px', outline: 'none' })}>
                            <option value="Most Popular">Most Popular</option>
                            <option value="Low to High">Price: Low to High</option>
                            <option value="High to Low">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Grid Card Tiket (NFT Cards) */}
                <div className={css({ display: 'grid', gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: '24px' })}>
                    {paginatedEvents?.map((ev) => (

                        <Link href={`/event/${ev.id}`} key={ev.id} className={css({ textDecoration: 'none', color: 'inherit' })}>
                            <div className={css({ background: 'card', border: '1px solid token(colors.border)', transition: 'all 0.3s', cursor: 'pointer', _hover: { transform: 'translateY(-6px)', borderColor: 'neon', boxShadow: '0 15px 30px rgba(0,0,0,0.5)' } })}>

                                {/* Visual NFT / Tiket */}
                                <div className={css({ height: '200px', padding: '20px', position: 'relative', overflow: 'hidden' })} style={{ background: ev.bg }}>
                                    {/* Efek Garis Animasi */}
                                    <div className={css({ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.2)', animation: 'scanLine 3s linear infinite' })}></div>

                                    {/* Badge Kelangkaan & Jaringan */}
                                    <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' })}>
                                        <span className={css({ padding: '4px 8px', background: 'rgba(0,0,0,0.8)', border: '1px solid', color: 'white', fontFamily: 'mono', fontSize: '9px', textTransform: 'uppercase' })} style={{ borderColor: `token(colors.${ev.statusColor})` }}>
                                            {ev.rarity}
                                        </span>
                                        <span className={css({ fontFamily: 'mono', fontSize: '10px', fontWeight: '700', color: 'white', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' })}>
                                            {ev.network}
                                        </span>
                                    </div>

                                    {/* Status Overlay */}
                                    <div className={css({ position: 'absolute', bottom: '20px', left: '20px', fontFamily: 'mono', fontSize: '12px', fontWeight: '800', letterSpacing: '0.1em' })} style={{ color: `token(colors.${ev.statusColor})` }}>
                                        ● {ev.status}
                                    </div>
                                </div>

                                {/* Detail Konten */}
                                <div className={css({ padding: '24px' })}>
                                    <h3 className={css({ fontSize: '20px', fontWeight: '700', marginBottom: '4px', lineHeight: '1.2' })}>{ev.title}</h3>
                                    <div className={css({ fontFamily: 'mono', fontSize: '10px', color: 'muted', marginBottom: '16px' })}>by {ev.organizer}</div>

                                    <div className={css({ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'mono', fontSize: '11px', color: 'text', marginBottom: '24px' })}>
                                        <span>📅 {ev.date}</span>
                                        <span>📍 {ev.location}</span>
                                    </div>

                                    {/* Sisa Stok / Progress */}
                                    <div className={css({ marginBottom: '24px' })}>
                                        <div className={css({ display: 'flex', justifyContent: 'space-between', fontFamily: 'mono', fontSize: '10px', color: 'muted', marginBottom: '8px' })}>
                                            <span>Minted</span>
                                            <span>{ev.supply.minted} / {ev.supply.total}</span>
                                        </div>
                                        <div className={css({ width: '100%', height: '4px', background: 'surface', borderRadius: '2px', overflow: 'hidden' })}>
                                            <div className={css({ height: '100%', background: 'neon' })} style={{ width: `${(ev.supply.minted / ev.supply.total) * 100}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Harga & Tombol Aksi */}
                                    <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid token(colors.border)', paddingTop: '20px' })}>
                                        <div>
                                            <div className={css({ fontFamily: 'mono', fontSize: '16px', color: 'neon', fontWeight: '800' })}>{ev.cryptoPrice}</div>
                                            <div className={css({ fontFamily: 'mono', fontSize: '10px', color: 'muted', marginTop: '2px' })}>~ {ev.fiatPrice}</div>
                                        </div>
                                        <button className={css({
                                            background: ev.status === 'Sold Out' ? 'surface' : 'rgba(0,245,196,0.1)',
                                            border: `1px solid ${ev.status === 'Sold Out' ? 'token(colors.border)' : 'token(colors.neon)'}`,
                                            color: ev.status === 'Sold Out' ? 'muted' : 'neon',
                                            padding: '10px 16px', fontFamily: 'mono', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', cursor: 'pointer',
                                            transition: 'all 0.2s', _hover: ev.status !== 'Sold Out' ? { background: 'neon', color: 'bg' } : {}
                                        })}>
                                            {ev.action}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {filteredEvents.length === 0 && (
                        <div className={css({ padding: '40px 0', gridColumn: '1 / -1', textAlign: 'center', fontFamily: 'mono', color: 'muted' })}>
                            No tickets found matching your criteria.
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className={css({ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '48px', flexWrap: 'wrap' })}>
                        <button
                            onClick={() => setPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={css({ padding: '10px 16px', background: 'surface', border: '1px solid token(colors.border)', color: currentPage === 1 ? 'muted' : 'text', fontFamily: 'mono', fontSize: '11px', textTransform: 'uppercase', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', transition: 'all 0.2s', _hover: currentPage !== 1 ? { borderColor: 'neon', color: 'neon' } : {} })}
                        >
                            ← Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={css({
                                    width: '40px', height: '40px', background: p === currentPage ? 'neon' : 'surface',
                                    border: '1px solid token(colors.border)', color: p === currentPage ? 'bg' : 'text',
                                    fontFamily: 'mono', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s',
                                    _hover: p !== currentPage ? { borderColor: 'neon', color: 'neon' } : {}
                                })}
                            >
                                {p}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={css({ padding: '10px 16px', background: 'surface', border: '1px solid token(colors.border)', color: currentPage === totalPages ? 'muted' : 'text', fontFamily: 'mono', fontSize: '11px', textTransform: 'uppercase', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', transition: 'all 0.2s', _hover: currentPage !== totalPages ? { borderColor: 'neon', color: 'neon' } : {} })}
                        >
                            Next →
                        </button>
                    </div>
                )}

            </div>
        </main>
    );
}