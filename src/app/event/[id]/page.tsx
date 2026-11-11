'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Calendar, Clock, MapPin, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TierCard from '@/components/TierCard';
import { apiUrl } from '@/lib/api';
import { EmeraldHorizon, SceneFrame, UplinkLoader } from '@/components/three/ClientScenes';

interface Tier {
  tierId: string;
  tierName: string;
  price: number;
  quota: number;
  sold: number;
  maxPerWallet: number;
  perks: string[];
  customFields: string[];
  onChainTierId?: number;
}

interface EventData {
  _id: string;
  title: string;
  slug: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  bannerUrl: string;
  description: string;
  createdBy: string;
  status: string;
  tiers: Tier[];
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { address } = useAccount();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);

    fetch(apiUrl(`/api/events/${params.id}`), { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.status === 'success') setEvent(d.data);
        else setError(d.message || 'Event not found');
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.name === 'AbortError' ? 'Request timed out' : e.message);
      })
      .finally(() => {
        clearTimeout(timer);
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [params.id]);

  if (loading) {
    return (
      <main className="bp-page" style={{ display: 'grid', placeItems: 'center' }}>
        <Navbar />
        <UplinkLoader style={{ width: 180, height: 180 }} />
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="bp-page" style={{ display: 'grid', placeItems: 'center' }}>
        <Navbar />
        <p className="bp-mono" style={{ color: 'var(--bp-neon3)' }}>
          {error || 'EVENT NOT FOUND'}
        </p>
      </main>
    );
  }

  const isEnded = event.status === 'Ended' || new Date(event.endDate) < new Date();
  const isLive = !isEnded && new Date(event.startDate) <= new Date();
  const eventDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <main className="bp-page">
      <Navbar />
      <div className="bp-content">
        <SceneFrame height={280} style={{ borderRadius: 0, marginTop: 72 }}>
          {event.bannerUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.bannerUrl} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <EmeraldHorizon speed={1} glow={1.1} hue={0.12} />
          )}
        </SceneFrame>

        <div style={{ maxWidth: 1000, margin: '-48px auto 40px', padding: '0 24px', position: 'relative', zIndex: 3 }}>
          <div className="bp-glass" style={{ padding: 28, marginBottom: 28 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              <span className="bp-mono" style={{ fontSize: 10, padding: '4px 10px', borderRadius: 8, background: isEnded ? '#333' : isLive ? '#059669' : 'var(--bp-neon)', color: isEnded ? '#aaa' : isLive ? '#fff' : '#04110d', fontWeight: 700 }}>
                {isEnded ? 'ENDED' : isLive ? 'LIVE NOW' : 'UPCOMING'}
              </span>
              <span className="bp-mono" style={{ fontSize: 10, padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(0,245,196,0.35)', color: 'var(--bp-neon)' }}>
                {event.category}
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, margin: '0 0 10px' }}>{event.title}</h1>
            <p style={{ color: 'var(--bp-muted)', lineHeight: 1.7, marginBottom: 20 }}>{event.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Calendar size={16} color="var(--bp-neon)" />
                <span className="bp-mono" style={{ fontSize: 12 }}>
                  {formatDate(eventDate)} - {formatDate(endDate)}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Clock size={16} color="var(--bp-neon)" />
                <span className="bp-mono" style={{ fontSize: 12 }}>
                  {formatTime(eventDate)} - {formatTime(endDate)}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <MapPin size={16} color="var(--bp-neon)" />
                <span className="bp-mono" style={{ fontSize: 12 }}>
                  {event.location}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 14 }}>
              <Shield size={14} color="var(--bp-muted)" />
              <span className="bp-mono" style={{ fontSize: 11, color: 'var(--bp-muted)' }}>
                ORGANIZER: {event.createdBy?.slice(0, 6)}...{event.createdBy?.slice(-4)}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h2 className="bp-mono" style={{ fontSize: 16, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 }}>
              Available Tiers
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {event.tiers.map((tier) => (
                <TierCard key={tier.tierId} tier={tier} eventId={event._id} isEnded={isEnded} walletAddress={address} />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}
