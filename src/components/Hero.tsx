import Link from 'next/link';
import { css } from '../../styled-system/css';

export default function Hero() {
  return (
    <section
      className={css({
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: { base: '100px 20px 60px', md: '140px 60px 80px' },
        zIndex: 1,
        overflow: 'hidden',
      })}
    >
      {/* Background Glow Blobs */}
      <div
        className={css({
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          animation: 'pulseBlob 8s ease-in-out infinite alternate',
          width: { base: '300px', md: '600px' },
          height: { base: '300px', md: '600px' },
          background: 'radial-gradient(circle, rgba(123,47,255,0.2), transparent 70%)',
          top: '-100px',
          right: '-100px',
        })}
      />

      <div
        className={css({
          fontFamily: 'mono',
          fontSize: '11px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'neon',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '28px',
          animation: 'fadeUp 0.8s ease forwards',
        })}
      >
        Web3 Ticketing Protocol — On-chain
      </div>

      <h1
        className={css({
          fontSize: 'clamp(36px, 7vw, 110px)',
          fontWeight: '800',
          lineHeight: '0.9',
          letterSpacing: '-0.03em',
          marginBottom: '32px',
          animation: 'fadeUp 0.8s 0.1s ease forwards',
        })}
      >
        THE FUTURE<br />
        OF <span className={css({ color: 'neon' })}>LIVE</span><br />
        <span
          className={css({
            WebkitTextStroke: '1.5px token(colors.neon3)',
            color: 'transparent',
          })}
        >
          EVENTS.
        </span>
      </h1>

      <p
        className={css({
          fontFamily: 'mono',
          fontSize: '14px',
          lineHeight: '1.8',
          color: 'muted',
          maxWidth: '480px',
          marginBottom: '48px',
          animation: 'fadeUp 0.8s 0.2s ease forwards',
        })}
      >
        Mint, trade, and verify event tickets as NFTs on-chain. Zero fraud. Full ownership. Instant secondary market.
      </p>

      <div
        className={css({
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
          animation: 'fadeUp 0.8s 0.3s ease forwards',
        })}
      >
        {/* Mengarah ke Marketplace */}
        <Link href="/marketplace" className={css({ textDecoration: 'none' })}>
          <button
            className={css({
              fontFamily: 'mono',
              fontSize: '13px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: 'neon',
              color: 'bg',
              padding: '14px 32px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '700',
              transition: 'box-shadow 0.2s, transform 0.15s',
              _hover: {
                boxShadow: '0 0 40px rgba(0,245,196,0.5)',
                transform: 'translateY(-2px)',
              },
            })}
          >
            Explore Tickets
          </button>
        </Link>

        <Link href="/login" className={css({ textDecoration: 'none' })}>
          <button
            className={css({
              fontFamily: 'mono',
              fontSize: '13px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: 'transparent',
              color: 'text',
              padding: '14px 32px',
              border: '1px solid token(colors.border)',
              cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
              _hover: { borderColor: 'muted', color: 'neon' },
            })}
          >
            Sign In →
          </button>
        </Link>
      </div>
    </section>
  );
}