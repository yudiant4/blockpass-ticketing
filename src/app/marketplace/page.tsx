'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { marketplaceEvents, MarketplaceEvent } from '@/lib/events';
import { apiUrl } from '@/lib/api';
import { lowestPrice, statusLabel, supplySummary, type EventLike } from '@/lib/eventHelpers';
import { DotMatrixBackground, FluxVortex, SceneFrame, UplinkLoader } from '@/components/three/ClientScenes';

function toCard(ev: EventLike): MarketplaceEvent {
  const supply = supplySummary(ev);
  const status = statusLabel(ev);
  const price = lowestPrice(ev);
  const topTier = [...ev.tiers].sort((a, b) => b.price - a.price)[0];
  return {
    id: ev._id,
    title: ev.title,
    organizer: `${ev.createdBy.slice(0, 6)}…${ev.createdBy.slice(-4)}`,
    category: ev.category,
    status,
    network: ev.network || 'Base',
    date: ev.startDate.slice(0, 10),
    location: ev.location,
    cryptoPrice: `${price} ETH`,
    fiatPrice: `~$${(price * 3500).toFixed(2)}`,
    supply,
    rarity: topTier?.tierName || 'Regular',
    statusColor: status === 'Live Minting' ? 'neon' : status === 'Sold Out' || status === 'Ended' ? 'red' : 'cyan',
    action: status === 'Sold Out' || status === 'Ended' ? status : status === 'Upcoming' ? 'Register' : 'Mint Now',
    trending: status === 'Live Minting' || (status !== 'Ended' && supply.minted > 50),
    bg: 'linear-gradient(135deg, #0d1017 0%, #1a2030 100%)',
  };
}

function parsePrice(cryptoPrice: string): number {
  const n = parseFloat(cryptoPrice);
  return Number.isFinite(n) ? n : 0;
}

export default function MarketplacePage() {
  const [events, setEvents] = useState<MarketplaceEvent[]>(marketplaceEvents);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [network, setNetwork] = useState('All');
  const [sort, setSort] = useState('Most Popular');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl('/api/events?limit=50'));
        const data = await res.json();
        if (!cancelled && data.status === 'success' && Array.isArray(data.data)) {
          setEvents(data.data.map(toCard));
        }
      } catch {
        // keep mock
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    let list = events.filter((ev) => {
      const matchSearch =
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = category === 'All' || ev.category === category;
      const matchStatus = status === 'All' || ev.status.includes(status);
      const matchNetwork = network === 'All' || ev.network === network;
      return matchSearch && matchCategory && matchStatus && matchNetwork;
    });

    if (sort === 'Low to High') list = [...list].sort((a, b) => parsePrice(a.cryptoPrice) - parsePrice(b.cryptoPrice));
    else if (sort === 'High to Low') list = [...list].sort((a, b) => parsePrice(b.cryptoPrice) - parsePrice(a.cryptoPrice));
    else list = [...list].sort((a, b) => b.supply.minted - a.supply.minted);

    return list;
  }, [events, searchQuery, category, status, network, sort]);

  const trendingEvents = events.filter((ev) => ev.trending);
  const PAGE_SIZE = 6;
  useEffect(() => {
    setPage(1);
  }, [searchQuery, category, status, network, sort]);
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <main className="bp-page">
      <div className="bp-bg-layer" aria-hidden>
        <DotMatrixBackground hue={0.55} opacity={0.4} speed={1} />
      </div>
      <div className="bp-content">
        <Navbar />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '110px 24px 40px' }}>
          <Link href="/" className="bp-mono" style={{ color: 'var(--bp-muted)', textDecoration: 'none', fontSize: 11 }}>
            ← Back to Home
          </Link>

          <div style={{ margin: '28px 0 40px' }}>
            <div className="bp-mono" style={{ color: 'var(--bp-neon)', fontSize: 11, letterSpacing: '0.28em', marginBottom: 14 }}>
              TRENDING & FEATURED{loading && events.length === 0 ? ' · LOADING' : ''}
            </div>
            <div className="bp-grid-3">
              {trendingEvents.map((ev) => (
                <Link key={`trend-${ev.id}`} href={`/event/${ev.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="bp-glass" style={{ padding: 18, overflow: 'hidden' }}>
                    <SceneFrame height={110} style={{ marginBottom: 12 }}>
                      <FluxVortex mode="dark" speed={1} />
                    </SceneFrame>
                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px' }}>{ev.title}</h3>
                    <p className="bp-mono" style={{ fontSize: 10, color: 'var(--bp-neon)', margin: 0 }}>
                      {ev.cryptoPrice} • {ev.network}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bp-glass" style={{ padding: 20, marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input
              className="bp-input"
              placeholder="Search events, organizers, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="bp-grid-2" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
              <select className="bp-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="Web3">Web3</option>
                <option value="Sports/Race">Sports/Race</option>
                <option value="Music">Music</option>
                <option value="Conference">Conference</option>
              </select>
              <select className="bp-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Live Minting">Live Minting</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Sold Out">Sold Out</option>
                <option value="Ended">Ended</option>
              </select>
              <select className="bp-select" value={network} onChange={(e) => setNetwork(e.target.value)}>
                <option value="All">All Networks</option>
                <option value="Ethereum">Ethereum</option>
                <option value="Base">Base</option>
              </select>
              <select className="bp-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="Most Popular">Most Popular</option>
                <option value="Low to High">Price: Low to High</option>
                <option value="High to Low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading && events.length === 0 ? (
            <div style={{ display: 'grid', placeItems: 'center', padding: 60 }}>
              <UplinkLoader style={{ width: 160, height: 160 }} />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {paginatedEvents.map((ev) => (
                <Link key={ev.id} href={`/event/${ev.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="bp-glass" style={{ overflow: 'hidden' }}>
                    <div style={{ height: 160, padding: 18, position: 'relative', background: ev.bg }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="bp-mono" style={{ fontSize: 9, border: '1px solid var(--bp-border)', padding: '4px 8px' }}>
                          {ev.rarity}
                        </span>
                        <span className="bp-mono" style={{ fontSize: 10, background: 'rgba(255,255,255,0.08)', padding: '4px 8px', borderRadius: 6 }}>
                          {ev.network}
                        </span>
                      </div>
                      <div className="bp-mono" style={{ position: 'absolute', bottom: 18, left: 18, color: 'var(--bp-neon)', fontWeight: 800, fontSize: 12 }}>
                        ● {ev.status}
                      </div>
                    </div>
                    <div style={{ padding: 22 }}>
                      <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>{ev.title}</h3>
                      <div className="bp-mono" style={{ fontSize: 10, color: 'var(--bp-muted)', marginBottom: 14 }}>
                        by {ev.organizer}
                      </div>
                      <div className="bp-mono" style={{ fontSize: 11, color: 'var(--bp-text)', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span>{ev.date}</span>
                        <span>{ev.location}</span>
                      </div>
                      <div style={{ marginBottom: 18 }}>
                        <div className="bp-mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--bp-muted)', marginBottom: 8 }}>
                          <span>Minted</span>
                          <span>
                            {ev.supply.minted} / {ev.supply.total}
                          </span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${ev.supply.total ? (ev.supply.minted / ev.supply.total) * 100 : 0}%`,
                              background: 'var(--bp-neon)',
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--bp-border)', paddingTop: 16 }}>
                        <div>
                          <div className="bp-mono" style={{ color: 'var(--bp-neon)', fontWeight: 800, fontSize: 16 }}>
                            {ev.cryptoPrice}
                          </div>
                          <div className="bp-mono" style={{ color: 'var(--bp-muted)', fontSize: 10 }}>
                            {ev.fiatPrice}
                          </div>
                        </div>
                        <span className="bp-btn" style={{ padding: '10px 14px' }}>
                          {ev.action}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 36, flexWrap: 'wrap' }}>
              <button className="bp-btn" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={`bp-btn ${p === currentPage ? 'bp-btn-solid' : ''}`} onClick={() => setPage(p)}>
                  {p}
                </button>
              ))}
              <button className="bp-btn" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>
                Next →
              </button>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </main>
  );
}
