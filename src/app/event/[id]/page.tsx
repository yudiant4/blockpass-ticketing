import { css } from '../../../styled-system/css';
import { getTimeRemaining, isEventDay, isPostEvent, tierLabel, tierPriceETH, TIER_LABELS } from '../../../lib/events';
import EventDayTicket from '../../components/EventDayTicket';
import { getUserBalance } from '../../../lib/blockpass';
import { createPublicClient } from 'viem';
import { BASE_SEPOLIA, BLOCKPASS_TICKET_ADDRESS, BLOCKPASS_TICKET_ABI } from '../../../config/contracts';

// Mock event data - in production, fetch from API
const event = {
  id: '1',
  title: 'Web3 Dev Connect',
  description: 'Conference untuk pengembang Web3 dengan workshop, panel diskusi, dan networking.',
  date: new Date('2025-01-20T10:00:00+07:00'),
  time: '10:00 - 18:00',
  location: 'Jl. Sudirman No. 123, Jakarta',
  venue: 'Ballroom A, Hotel Indonesia',
  tierPricing: {
    regular: { price: 0.001, supply: 100, sold: 45 },
    vip: { price: 0.003, supply: 50, sold: 12 },
    vvip: { price: 0.01, supply: 20, sold: 5 },
  },
  isActive: true,
};

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const timeRemaining = getTimeRemaining(event.date);
  const eventDayStatus = {
    isEventDay: isEventDay(event.date, '10:00', '18:00'),
    isPostEvent: isPostEvent(event.date),
  };

  const handleValidTicket = (wallet: string) => {
    console.log('Ticket valid untuk wallet:', wallet);
  };

  const handleInvalidTicket = (reason: string) => {
    console.log('Tiket tidak valid:', reason);
  };

  return (
    <div className={css({ p: '4', maxW: 'container.md', mx: 'auto' })}>
      {/* Event Header */}
      <div className={css({
        background: 'surface',
        borderRadius: 'xl',
        p: '6',
        mb: '6',
        border: '1px solid',
        borderColor: 'border',
      })}>
        <h1 className={css({ color: 'text', fontSize: '2xl', mb: '2' })}>
          {event.title}
        </h1>
        <p className={css({ color: 'muted', mb: '4' })}>
          {event.description}
        </p>
        
        {/* Pre-Event Countdown */}
        {!eventDayStatus.isEventDay && !eventDayStatus.isPostEvent && (
          <div className={css({
            display: 'flex',
            gap: '4',
            flexWrap: 'wrap',
            p: '3',
            bg: 'card',
            borderRadius: 'md',
          ))}>
            <div className={css({ textAlign: 'center' })}>
              <p className={css({ color: 'text' })}>Hari</p>
              <p className={css({ fontSize: 'xl', color: 'neon' })}>{timeRemaining.days}</p>
            </div>
            <div className={css({ textAlign: 'center' })}>
              <p className={css({ color: 'text' })}>Jam</p>
              <p className={css({ fontSize: 'xl', color: 'neon' })}>{timeRemaining.hours}</p>
            </div>
            <div className={css({ textAlign: 'center' })}>
              <p className={css({ color: 'text' })}>Menit</p>
              <p className={css({ fontSize: 'xl', color: 'neon' })}>{timeRemaining.minutes}</p>
            </div>
          </div>
        )}

        {/* Event Day Status */}
        {eventDayStatus.isEventDay && (
          <div className={css({
            display: 'flex',
            alignItems: 'center',
            gap: '2',
            p: '3',
            bg: 'emerald',
            borderRadius: 'md',
            color: 'white',
            mb: '4',
          ))}>
            <div className={css({
              w: '2',
              h: '2',
              borderRadius: 'full',
              bg: 'white',
              animation: 'pulseBlob 1s infinite',
            })}></div>
            <span>Acara sedang berlangsung - Siapkan QR Code tiket Anda</span>
          </div>
        )}

        {/* Post-Event Status */}
        {eventDayStatus.isPostEvent && (
          <div className={css({
            p: '3',
            bg: 'muted',
            borderRadius: 'md',
            color: 'text',
            mb: '4',
          ))}>
            Acara telah berakhir. Terima kasih sudah hadir!
          </div>
        )}
      </div>

      {/* Ticket Tiers */}
      <div className={css({
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '4',
        mb: '6',
      })}>
        {[1, 2, 3].map(tierId => (
          <TierCard 
            key={tierId}
            tierId={tierId}
            label={tierLabel(tierId)}
            price={tierPriceETH(tierId)}
            maxSupply={event.tierPricing[tierId as 1 | 2 | 3].supply}
            sold={event.tierPricing[tierId as 1 | 2 | 3].sold}
            isActiveMinting={event.isActive}
          />
        ))}
      </div>

      {/* Event Day QR Scanner */}
      {eventDayStatus.isEventDay && (
        <EventDayTicket
          eventId={event.id}
          expectedTokenId={1}
          onValid={handleValidTicket}
          onInvalid={handleInvalidTicket}
        />
      )}
    </div>
  );
}

// Tier Card Component
function TierCard({ 
  tierId, 
  label, 
  price, 
  maxSupply, 
  sold,
  isActiveMinting,
}: { 
  tierId: number;
  label: string;
  price: string;
  maxSupply: number;
  sold: number;
  isActiveMinting: boolean;
}) {
  return (
    <div className={css({
      p: '4',
      bg: 'surface',
      borderRadius: 'xl',
      border: '1px solid',
      borderColor: 'border',
    })}>
      <div className={css({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: '2',
      ))}>
        <h3 className={css({ color: 'text', fontSize: 'lg' })}>{label}</h3>
        <span className={css({
          px: '2',
          py: '1',
          borderRadius: 'md',
          font size: 'sm',
          fontWeight: 'bold',
          color: 'white',
          bg: tierId === 1 ? 'emerald' : tierId === 2 ? 'cyan' : 'purple',
        }))}>₺{price}</h3>
      </div>
      <p className={css({ color: 'muted', mb: '3' })}>
        Tersisa: {maxSupply - sold} / {maxSupply}
      </p>
      <button 
        disabled={!isActiveMinting || sold >= maxSupply}
        className={css({
          w: 'full',
          py: '2',
          borderRadius: 'md',
          bg: sold >= maxSupply ? 'muted' : 'neon',
          color: 'black',
          fontWeight: 'bold',
          cursor: sold >= maxSupply ? 'not-allowed' : 'pointer',
          '&:hover': {
            bg: sold >= maxSupply ? 'muted' : 'emerald',
          },
        }))}
      >
        {sold >= maxSupply ? 'HABIS' : `BUY TIKET`}
      </button>
    </div>
  );
}