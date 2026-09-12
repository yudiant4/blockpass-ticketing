'use client';

import { useState, useEffect } from 'react';
import { css } from 'styled-system/css';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Calendar, MapPin, Users, Clock, CheckCircle, XCircle, Shield } from 'lucide-react';
import TierCard from '@/components/TierCard';

interface Tier {
  tierId: string;
  tierName: string;
  price: number;
  quota: number;
  sold: number;
  maxPerWallet: number;
  perks: string[];
  customFields: string[];
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
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/events/${params.id}`)
      .then(r => r.json())
      .then(d => {
        if (d.status === 'success') setEvent(d.data);
        else setError(d.message || 'Event not found');
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <main className={css({ minHeight: '100vh', bg: 'gray.900', display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
      <p className={css({ fontFamily: 'mono', color: 'neon', textTransform: 'uppercase', letterSpacing: '0.15em' })}>LOADING...</p>
    </main>
  );

  if (error || !event) return (
    <main className={css({ minHeight: '100vh', bg: 'gray.900', display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
      <p className={css({ fontFamily: 'mono', color: 'red.400', textTransform: 'uppercase' })}>{error || 'EVENT NOT FOUND'}</p>
    </main>
  );

  const isEnded = event.status === 'Ended' || new Date(event.endDate) < new Date();
  const isLive = !isEnded && new Date(event.startDate) <= new Date();
  const eventDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <main className={css({ minHeight: '100vh', bg: 'gray.900' })}>
      {/* Hero Banner */}
      <div className={css({ position: 'relative', w: 'full', h: '300px', overflow: 'hidden' })}>
        {event.bannerUrl ? (
          <img src={event.bannerUrl} alt={event.title}
            className={css({ w: 'full', h: 'full', objectFit: 'cover' })} />
        ) : (
          <div className={css({ w: 'full', h: 'full', bg: 'gray.800' })} />
        )}
        {/* Gradient overlay */}
        <div className={css({
          position: 'absolute', bottom: 0, left: 0, right: 0, h: '50%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)',
        })} />
        {/* Status badge */}
        <div className={css({ position: 'absolute', top: '4', left: '4', display: 'flex', gap: '2' })}>
          <span className={css({
            fontFamily: 'mono', fontSize: 'xs', textTransform: 'uppercase', letterSpacing: '0.1em',
            px: '3', py: '1', rounded: 'md', fontWeight: 'bold',
            bg: isEnded ? 'gray.700' : isLive ? 'emerald.600' : 'neon',
            color: isEnded ? 'gray.400' : isLive ? 'white' : 'black',
          })}>
            {isEnded ? 'ENDED' : isLive ? 'LIVE NOW' : 'UPCOMING'}
          </span>
          <span className={css({
            fontFamily: 'mono', fontSize: 'xs', textTransform: 'uppercase', letterSpacing: '0.1em',
            px: '3', py: '1', rounded: 'md', fontWeight: 'bold',
            bg: 'rgba(0,0,0,0.6)', color: 'neon', border: '1px solid rgba(0,245,196,0.3)',
          })}>
            {event.category}
          </span>
        </div>
      </div>

      <div className={css({ maxW: '5xl', mx: 'auto', px: '4', mt: '-16', position: 'relative', zIndex: 10 })}>
        {/* Event Info Card */}
        <div className={css({
          bg: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)', rounded: 'lg', p: '6', mb: '8',
        })}>
          <h1 className={css({ fontSize: '3xl', fontWeight: 'bold', color: 'white', mb: '2' })}>{event.title}</h1>
          <p className={css({ color: 'gray.400', mb: '6', lineHeight: 'relaxed' })}>{event.description}</p>

          {/* Metadata row */}
          <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '6' })}>
            <div className={css({ display: 'flex', alignItems: 'center', gap: '2' })}>
              <Calendar size={16} className={css({ color: 'neon' })} />
              <span className={css({ fontFamily: 'mono', fontSize: 'sm', color: 'gray.300' })}>
                {formatDate(eventDate)} - {formatDate(endDate)}
              </span>
            </div>
            <div className={css({ display: 'flex', alignItems: 'center', gap: '2' })}>
              <Clock size={16} className={css({ color: 'neon' })} />
              <span className={css({ fontFamily: 'mono', fontSize: 'sm', color: 'gray.300' })}>
                {formatTime(eventDate)} - {formatTime(endDate)}
              </span>
            </div>
            <div className={css({ display: 'flex', alignItems: 'center', gap: '2' })}>
              <MapPin size={16} className={css({ color: 'neon' })} />
              <span className={css({ fontFamily: 'mono', fontSize: 'sm', color: 'gray.300' })}>{event.location}</span>
            </div>
          </div>

          {/* Organizer */}
          <div className={css({ display: 'flex', alignItems: 'center', gap: '2', mt: '4' })}>
            <Shield size={14} className={css({ color: 'gray.500' })} />
            <span className={css({ fontFamily: 'mono', fontSize: 'xs', color: 'gray.500' })}>
              ORGANIZER: {event.createdBy?.slice(0, 6)}...{event.createdBy?.slice(-4)}
            </span>
          </div>
        </div>

        {/* Tier Cards Grid */}
        <div className={css({ mb: '8' })}>
          <div className={css({ display: 'flex', alignItems: 'center', gap: '3', mb: '6' })}>
            <div className={css({ w: '2', h: '8', bg: 'neon' })} />
            <h2 className={css({ fontFamily: 'mono', fontSize: 'lg', fontWeight: '700', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em' })}>
              AVAILABLE TIERS
            </h2>
          </div>
          <div className={css({ display: 'grid', gridTemplateColumns: { base: '1fr', md: 'repeat(auto-fit, minmax(280px, 1fr))' }, gap: '4' })}>
            {event.tiers.map((tier) => (
              <TierCard
                key={tier.tierId}
                tier={tier}
                eventId={event._id}
                isEnded={isEnded}
                walletAddress={address}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}