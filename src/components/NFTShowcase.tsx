import Link from 'next/link';
import { css } from '../../styled-system/css';

const nfts = [
    {
        name: 'VIP FLOOR #0042',
        event: 'ELECTRONIC HORIZON FESTIVAL',
        price: '0.015 ETH',
        badge: 'Legendary',
        badgeClass: css({ borderColor: 'neon3', color: 'neon3' }),
        pass: 'VIP PASS',
        passBorder: css({ borderColor: 'neon', color: 'neon', boxShadow: '0 0 20px rgba(0,245,196,0.25)' }),
        bg: 'linear-gradient(135deg, #0d1f2d 0%, #0f3d2e 100%)',
        hasScan: true,
    },
    {
        name: '42K ULTRA #1088',
        event: 'ALAS TRAIL RUN 2026',
        price: '0.005 ETH',
        badge: 'VIP Pass',
        badgeClass: css({ borderColor: 'neon', color: 'neon' }),
        pass: '42K ULTRA',
        passBorder: css({ borderColor: 'neon', color: 'neon', boxShadow: '0 0 20px rgba(0,245,196,0.25)' }),
        bg: 'linear-gradient(135deg, #0a2010 0%, #0f3d2e 100%)',
        hasScan: true,
    },
    {
        name: 'SUMMIT PASS #0422',
        event: 'RINJANI EXPEDITION VIP',
        price: '0.01 ETH',
        badge: 'Legendary',
        badgeClass: css({ borderColor: 'neon3', color: 'neon3' }),
        pass: 'EXPEDITION',
        passBorder: css({ borderColor: 'neon3', color: 'neon3', boxShadow: '0 0 20px rgba(255,61,110,0.25)' }),
        bg: 'linear-gradient(135deg, #2d0f1a 0%, #1a0f2e 100%)',
    },
    {
        name: 'FRONT ROW #0118',
        event: 'NEON CITY RAVE VOL. 3',
        price: '0.006 ETH',
        badge: 'Epic',
        badgeClass: css({ borderColor: 'neon2', color: 'neon2' }),
        pass: 'SECTION A',
        passBorder: css({ borderColor: 'neon2', color: 'neon2', boxShadow: '0 0 20px rgba(123,47,255,0.25)' }),
        bg: 'linear-gradient(135deg, #1a0f2e 0%, #2d0f4f 100%)',
    },
    {
        name: 'ALL ACCESS #0012',
        event: 'TALUS WEB3 SUMMIT',
        price: '0.002 ETH',
        badge: 'Tier 1',
        badgeClass: css({ borderColor: 'neon', color: 'neon' }),
        pass: 'ALL ACCESS',
        passBorder: css({ borderColor: 'neon', color: 'neon' }),
        bg: 'linear-gradient(135deg, #0d1f2d 0%, #1a2030 100%)',
    },
    {
        name: 'GENERAL #0890',
        event: 'ANIME MATSURI: SOUL SOCIETY',
        price: '50 MATIC',
        badge: 'General',
        badgeClass: css({ borderColor: 'muted', color: 'muted' }),
        pass: 'GA PASS',
        passBorder: css({ borderColor: 'muted', color: 'muted' }),
        bg: 'linear-gradient(135deg, #2d0f1a 0%, #1a0f2e 100%)',
    },
    {
        name: 'MAIN STAGE #0150',
        event: 'MANTRA 116 ULTRA',
        price: '0.008 ETH',
        badge: 'Epic',
        badgeClass: css({ borderColor: 'neon2', color: 'neon2' }),
        pass: '116K PASS',
        passBorder: css({ borderColor: 'neon2', color: 'neon2' }),
        bg: 'linear-gradient(135deg, #1f1c0d 0%, #302b1a 100%)',
    },
    {
        name: 'VIP ARENA #0007',
        event: 'BLOCKPASS ESPORTS ARENA',
        price: '0.001 ETH',
        badge: 'VIP Pass',
        badgeClass: css({ borderColor: 'neon', color: 'neon' }),
        pass: 'ESPORTS VIP',
        passBorder: css({ borderColor: 'neon', color: 'neon' }),
        bg: 'linear-gradient(135deg, #0d2d2d 0%, #1a3030 100%)',
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
                    <Link key={i} href="/event" className={css({ textDecoration: 'none', color: 'inherit' })}>
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