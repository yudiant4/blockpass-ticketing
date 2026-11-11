'use client';

import { NewsletterFooter } from './three/ClientScenes';

export default function Footer() {
  return (
    <footer style={{ position: 'relative', zIndex: 2, padding: '40px 24px 28px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="bp-glass" style={{ overflow: 'hidden', marginBottom: 18 }}>
          <NewsletterFooter style={{ width: '100%', minHeight: 220 }} />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            padding: '8px 4px',
          }}
        >
          <div className="bp-mono" style={{ fontSize: 12, color: 'var(--bp-muted)' }}>
            © 2026 Blockpass · UI by ThreeUI Community
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Cookies'].map((link) => (
              <a
                key={link}
                href="#"
                className="bp-mono"
                style={{ fontSize: 12, color: 'var(--bp-muted)', textDecoration: 'none' }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
