'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { AnimatedTopDock } from './three/ClientScenes';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected } = useAccount();

  const baseNavLinks = [
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Create Event', path: '/create-event' },
    { name: 'Verify', path: '/verify' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'Docs', path: '/#docs' },
    { name: 'Sign In', path: '/login' },
  ];

  const navLinks = isConnected
    ? [...baseNavLinks, { name: 'My Tickets', path: '/profile' }]
    : baseNavLinks;

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '14px 24px' }}>
      <div
        className="bp-glass"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 18px',
          gap: 16,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none' }}>
          <AnimatedTopDock variant="glass" />
        </div>

        <Link
          href="/"
          className="bp-mono"
          style={{
            position: 'relative',
            zIndex: 1,
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: '0.14em',
            color: 'var(--bp-neon)',
            textDecoration: 'none',
          }}
        >
          BLOCK<span style={{ color: 'var(--bp-text)' }}>PASS</span>
        </Link>

        <div className="bp-nav-desktop" style={{ position: 'relative', zIndex: 1, gap: 22, alignItems: 'center' }}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className="bp-mono"
              style={{
                fontSize: 11,
                letterSpacing: '0.1em',
                color: 'var(--bp-muted)',
                textDecoration: 'none',
                textTransform: 'uppercase',
              }}
            >
              {link.name}
            </Link>
          ))}
          <ConnectButton />
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bp-mono bp-nav-burger"
          style={{
            position: 'relative',
            zIndex: 1,
            background: 'transparent',
            border: 'none',
            color: 'var(--bp-neon)',
            fontSize: 22,
            cursor: 'pointer',
          }}
          aria-label="Menu"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {isOpen && (
        <div
          className="bp-glass"
          style={{
            maxWidth: 1200,
            margin: '10px auto 0',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className="bp-mono"
              style={{
                fontSize: 13,
                color: 'var(--bp-text)',
                textDecoration: 'none',
                textTransform: 'uppercase',
              }}
            >
              {link.name}
            </Link>
          ))}
          <ConnectButton />
        </div>
      )}
    </nav>
  );
}
