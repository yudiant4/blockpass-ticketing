import Link from 'next/link';
import { css } from '../../styled-system/css';

export default function DocsSection() {
  return (
    <section
      id="docs"
      className={css({
        padding: { base: '60px 20px', md: '80px 60px' },
        position: 'relative',
        zIndex: 1,
        background: 'surface',
        borderTop: '1px solid token(colors.border)',
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
        Documentation
      </div>
      <h2
        className={css({
          fontSize: 'clamp(24px, 3vw, 40px)',
          fontWeight: '800',
          marginBottom: '20px',
        })}
      >
        Build with Blockpass
      </h2>
      <p
        className={css({
          fontFamily: 'mono',
          fontSize: '13px',
          color: 'muted',
          maxWidth: '560px',
          lineHeight: '1.8',
          marginBottom: '32px',
        })}
      >
        Contract ERC-1155 di Base Sepolia. Mint via <code>mintTicket(tierId, amount)</code>, verifikasi ownership
        dengan <code>balanceOf</code>, batalkan dengan <code>cancelTicket(holder, id, amount)</code>.
      </p>
      <div className={css({ display: 'flex', gap: '16px', flexWrap: 'wrap' })}>
        <Link href="/marketplace" className={css({ textDecoration: 'none' })}>
          <span
            className={css({
              display: 'inline-block',
              padding: '12px 24px',
              border: '1px solid token(colors.neon)',
              color: 'neon',
              fontFamily: 'mono',
              fontSize: '12px',
              textTransform: 'uppercase',
              _hover: { background: 'rgba(0,245,196,0.1)' },
            })}
          >
            Open Marketplace
          </span>
        </Link>
        <Link href="/create-event" className={css({ textDecoration: 'none' })}>
          <span
            className={css({
              display: 'inline-block',
              padding: '12px 24px',
              border: '1px solid token(colors.border)',
              color: 'text',
              fontFamily: 'mono',
              fontSize: '12px',
              textTransform: 'uppercase',
              _hover: { borderColor: 'neon', color: 'neon' },
            })}
          >
            Create Event
          </span>
        </Link>
      </div>
    </section>
  );
}
