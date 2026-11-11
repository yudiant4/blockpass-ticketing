'use client';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Ticker from '../components/Ticker';
import NFTShowcase from '../components/NFTShowcase';
import HowItWorks from '../components/HowItWorks';
import DocsSection from '../components/DocsSection';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Ticker />
      <NFTShowcase />
      <HowItWorks />
      <DocsSection />
      <Footer />
    </main>
  );
}
