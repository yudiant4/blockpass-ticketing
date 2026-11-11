import Link from 'next/link';
import { css } from '../../styled-system/css';

const nfts = [
    {
        name: 'VIP PASS',
        event: 'Web3 Dev Connect 2026',
        eventId: 'evt-web3-dev-connect',
        price: '0.003 ETH',
        badge: 'VIP',
        badgeClass: css({ borderColor: 'neon', color: 'neon' }),
        pass: 'VIP PASS',
        passBorder: css({ borderColor: 'neon', color: 'neon', boxShadow: '0 0 20px rgba(0,245,196,0.25)' }),
        bg: 'linear-gradient(135deg, #0d1f2d 0%, #1a2030 100%)',
    },
    {
        name: '42K ULTRA',
        event: 'ALAS TRAIL RUN 2026',
        eventId: 'evt-alas-trail-run',
        price: '0.005 ETH',
        badge: 'VIP Pass',
        badgeClass: css({ borderColor: 'neon', color: 'neon' }),
        pass: '42K ULTRA',
        passBorder: css({ borderColor: 'neon', color: 'neon', boxShadow: '0 0 20px rgba(0,245,196,0.25)' }),
        bg: 'linear-gradient(135deg, #0a2010 0%, #0f3d2e 100%)',
    },
    {
        name: 'VVIP',
        event: 'Web3 Dev Connect 2026',
        eventId: 'evt-web3-dev-connect',
        price: '0.01 ETH',
        badge: 'VVIP',
        badgeClass: css({ borderColor: 'neon3', color: 'neon3' }),
        pass: 'VVIP',
        passBorder: css({ borderColor: 'neon3', color: 'neon3', boxShadow: '0 0 20px rgba(255,61,110,0.25)' }),
        bg: 'linear-gradient(135deg, #1a0d2d 0%, #2d1a30 100%)',
    },
    {
        name: '21K',
        event: 'ALAS TRAIL RUN 2026',
        eventId: 'evt-alas-trail-run',
        price: '0.002 ETH',
        badge: 'Regular',
        badgeClass: css({ borderColor: 'neon2', color: 'neon2' }),
        pass: '21K',
        passBorder: css({ borderColor: 'neon2', color: 'neon2', boxShadow: '0 0 20px rgba(123,47,255,0.25)' }),
        bg: 'linear-gradient(135deg, #0a2010 0%, #1a3020 100%)',
    },
    {
        name: 'REGULAR',
        event: 'Web3 Dev Connect 2026',
        eventId: 'evt-web3-dev-connect',
        price: '0.001 ETH',
        badge: 'Tier 1',
        badgeClass: css({ borderColor: 'neon', color: 'neon' }),
        pass: 'REGULAR',
        passBorder: css({ borderColor: 'neon', color: 'neon' }),
        bg: 'linear-gradient(135deg, #0d1f2d 0%, #1a2030 100%)',
    },
    {
        name: 'VVIP ART',
        event: 'NFT Art Exhibition',
        eventId: 'evt-nft-art-exhibition',
        price: '0.02 ETH',
        badge: 'Sold Out',
        badgeClass: css({ borderColor: 'muted', color: 'muted' }),
        pass: 'VVIP',
        passBorder: css({ borderColor: 'muted', color: 'muted' }),
        bg: 'linear-gradient(135deg, #1a0d0d 0%, #301a1a 100%)',
    },
];

export default function NFTShowcase() {
    return (
        <section
            className={css({
                padding: { base: '60px 20px', md: '100px 60px' },
                position: 'relative',
                zIndex: 1,
                background: 'surface',
                borderTop: '1px solid token(colors.border)',
                borderBottom: '1px solid token(colors.border)',
            })}
        >
            <div
                className={css({
                    fontFamily: 'mono',
                    fontSize: '11px',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: 'neon2',
                    marginBottom: '16px',
                })}
            >
        // Live Marketplace
            </div>
            <h2
                className={css({
                    fontSize: 'clamp(28px, 4vw, 52px)',
                    fontWeight: '800',
                    lineHeight: '1.05',
                    letterSpacing: '-0.02em',
                    marginBottom: '40px',
                })}
            >
                Available Tickets
            </h2>

            <div
                className={css({
                    display: 'grid',
                    gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                    gap: '20px',
                })}
            >
                {nfts.map((nft, i) => (
                    <Link key={i} href={`/event/${nft.eventId}`} className={css({ textDecoration: 'none', color: 'inherit' })}>
                        <div
                            className={css({
                                background: 'card',
                                border: '1px solid token(colors.border)',
                                overflow: 'hidden',
                                transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
                                position: 'relative',
                                cursor: 'pointer',
                                _hover: {
                                    transform: 'translateY(-6px)',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(0,245,196,0.08)',
                                    borderColor: 'rgba(0,245,196,0.25)',
                                },
                            })}
                        >
                            <div
                                className={css({
                                    height: '200px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                })}
                                style={{ background: nft.bg }}
                            >
                                <span
                                    className={` ${nft.badgeClass} ${css({
                                        position: 'absolute',
                                        top: '14px',
                                        left: '14px',
                                        fontFamily: 'mono',
                                        fontSize: '9px',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        padding: '4px 8px',
                                        background: 'rgba(0,0,0,0.7)',
                                        border: '1px solid',
                                    })}`}
                                >
                                    {nft.badge}
                                </span>
                                <div
                                    className={`${nft.passBorder} ${css({
                                        width: '130px',
                                        height: '70px',
                                        border: '1.5px solid',
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontFamily: 'mono',
                                        fontSize: '10px',
                                        fontWeight: '700',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                    })}`}
                                >
                                    {nft.pass}
                                </div>
                            </div>

                            <div className={css({ padding: '20px', borderTop: '1px solid token(colors.border)' })}>
                                <div className={css({ fontSize: '15px', fontWeight: '700', marginBottom: '4px' })}>
                                    {nft.name}
                                </div>
                                <div
                                    className={css({
                                        fontFamily: 'mono',
                                        fontSize: '10px',
                                        color: 'muted',
                                        letterSpacing: '0.08em',
                                        marginBottom: '16px',
                                    })}
                                >
                                    {nft.event}
                                </div>
                                <div
                                    className={css({
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        borderTop: '1px solid token(colors.border)',
                                        paddingTop: '14px',
                                    })}
                                >
                                    <div className={css({ fontFamily: 'mono', fontSize: '13px', fontWeight: '700', color: 'neon' })}>
                                        {nft.price}
                                    </div>
                                    <button
                                        className={css({
                                            fontFamily: 'mono',
                                            fontSize: '10px',
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase',
                                            background: 'transparent',
                                            border: '1px solid token(colors.neon)',
                                            color: 'neon',
                                            padding: '6px 14px',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s',
                                            _hover: { background: 'rgba(0,245,196,0.12)' },
                                        })}
                                    >
                                        Mint Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}