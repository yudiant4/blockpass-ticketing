import { css } from '../../styled-system/css';

export default function Ticker() {
    const items = [
        'NFT Ticketing',
        'Blockchain Verified',
        'Zero Fraud',
        'Secondary Market',
        'Smart Contract Royalties',
        'Decentralized',
    ];

    return (
        <div
            className={css({
                position: 'relative',
                zIndex: 1,
                borderTop: '1px solid token(colors.border)',
                borderBottom: '1px solid token(colors.border)',
                padding: '14px 0',
                overflow: 'hidden',
                background: 'rgba(13,16,23,0.6)',
            })}
        >
            <div
                className={css({
                    display: 'flex',
                    gap: '60px',
                    animation: 'ticker 22s linear infinite',
                    whiteSpace: 'nowrap',
                    width: 'max-content',
                })}
            >
                {[...items, ...items].map((text, idx) => (
                    <div
                        key={idx}
                        className={css({
                            fontFamily: 'mono',
                            fontSize: '11px',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'muted',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            flexShrink: 0,
                        })}
                    >
                        <span className={css({ color: 'neon' })}>✦</span> {text}{' '}
                        <span className={css({ color: 'neon3', marginLeft: '12px' })}>◆</span>
                    </div>
                ))}
            </div>
        </div>
    );
}