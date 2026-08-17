'use client';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Ticker from '../components/Ticker';
import NFTShowcase from '../components/NFTShowcase';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function HomePage() {
    return (
        <main className="min-h-screen">
            <Navbar />

            {/* Container opsional jika ingin menampilkan tombol connect di dashboard/hero */}
            <div className="flex justify-end p-4">
                <ConnectButton />
            </div>

            <Hero />
            <Ticker />
            <NFTShowcase />
        </main>
    );
}