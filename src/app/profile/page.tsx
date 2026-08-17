'use client';

import { css } from '../../../styled-system/css';

const myTickets = [
    {
        id: 1,
        eventName: 'ALAS TRAIL RUN 2026',
        category: '42K ULTRA MARATHON',
        date: 'Aug 15, 2026',
        status: 'Active',
        tokenId: '#1088',
        bg: 'linear-gradient(135deg, #0a2010 0%, #0f3d2e 100%)',
        borderColor: 'neon',
        btnText: 'View QR Code',
        isActive: true,
    },
    {
        id: 2,
        eventName: 'RINJANI NATIONAL PARK',
        category: 'SUMMIT EXPEDITION PASS',
        date: 'Sep 10, 2026',
        status: 'Upcoming',
        tokenId: '#0422',
        bg: 'linear-gradient(135deg, #2d0f1a 0%, #1a0f2e 100%)',
        borderColor: 'neon3',
        btnText: 'Transfer Ticket',
        isActive: true,
    },
    {
        id: 3,
        eventName: 'GUNUNG SUMBING',
        category: 'TEKTOK TRIP',
        date: 'May 12, 2026',
        status: 'Used / POAP',
        tokenId: '#0055',
        bg: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
        borderColor: 'muted',
        btnText: 'View on Explorer',
        isActive: false,
    },
];

export default function ProfilePage() {
    return (
        <main className={css({ minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' })}>
            <div className={css({ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' })}>

                {/* User Profile Header */}
                <div className={css({
                    background: 'surface',
                    border: '1px solid token(colors.border)',
                    padding: '40px',
                    marginBottom: '40px',
                    display: 'flex',
                    flexDirection: { base: 'column', md: 'row' },
                    alignItems: { base: 'flex-start', md: 'center' },
                    justifyContent: 'space-between',
                    gap: '24px'
                })}>
                    <div className={css({ display: 'flex', alignItems: 'center', gap: '24px' })}>
                        <div className={css({
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, token(colors.neon), token(colors.neon2))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'mono',
                            fontSize: '24px',
                            fontWeight: '800',
                            color: 'bg'
                        })}>
                            0x
                        </div>
                        <div>
                            <div className={css({ fontFamily: 'mono', fontSize: '11px', color: 'neon', letterSpacing: '0.2em', marginBottom: '8px' })}>
                                CONNECTED WALLET
                            </div>
                            <h1 className={css({ fontSize: '28px', fontWeight: '800', fontFamily: 'mono' })}>
                                0x4B2...9c1A
                            </h1>
                        </div>
                    </div>

                    <div className={css({ display: 'flex', gap: '32px' })}>
                        <div>
                            <div className={css({ fontFamily: 'mono', fontSize: '11px', color: 'muted', textTransform: 'uppercase', marginBottom: '4px' })}>Total Tickets</div>
                            <div className={css({ fontSize: '24px', fontWeight: '800', color: 'text' })}>3</div>
                        </div>
                        <div>
                            <div className={css({ fontFamily: 'mono', fontSize: '11px', color: 'muted', textTransform: 'uppercase', marginBottom: '4px' })}>Est. Value</div>
                            <div className={css({ fontSize: '24px', fontWeight: '800', color: 'neon' })}>0.40 ETH</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className={css({ display: 'flex', gap: '32px', borderBottom: '1px solid token(colors.border)', marginBottom: '40px' })}>
                    {['Collected Tickets', 'Past Events (POAP)', 'Listed For Sale'].map((tab, idx) => (
                        <button key={tab} className={css({
                            background: 'transparent',
                            border: 'none',
                            padding: '0 0 16px 0',
                            fontFamily: 'mono',
                            fontSize: '13px',
                            textTransform: 'uppercase',
                            color: idx === 0 ? 'neon' : 'muted',
                            borderBottom: idx === 0 ? '2px solid token(colors.neon)' : '2px solid transparent',
                            cursor: 'pointer',
                            transition: 'color 0.2s',
                            _hover: { color: 'neon' }
                        })}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Owned Tickets Grid */}
                <div className={css({ display: 'grid', gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: '24px' })}>
                    {myTickets.map((ticket) => (
                        <div key={ticket.id} className={css({
                            background: 'card',
                            border: '1px solid token(colors.border)',
                            opacity: ticket.isActive ? 1 : 0.6,
                            transition: 'transform 0.3s, border-color 0.3s',
                            _hover: { transform: 'translateY(-4px)', borderColor: ticket.borderColor }
                        })}>

                            <div className={css({ height: '160px', padding: '20px', position: 'relative' })} style={{ background: ticket.bg }}>
                                <span className={css({
                                    position: 'absolute', top: '20px', right: '20px',
                                    padding: '4px 8px', background: 'rgba(0,0,0,0.8)',
                                    border: `1px solid token(colors.${ticket.borderColor})`,
                                    color: `token(colors.${ticket.borderColor})`,
                                    fontFamily: 'mono', fontSize: '9px', textTransform: 'uppercase'
                                })}>
                                    {ticket.status}
                                </span>
                                <div className={css({ position: 'absolute', bottom: '20px', left: '20px', fontFamily: 'mono', fontSize: '14px', fontWeight: '800', color: 'white' })}>
                                    {ticket.tokenId}
                                </div>
                            </div>

                            <div className={css({ padding: '24px' })}>
                                <div className={css({ fontFamily: 'mono', fontSize: '10px', color: 'muted', letterSpacing: '0.1em', marginBottom: '8px' })}>
                                    {ticket.category}
                                </div>
                                <h3 className={css({ fontSize: '18px', fontWeight: '700', marginBottom: '16px' })}>{ticket.eventName}</h3>

                                <div className={css({ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'mono', fontSize: '11px', color: 'muted', marginBottom: '24px' })}>
                                    <span>📅</span> {ticket.date}
                                </div>

                                <a href={ticket.isActive ? "/event" : "#"} className={css({
                                    display: 'block', textAlign: 'center', width: '100%', padding: '12px',
                                    background: 'transparent', color: ticket.isActive ? 'neon' : 'muted',
                                    border: `1px solid ${ticket.isActive ? 'token(colors.neon)' : 'token(colors.border)'}`,
                                    fontFamily: 'mono', fontSize: '11px', textTransform: 'uppercase', textDecoration: 'none',
                                    transition: 'background 0.2s',
                                    _hover: ticket.isActive ? { background: 'rgba(0,245,196,0.1)' } : {}
                                })}>
                                    {ticket.btnText}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </main>
    );
}