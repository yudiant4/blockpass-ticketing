'use client';

export default function Ticker() {
  const items = [
    'ThreeUI Motion',
    'NFT Ticketing',
    'Blockchain Verified',
    'Zero Fraud',
    'Secondary Market',
    'Smart Contract Royalties',
    'Decentralized',
  ];

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 2,
        borderTop: '1px solid var(--bp-border)',
        borderBottom: '1px solid var(--bp-border)',
        padding: '14px 0',
        overflow: 'hidden',
        background: 'rgba(8,10,18,0.65)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 60,
          width: 'max-content',
          animation: 'bpTicker 22s linear infinite',
          whiteSpace: 'nowrap',
        }}
      >
        {[...items, ...items].map((text, idx) => (
          <div
            key={idx}
            className="bp-mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--bp-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ color: 'var(--bp-neon)' }}>✦</span> {text}
            <span style={{ color: 'var(--bp-neon3)', marginLeft: 12 }}>◆</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes bpTicker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
