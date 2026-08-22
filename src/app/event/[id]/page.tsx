'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { css } from '../../styled-system/css';
import dynamic from 'next/dynamic';
import { getEventById } from '../../lib/events';

const EventDayTicket = dynamic(() => import('../../components/EventDayTicket'), {
  ssr: false,
  loading: () => (
    <div className={css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '64',
      color: 'cyan',
      fontFamily: 'mono',
      fontSize: 'xs',
      textTransform: 'uppercase',
      letterSpacing: 'widest',
    })}>
      {'// Loading Gate...'}
    </div>
  ),
});

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.id ? parseInt(params.id as string, 10) : 1;
  const event = getEventById(eventId);

  if (!event) {
    return (
      <main className={css({ minHeight: '100vh', bg: 'bg', color: 'text' })}>
        <div className={css({ textAlign: 'center', py: '20' })}>
          <h2 className={css({ fontSize: '2xl', fontWeight: 'bold', textTransform: 'uppercase', color: 'text' })}>
            Event Not Found
          </h2>
          <p className={css({ mt: '4', color: 'text', fontFamily: 'mono' })}>
            Event with ID {eventId} does not exist.
          </p>
          <Link href="/" className={css({ display: 'inline-block', mt: '6', px: '4', py: '2', bg: 'cyan', color: 'bg', fontFamily: 'mono', fontSize: 'xs', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 'widest', borderRadius: 'lg' })}>
            {'← Back to Marketplace'}
          </Link>
        </div>
      </main>
    );
  }

  const [selectedTier, setSelectedTier] = useState(0);
  const [mintHash, setMintHash] = useState<string | null>(null);

  const tierData = event.tiers[selectedTier];

  return (
    <main className={css({ minHeight: '100vh', bg: 'bg', color: 'text', position: 'relative', overflow: 'hidden', pt: '100px', pb: '120px' })}
      style={{
        backgroundImage:
          'linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      {/* Animated background orbs */}
      <div className={css({ position: 'absolute', inset: '0', overflow: 'hidden', pointerEvents: 'none' })}>
        <div className={css({ position: 'absolute', top: '-40', right: '-40', width: '80', height: '80', bg: 'cyan.500/10', borderRadius: 'full', filter: 'blur(3xl)', animation: 'pulseBlob 4s infinite' })} />
        <div className={css({ position: 'absolute', bottom: '-40', left: '-40', width: '80', height: '80', bg: 'emerald.500/10', borderRadius: 'full', filter: 'blur(3xl)', animation: 'pulseBlob 5s infinite 1s' })} />
        <div className={css({ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '96', height: '96', bg: 'amber.500/5', borderRadius: 'full', filter: 'blur(3xl)', animation: 'pulseBlob 6s infinite 2s' })} />
      </div>

      <div className={css({ position: 'relative', zIndex: '10', maxWidth: '4xl', mx: 'auto', px: '4', py: '24' })}>
        {/* Header */}
        <div className={css({ mb: '8', textAlign: 'center' })}>
          <div className={css({
            display: 'inline-block',
            px: '3',
            py: '1',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'border',
            borderRadius: 'md',
            fontFamily: 'mono',
            fontSize: 'xs',
            textTransform: 'uppercase',
            letterSpacing: 'widest',
            color: 'cyan',
            mb: '4',
          })}>
            {`Event #${event.id} • NFT Ticketing`}
          </div>
          <h1 className={css({
            fontSize: { base: '3xl', md: '4xl' },
            fontWeight: 'bold',
            textTransform: 'uppercase',
            color: 'text',
            letterSpacing: 'wide',
          })}>
            {event.title}
          </h1>
          <p className={css({
            mt: '3',
            fontSize: 'sm',
            color: 'text',
            fontFamily: 'mono',
          })}>
            {event.location} • <span className={css({ color: event.statusColor })}>{event.date}</span>
          </p>
          <p className={css({ mt: '2', fontSize: 'sm', color: 'text', fontFamily: 'mono' })}>
            {event.description}
          </p>
        </div>

        {/* Tier Selection */}
        <div className={css({ mb: '8' })}>
          <h2 className={css({ fontSize: 'xl', fontWeight: 'bold', textTransform: 'uppercase', color: 'text', mb: '1' })}>
            Select Your Tier
          </h2>
          <p className={css({ fontSize: 'xs', color: 'text', fontFamily: 'mono', mb: '6' })}>
            {'// Pilih tier & selesaikan transaksi untuk membuka Event Day Gate Pass'}
          </p>

          <div className={css({ display: 'grid', gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' }, gap: '4', mb: '6' })}>
            {event.tiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(event.tiers.indexOf(tier))}
                className={css({
                  position: 'relative',
                  p: '4',
                  borderRadius: 'xl',
                  textAlign: 'left',
                  transition: 'all 300ms',
                  bg: 'card/60',
                  backdropFilter: 'blur(20px)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: selectedTier === event.tiers.indexOf(tier) ? tier.border : 'border',
                  boxShadow: selectedTier === event.tiers.indexOf(tier) ? tier.glow : 'none',
                  transform: selectedTier === event.tiers.indexOf(tier) ? 'scale(1.02)' : 'scale(1)',
                  _hover: {
                    borderColor: 'cyan.500/60',
                    transform: 'scale(1.02)',
                  },
                })}
              >
                {/* Tier accent bar */}
                <div className={css({
                  position: 'absolute',
                  left: '0',
                  top: '0',
                  bottom: '0',
                  width: '1',
                  bg: 'gradient-to-b from-cyan.500 via-emerald.500 to-amber.500',
                })} />

                <div className={css({
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: '2',
                })}>
                  <span className={css({
                    fontFamily: 'mono',
                    fontSize: 'xs',
                    textTransform: 'uppercase',
                    letterSpacing: 'widest',
                    px: '2',
                    py: '0.5',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: tier.border,
                    color: tier.badgeText,
                    bg: tier.badgeBg,
                    borderRadius: 'md',
                  })}>
                    {`${tier.name} PASS`}
                  </span>
                  <span className={css({
                    fontFamily: 'mono',
                    fontSize: 'xs',
                    color: 'emerald',
                    textTransform: 'uppercase',
                  })}>
                    {tier.network}
                  </span>
                </div>
                <div className={css({
                  fontSize: '2xl',
                  fontWeight: 'bold',
                  fontFamily: 'mono',
                  color: 'text',
                })}>
                  {tier.price}
                </div>
                <div className={css({
                  mt: '1',
                  fontSize: 'xs',
                  color: 'text',
                  fontFamily: 'mono',
                })}>
                  {`≈ Rp ${event.id === 1 ? '50.000' : event.id === 2 ? '100.000' : event.id === 3 ? '250.000' : event.id === 4 ? '500.000' : '50.000'}`}
                </div>
              </button>
            ))}
          </div>

          <button className={css({
            width: 'full',
            py: '3',
            px: '6',
            bg: 'cyan',
            color: 'bg',
            fontFamily: 'mono',
            fontSize: 'xs',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 'wider',
            borderRadius: 'lg',
            cursor: 'pointer',
            border: 'none',
            transition: 'all 200ms',
            boxShadow: 'shadow.cyan.500/30',
            _hover: {
              bg: 'cyan.400',
              boxShadow: 'shadow.cyan.500/40',
            },
          })}>
            {'> MINT TIKET SEKARANG'}
          </button>

          <div className={css({
            mt: '4',
            p: '3',
            bg: 'card/60',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'border',
            borderRadius: 'lg',
            fontFamily: 'mono',
            fontSize: 'xs',
            color: 'text',
          })}>
            <span className={css({ color: 'cyan' })}>{'// STATUS:'}</span>
            {' Wallet belum terhubung. Klik '}
            <span className={css({ color: 'cyan' })}>{'"Connect Wallet"'}</span>
            {' di header untuk mulai mint.'}
          </div>
        </div>

        {/* Event Day Ticket Component */}
        <EventDayTicket
          tokenId={tierData.id}
          contractAddress="0xbdb5f9745Db186C25424fA0EC5b81009980B87c2"
          ownerAddress="0x8fc179213fb33f2bf61c8abae3d2a469e9f167b9"
          tier={tierData.name}
          tierData={tierData}
          perks={tierData.benefits}
          status="UNUSED"
        />

        {/* Footer */}
        <div className={css({ mt: '10', textAlign: 'center' })}>
          <Link
            href="/marketplace"
            className={css({
              display: 'inline-block',
              fontFamily: 'mono',
              fontSize: 'xs',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              color: 'text',
              transition: 'all 200ms',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'border',
              px: '4',
              py: '2',
              borderRadius: 'md',
              textDecoration: 'none',
              _hover: {
                borderColor: 'cyan',
                color: 'cyan',
              },
            })}
          >
            {'< KEMBALI KE MARKETPLACE'}
          </Link>
        </div>
      </div>
    </main>
  );
}