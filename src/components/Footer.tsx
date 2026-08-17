import { css } from '../../styled-system/css';

export default function Footer() {
    return (
        <footer
            className={css({
                background: 'text',
                color: 'white',
                padding: '60px 48px 32px',
            })}
        >
            <div
                className={css({
                    maxWidth: '1200px',
                    margin: '0 auto',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    paddingTop: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                })}
            >
                <div className={css({ fontSize: '13px', color: 'rgba(255,255,255,0.4)' })}>
                    © 2026 TicketPro. All rights reserved.
                </div>
                <div className={css({ display: 'flex', gap: '24px' })}>
                    {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                        <a
                            key={link}
                            href="#"
                            className={css({
                                fontSize: '13px',
                                color: 'rgba(255,255,255,0.4)',
                                textDecoration: 'none',
                                transition: 'color 0.2s',
                                _hover: { color: 'white' },
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