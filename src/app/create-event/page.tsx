'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { AlertCircle, FileText, Layers } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiUrl } from '@/lib/api';
import { GlassmorphismCta, NebulaBg, SceneFrame } from '@/components/three/ClientScenes';

interface Tier {
  tierId: string;
  tierName: string;
  price: number;
  quota: number;
  maxPerWallet: number;
  perks: string[];
  customFields: string[];
}

export default function CreateEventPage() {
  const { address: adminWallet, isConnected } = useAccount();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    title: '',
    category: 'Web3',
    startDate: '',
    endDate: '',
    location: '',
    bannerUrl: '',
    description: '',
  });
  const [tiers, setTiers] = useState<Tier[]>([
    { tierId: 'tier-regular', tierName: 'Regular', price: 0.001, quota: 100, maxPerWallet: 2, perks: [], customFields: [] },
  ]);

  const totalQuota = useMemo(() => tiers.reduce((s, t) => s + t.quota, 0), [tiers]);
  const priceRange = useMemo(() => {
    if (!tiers.length) return { min: 0, max: 0 };
    const prices = tiers.map((t) => t.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [tiers]);

  const canSubmit = useMemo(() => {
    if (!adminWallet) return false;
    if (!form.title || !form.startDate || !form.endDate || !form.location) return false;
    if (tiers.length < 1) return false;
    if (new Date(form.startDate) <= new Date()) return false;
    return tiers.every((t) => t.price >= 0 && t.quota >= 1 && t.maxPerWallet >= 1);
  }, [form, tiers, adminWallet]);

  const addTier = () => {
    setTiers((prev) => [
      ...prev,
      { tierId: `tier-${Date.now()}`, tierName: '', price: 0, quota: 1, maxPerWallet: 2, perks: [], customFields: [] },
    ]);
  };

  const removeTier = (index: number) => setTiers((prev) => prev.filter((_, i) => i !== index));
  const updateTier = (index: number, field: keyof Tier, value: any) => {
    setTiers((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  };

  const handleSubmit = async () => {
    if (!canSubmit || !adminWallet) return;
    setSubmitting(true);
    setMessage('');
    try {
      const res = await fetch(apiUrl('/api/events'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-wallet': adminWallet },
        body: JSON.stringify({
          title: form.title,
          slug: form.title.toLowerCase().replace(/\s+/g, '-'),
          category: form.category,
          startDate: form.startDate,
          endDate: form.endDate,
          location: form.location,
          bannerUrl: form.bannerUrl,
          description: form.description,
          tiers,
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setMessage('Event created successfully');
        const id = data.data?._id;
        if (id) setTimeout(() => router.push(`/event/${id}`), 800);
      } else {
        setMessage(data.message || 'Gagal membuat event');
      }
    } catch (e: any) {
      setMessage(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <main className="bp-page" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
        <div className="bp-bg-layer" aria-hidden>
          <NebulaBg mode="dark" />
        </div>
        <Navbar />
        <div className="bp-glass bp-content" style={{ maxWidth: 420, padding: 28, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center', marginBottom: 12 }}>
            <AlertCircle size={18} color="var(--bp-neon)" />
            <span className="bp-mono" style={{ color: 'var(--bp-neon)', fontSize: 11, letterSpacing: '0.16em' }}>
              ACCESS RESTRICTED
            </span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>CONNECT WALLET TO CREATE EVENT</h1>
          <p style={{ color: 'var(--bp-muted)', marginBottom: 20 }}>
            You must connect your Web3 wallet before accessing the event builder interface.
          </p>
          <ConnectButton />
        </div>
      </main>
    );
  }

  return (
    <main className="bp-page">
      <div className="bp-bg-layer" aria-hidden>
        <NebulaBg mode="dark" hue={0.7} />
      </div>
      <div className="bp-content">
        <Navbar />
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '110px 24px 40px' }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, marginBottom: 22 }}>CREATE NEW EVENT</h1>

          <SceneFrame height={160} style={{ marginBottom: 22 }}>
            <GlassmorphismCta mode="dark" hue={0.5} />
          </SceneFrame>

          <section className="bp-glass" style={{ padding: 24, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--bp-neon)', marginBottom: 16 }}>
              <FileText size={18} />
              <span style={{ fontWeight: 600 }}>General Information</span>
            </div>
            <div className="bp-grid-2">
              <label>
                <span className="bp-label">Title *</span>
                <input className="bp-input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              </label>
              <label>
                <span className="bp-label">Category *</span>
                <select className="bp-select" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                  <option value="Web3">WEB3</option>
                  <option value="Sports/Race">SPORTS</option>
                  <option value="Music">MUSIC</option>
                  <option value="Conference">CONFERENCE</option>
                </select>
              </label>
              <label>
                <span className="bp-label">Start Date *</span>
                <input className="bp-input" type="datetime-local" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
              </label>
              <label>
                <span className="bp-label">End Date *</span>
                <input className="bp-input" type="datetime-local" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
              </label>
              <label>
                <span className="bp-label">Location *</span>
                <input className="bp-input" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
              </label>
              <label>
                <span className="bp-label">Banner URL</span>
                <input className="bp-input" value={form.bannerUrl} onChange={(e) => setForm((f) => ({ ...f, bannerUrl: e.target.value }))} />
              </label>
              <label style={{ gridColumn: '1 / -1' }}>
                <span className="bp-label">Description</span>
                <textarea className="bp-textarea" rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </label>
            </div>
          </section>

          <section className="bp-glass" style={{ padding: 24, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--bp-neon)' }}>
                <Layers size={18} />
                <span style={{ fontWeight: 600 }}>Ticket Tiers</span>
              </div>
              <button className="bp-btn bp-btn-solid" onClick={addTier}>
                ADD TIER
              </button>
            </div>
            {tiers.map((tier, i) => (
              <div key={tier.tierId} className="bp-glass" style={{ padding: 16, marginBottom: 12, background: 'rgba(0,0,0,0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span className="bp-mono" style={{ fontSize: 11, color: 'var(--bp-muted)' }}>
                    TIER {i + 1}
                  </span>
                  {tiers.length > 1 && (
                    <button className="bp-mono" style={{ background: 'none', border: 'none', color: 'var(--bp-neon3)', cursor: 'pointer' }} onClick={() => removeTier(i)}>
                      REMOVE
                    </button>
                  )}
                </div>
                <div className="bp-grid-2">
                  <label>
                    <span className="bp-label">Tier Name *</span>
                    <input className="bp-input" value={tier.tierName} onChange={(e) => updateTier(i, 'tierName', e.target.value)} />
                  </label>
                  <label>
                    <span className="bp-label">Price (ETH) *</span>
                    <input className="bp-input" type="number" step="0.001" min="0" value={tier.price} onChange={(e) => updateTier(i, 'price', parseFloat(e.target.value) || 0)} />
                  </label>
                  <label>
                    <span className="bp-label">Quota *</span>
                    <input className="bp-input" type="number" min="1" value={tier.quota} onChange={(e) => updateTier(i, 'quota', parseInt(e.target.value) || 1)} />
                  </label>
                  <label>
                    <span className="bp-label">Max Per Wallet *</span>
                    <input className="bp-input" type="number" min="1" value={tier.maxPerWallet} onChange={(e) => updateTier(i, 'maxPerWallet', parseInt(e.target.value) || 1)} />
                  </label>
                </div>
              </div>
            ))}
          </section>

          <section className="bp-glass" style={{ padding: 24, marginBottom: 20 }}>
            <div className="bp-grid-3">
              <div style={{ textAlign: 'center', padding: 12 }}>
                <div className="bp-mono" style={{ fontSize: 10, color: 'var(--bp-muted)' }}>
                  TOTAL QUOTA
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--bp-neon)' }}>{totalQuota}</div>
              </div>
              <div style={{ textAlign: 'center', padding: 12 }}>
                <div className="bp-mono" style={{ fontSize: 10, color: 'var(--bp-muted)' }}>
                  PRICE RANGE
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--bp-neon)' }}>
                  {priceRange.min} - {priceRange.max} ETH
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: 12 }}>
                <div className="bp-mono" style={{ fontSize: 10, color: 'var(--bp-muted)' }}>
                  TOTAL TIERS
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--bp-neon)' }}>{tiers.length}</div>
              </div>
            </div>
          </section>

          {message && (
            <div className="bp-glass" style={{ padding: 12, marginBottom: 16, color: message.includes('success') ? 'var(--bp-neon)' : 'var(--bp-neon3)' }}>
              {message}
            </div>
          )}

          <button className={`bp-btn ${canSubmit && !submitting ? 'bp-btn-solid' : ''}`} style={{ width: '100%', padding: 16 }} disabled={!canSubmit || submitting} onClick={handleSubmit}>
            {submitting ? 'CREATING...' : 'CREATE EVENT'}
          </button>
        </div>
        <Footer />
      </div>
    </main>
  );
}
