'use client';

import Link from 'next/link';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Navbar from '@/components/Navbar';
import { GatewayFlow, SceneFrame } from '@/components/three/ClientScenes';

export default function LoginPage() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <main className="bp-page" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <Navbar />
      <div className="bp-glass" style={{ width: '100%', maxWidth: 460, overflow: 'hidden' }}>
        <SceneFrame height={160} style={{ borderRadius: 0 }}>
          <GatewayFlow mode="dark" speed={1.1} />
        </SceneFrame>
        <div style={{ padding: 32, textAlign: 'center' }}>
          <div className="bp-mono" style={{ color: 'var(--bp-neon)', fontWeight: 700, letterSpacing: '0.14em', marginBottom: 8 }}>
            BLOCK<span style={{ color: 'var(--bp-text)' }}>PASS</span>
          </div>
          <div className="bp-mono" style={{ fontSize: 10, color: 'var(--bp-muted)', letterSpacing: '0.22em', marginBottom: 22 }}>
            WEB3 TICKETING PLATFORM
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 12px' }}>{isConnected ? 'Welcome Back' : 'Connect Wallet'}</h1>
          <p className="bp-mono" style={{ fontSize: 13, color: 'var(--bp-muted)', lineHeight: 1.7, marginBottom: 24 }}>
            {isConnected
              ? 'Your wallet is connected. Head to your dashboard to manage tickets.'
              : 'Login with your wallet to mint, trade, and verify event tickets on-chain.'}
          </p>

          {isConnected && address ? (
            <>
              <div className="bp-mono" style={{ fontSize: 12, color: 'var(--bp-neon)', background: 'rgba(0,245,196,0.08)', border: '1px solid rgba(0,245,196,0.35)', padding: 12, marginBottom: 16, wordBreak: 'break-all' }}>
                {address}
              </div>
              <Link href="/profile" className="bp-btn bp-btn-solid" style={{ width: '100%', marginBottom: 8 }}>
                Enter Dashboard →
              </Link>
              <button className="bp-btn" style={{ width: '100%' }} onClick={() => disconnect()}>
                Disconnect
              </button>
            </>
          ) : (
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button className="bp-btn bp-btn-solid" style={{ width: '100%' }} onClick={openConnectModal}>
                  Connect Wallet
                </button>
              )}
            </ConnectButton.Custom>
          )}

          <div style={{ marginTop: 20 }}>
            <Link href="/" className="bp-mono" style={{ color: 'var(--bp-neon)', fontSize: 11, textDecoration: 'none' }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
