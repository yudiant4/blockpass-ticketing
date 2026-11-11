import { css } from '../../styled-system/css';

const steps = [
  {
    n: '01',
    title: 'Connect Wallet',
    body: 'Masuk dengan MetaMask atau wallet injected. Tidak perlu email atau password.',
  },
  {
    n: '02',
    title: 'Mint Ticket NFT',
    body: 'Pilih event & tier, bayar on-chain di Base Sepolia. Tiket langsung masuk wallet Anda.',
  },
  {
    n: '03',
    title: 'Verify on Entry',
    body: 'Scan QR / cek balance ERC-1155 di pintu masuk. Zero fraud, full ownership.',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className={css({
        padding: { base: '60px 20px', md: '100px 60px' },
        position: 'relative',
        zIndex: 1,
        borderTop: '1px solid token(colors.border)',
      })}
    >
      <div
        className={css({
          fontFamily: 'mono',
          fontSize: '11px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'neon',
          marginBottom: '16px',
        })}
      >
        Protocol
      </div>
      <h2
        className={css({
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: '800',
          letterSpacing: '-0.02em',
          marginBottom: '48px',
          maxWidth: '640px',
        })}
      >
        How Blockpass Works
      </h2>

      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
          gap: '32px',
        })}
      >
        {steps.map((s) => (
          <div key={s.n}>
            <div
              className={css({
                fontFamily: 'mono',
                fontSize: '12px',
                color: 'neon',
                letterSpacing: '0.2em',
                marginBottom: '16px',
              })}
            >
              {s.n}
            </div>
            <h3 className={css({ fontSize: '22px', fontWeight: '700', marginBottom: '12px' })}>{s.title}</h3>
            <p className={css({ fontFamily: 'mono', fontSize: '13px', lineHeight: '1.7', color: 'muted' })}>
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
