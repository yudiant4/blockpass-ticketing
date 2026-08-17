'use client';

import Link from 'next/link';
import { css } from '../../../styled-system/css';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function LoginPage() {
    const { isConnected, address } = useAccount();
    const { disconnect } = useDisconnect();

    return (
        <main className={css({ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' })}>
            <div className={css({
                width: '100%', maxWidth: '440px',
                background: 'surface', border: '1px solid token(colors.neon)',
                boxShadow: '0 0 40px rgba(0,245,196,0.15)',
                padding: { base: '32px', md: '48px' },
                textAlign: 'center'
            })}>
                {/* Logo */}
                <div className={css({ fontFamily: 'mono', fontWeight: '700', fontSize: '18px', letterSpacing: '0.12em', color: 'neon', marginBottom: '8px' })}>
                    BLOCK<span className={css({ color: 'text' })}>PASS</span>
                </div>
                <div className={css({ fontFamily: 'mono', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'muted', marginBottom: '32px' })}>
                    Web3 Ticketing Platform
                </div>

                <h1 className={css({ fontSize: '24px', fontWeight: '800', marginBottom: '12px' })}>
                    {isConnected ? 'Welcome Back' : 'Connect Wallet'}
                </h1>

                <p className={css({ fontSize: '13px', lineHeight: '1.7', color: 'muted', marginBottom: '32px' })}>
                    {isConnected
                        ? 'Your wallet is connected. Head to your dashboard to manage tickets.'
                        : 'Login with your wallet to mint, trade, and verify event tickets on-chain. No email or password needed.'}
                </p>

                {isConnected && address ? (
                    // Connected state: show address + dashboard link
                    <>
                        <div className={css({
                            fontFamily: 'mono', fontSize: '13px', color: 'neon',
                            background: 'rgba(0,245,196,0.1)', border: '1px solid token(colors.neon)',
                            padding: '14px', marginBottom: '24px', wordBreak: 'break-all'
                        })}>
                            {address}
                        </div>
                        <Link href="/profile" className={css({ textDecoration: 'none', display: 'block' })}>
                            <button className={css({
                                width: '100%', padding: '14px', background: 'neon', color: 'bg',
                                fontFamily: 'mono', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase',
                                border: 'none', cursor: 'pointer', transition: 'box-shadow 0.2s',
                                _hover: { boxShadow: '0 0 30px rgba(0,245,196,0.5)' }
                            })}>
                                Enter Dashboard →
                            </button>
                        </Link>
                        <button
                            onClick={() => disconnect()}
                            className={css({
                                width: '100%', marginTop: '8px', padding: '12px',
                                background: 'transparent', border: '1px solid token(colors.border)',
                                color: 'muted', fontFamily: 'mono', fontSize: '11px', cursor: 'pointer',
                                _hover: { color: 'text' }
                            })}
                        >
                            Disconnect
                        </button>
                    </>
                ) : (
                    // Not connected: show the connect wallet button
                    <ConnectButton.Custom>
                        {({ openConnectModal }) => (
                            <button
                                onClick={openConnectModal}
                                className={css({
                                    width: '100%', padding: '14px', background: 'neon', color: 'bg',
                                    fontFamily: 'mono', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase',
                                    border: 'none', cursor: 'pointer', transition: 'box-shadow 0.2s',
                                    _hover: { boxShadow: '0 0 30px rgba(0,245,196,0.5)' }
                                })}
                            >
                                Connect Wallet
                            </button>
                        )}
                    </ConnectButton.Custom>
                )}

                <div className={css({ marginTop: '24px', fontFamily: 'mono', fontSize: '10px', color: 'muted' })}>
                    <Link href="/" className={css({ color: 'neon', textDecoration: 'none', _hover: { textDecoration: 'underline' } })}>
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}