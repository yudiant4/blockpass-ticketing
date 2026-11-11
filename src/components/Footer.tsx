import { css } from '../../styled-system/css';

export default function Footer() {
    return (
        <footer
            className={css({
                background: 'surface',
                color: 'text',
                padding: '48px 40px 32px',
                borderTop: '1px solid token(colors.border)',
                position: 'relative',
                zIndex: 1,
            })}
        >
            <div
                className={css({
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                })}
            >
                <div className={css({ fontSize: '13px', color: 'muted', fontFamily: 'mono' })}>
                    © 2026 Blockpass. All rights reserved.
                </div>
                <div className={css({ display: 'flex', gap: '24px' })}>
                    {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                        <a
                            key={link}
                            href="#"
                            className={css({
                                fontSize: '13px',
                                color: 'muted',
                                textDecoration: 'none',
                                fontFamily: 'mono',
                                transition: 'color 0.2s',
                                _hover: { color: 'neon' },
                            })}
                        >
                            {link}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
