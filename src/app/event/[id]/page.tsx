import { css } from 'styled-system/css';
import { getTimeRemaining, isEventDay, isPostEvent, tierLabel, tierPriceETH } from '@/lib/events';
import EventDayTicket from '@/components/EventDayTicket';
import TierCard from '@/components/TierCard';

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

const tierMap = { 1: 'regular', 2: 'vip', 3: 'vvip' } as const;

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const timeRemaining = getTimeRemaining(event.date);
  const eventDayStatus = {
    isEventDay: isEventDay(event.date, '10:00', '18:00'),
    isPostEvent: isPostEvent(event.date),
  };

  const handleValid = (w: string) => console.log('Valid:', w);
  const handleInvalid = (r: string) => console.log('Invalid:', r);

  return (
    <div className={css({ p: '4', maxW: 'container.md', mx: 'auto' })}>
      <div className={css({ background: 'surface', borderRadius: 'xl', p: '6', mb: '6', border: '1px solid', borderColor: 'border' })}>
        <h1 className={css({ color: 'text', fontSize: '2xl', mb: '2' })}>{event.title}</h1>
        <p className={css({ color: 'muted', mb: '4' })}>{event.description}</p>

        {!eventDayStatus.isEventDay && !eventDayStatus.isPostEvent && (
          <div className={css({ display: 'flex', gap: '4', flexWrap: 'wrap', p: '3', bg: 'card', borderRadius: 'md' })}>
            {[['Hari', timeRemaining.days], ['Jam', timeRemaining.hours], ['Menit', timeRemaining.minutes]].map(([label, val]) => (
              <div key={label as string} className={css({ textAlign: 'center' })}>
                <p className={css({ color: 'text' })}>{label}</p>
                <p className={css({ fontSize: 'xl', color: 'neon' })}>{val}</p>
              </div>
            ))}
          </div>
        )}

        {eventDayStatus.isEventDay && (
          <div className={css({ display: 'flex', alignItems: 'center', gap: '2', p: '3', bg: 'emerald', borderRadius: 'md', color: 'white', mb: '4' })}>
            <span>Acara sedang berlangsung - Siapkan QR Code tiket Anda</span>
          </div>
        )}

        {eventDayStatus.isPostEvent && (
          <div className={css({ p: '3', bg: 'muted', borderRadius: 'md', color: 'text', mb: '4' })}>Acara telah berakhir.</div>
        )}
      </div>

      <div className={css({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4', mb: '6' })}>
        {[1, 2, 3].map(id => {
          const k = tierMap[id as 1 | 2 | 3];
          return (
            <TierCard key={id} tierId={id} label={tierLabel(id)} price={tierPriceETH(id)}
              maxSupply={event.tierPricing[k].supply} sold={event.tierPricing[k].sold} isActiveMinting={event.isActive} />
          );
        })}
      </div>

      {eventDayStatus.isEventDay && <EventDayTicket eventId={event.id} expectedTokenId={1} onValid={handleValid} onInvalid={handleInvalid} />}
    </div>
  );
}