'use client';

import { useState } from 'react';
import Link from 'next/link';
import { css } from '../../styled-system/css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    // Mengambil status koneksi wallet asli dari Wagmi
    const { isConnected } = useAccount();

    // Menu dasar saat belum konek wallet (tanpa Events)
    const baseNavLinks = [
        { name: 'Marketplace', path: '/marketplace' },
        // { name: 'Events', path: '/event' }, // removed – Marketplace covers events
        { name: 'How It Works', path: '/#how-it-works' },
        { name: 'Docs', path: '/#docs' },
        { name: 'Sign In', path: '/login' },
    ];

    // Tambahkan menu "My Tickets" hanya jika wallet sudah terhubung
    const navLinks = isConnected
        ? [...baseNavLinks, { name: 'My Tickets', path: '/profile' }]
        : baseNavLinks;

    return (
        <nav
            className={css({
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: { base: '16px 20px', md: '24px 60px' },
                borderBottom: '1px solid token(colors.border)',
                background: 'rgba(8,10,15,0.9)',
                backdropFilter: 'blur(12px)',
            })}
        >
            {/* Logo BLOCKPASS */}
            <Link
                href="/"
                className={css({
                    fontFamily: 'mono',
                    fontWeight: '700',
                    fontSize: { base: '16px', md: '18px' },
                    letterSpacing: '0.12em',
                    color: 'neon',
                    textDecoration: 'none',
                })}
            >
                BLOCK<span className={css({ color: 'text' })}>PASS</span>
            </Link>

            {/* Desktop Menu */}
            <div
                className={css({
                    display: { base: 'none', md: 'flex' },
                    gap: '32px',
                    alignItems: 'center',
                })}
            >
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.path}
                        className={css({
                            fontFamily: 'mono',
                            fontSize: '12px',
                            letterSpacing: '0.1em',
                            color: 'muted',
                            textDecoration: 'none',
                            textTransform: 'uppercase',
                            transition: 'color 0.2s',
                            _hover: { color: 'neon' },
                        })}
                    >
                        {link.name}
                    </Link>
                ))}

                {/* Tombol Connect Wallet Otomatis dari RainbowKit */}
                <ConnectButton />
            </div>

            {/* Hamburger Button untuk Mobile (HP) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={css({
                    display: { base: 'block', md: 'none' },
                    background: 'transparent',
                    border: 'none',
                    color: 'neon',
                    fontSize: '24px',
                    cursor: 'pointer',
                })}
            >
                {isOpen ? '✕' : '☰'}
            </button>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div
                    className={css({
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: 'surface',
                        borderBottom: '1px solid token(colors.border)',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        md: { display: 'none' },
                    })}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            onClick={() => setIsOpen(false)}
                            className={css({
                                fontFamily: 'mono',
                                fontSize: '14px',
                                color: 'text',
                                textDecoration: 'none',
                                textTransform: 'uppercase',
                            })}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Tombol Connect Wallet untuk Mobile View */}
                    <div className={css({ display: 'flex', justifyContent: 'center' })}>
                        <ConnectButton />
                    </div>
                </div>
            )}
        </nav>
    );
}
