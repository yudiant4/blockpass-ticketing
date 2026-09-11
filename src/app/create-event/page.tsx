'use client';

import { useState, useMemo } from 'react';
import { css } from 'styled-system/css';
import { useAccount } from 'wagmi';

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
  const { address: adminWallet } = useAccount();
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

  // Live calculations
  const totalQuota = useMemo(() => tiers.reduce((s, t) => s + t.quota, 0), [tiers]);
  const priceRange = useMemo(() => {
    if (tiers.length === 0) return { min: 0, max: 0 };
    const prices = tiers.map(t => t.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [tiers]);

  // Validation
  const canSubmit = useMemo(() => {
    if (!adminWallet) return false;
    if (!form.title || !form.startDate || !form.endDate || !form.location) return false;
    if (tiers.length < 1) return false;
    if (new Date(form.startDate) <= new Date()) return false;
    return tiers.every(t => t.price >= 0 && t.quota >= 1 && t.maxPerWallet >= 1);
  }, [form, tiers, adminWallet]);

  const addTier = () => {
    setTiers(prev => [...prev, {
      tierId: `tier-${Date.now()}`,
      tierName: '',
      price: 0,
      quota: 1,
      maxPerWallet: 2,
      perks: [],
      customFields: [],
    }]);
  };

  const removeTier = (index: number) => {
    setTiers(prev => prev.filter((_, i) => i !== index));
  };

  const updateTier = (index: number, field: keyof Tier, value: any) => {
    setTiers(prev => prev.map((t, i) => i === index ? { ...t, [field]: value } : t));
  };

  const handleSubmit = async () => {
    if (!canSubmit || !adminWallet) return;
    setSubmitting(true);
    setMessage('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-wallet': adminWallet,
        },
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
        setMessage('✅ Acara berhasil dibuat!');
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (e: any) {
      setMessage(`❌ Error: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={css({ minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' })}>
      <div className={css({ maxWidth: '900px', margin: '0 auto', padding: '0 40px' })}>
        <h1 className={css({ fontSize: '28px', fontWeight: '800', marginBottom: '8px' })}>Create Event</h1>
        {!adminWallet && (
          <div className={css({ p: '4', bg: 'yellow', borderRadius: 'md', color: 'black', mb: '6' })}>
            Connect wallet terlebih dahulu untuk membuat acara.
          </div>
        )}

        {/* General Info */}
        <div className={css({ background: 'surface', border: '1px solid token(colors.border)', padding: '24px', borderRadius: '8px', marginBottom: '24px' })}>
          <h2 className={css({ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'neon' })}>📋 General Information</h2>
          
          <div className={css({ display: 'grid', gap: '16px' })}>
            <input type="text" placeholder="Event Title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className={css({ bg: 'bg', border: '1px solid token(colors.border)', padding: '12px', color: 'text', borderRadius: '4px' })} />
            
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className={css({ bg: 'bg', border: '1px solid token(colors.border)', padding: '12px', color: 'text', borderRadius: '4px' })}>
              <option value="Web3">Web3</option>
              <option value="Sports/Race">Sports/Race</option>
              <option value="Music">Music</option>
              <option value="Conference">Conference</option>
            </select>

            <div className={css({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' })}>
              <div>
                <label className={css({ fontSize: '11px', color: 'muted', marginBottom: '4px', display: 'block' })}>Start Date *</label>
                <input type="datetime-local" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                  className={css({ w: 'full', bg: 'bg', border: '1px solid token(colors.border)', padding: '12px', color: 'text', borderRadius: '4px' })} />
              </div>
              <div>
                <label className={css({ fontSize: '11px', color: 'muted', marginBottom: '4px', display: 'block' })}>End Date *</label>
                <input type="datetime-local" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                  className={css({ w: 'full', bg: 'bg', border: '1px solid token(colors.border)', padding: '12px', color: 'text', borderRadius: '4px' })} />
              </div>
            </div>

            <input type="text" placeholder="Location *" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              className={css({ bg: 'bg', border: '1px solid token(colors.border)', padding: '12px', color: 'text', borderRadius: '4px' })} />

            <input type="text" placeholder="Banner URL (optional)" value={form.bannerUrl} onChange={e => setForm(f => ({ ...f, bannerUrl: e.target.value }))}
              className={css({ bg: 'bg', border: '1px solid token(colors.border)', padding: '12px', color: 'text', borderRadius: '4px' })} />

            <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className={css({ bg: 'bg', border: '1px solid token(colors.border)', padding: '12px', color: 'text', borderRadius: '4px', minHeight: '100px' })} />
          </div>
        </div>

        {/* Tier Management */}
        <div className={css({ background: 'surface', border: '1px solid token(colors.border)', padding: '24px', borderRadius: '8px', marginBottom: '24px' })}>
          <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' })}>
            <h2 className={css({ fontSize: '16px', fontWeight: '700', color: 'neon' })}>🎫 Ticket Tiers</h2>
            <button onClick={addTier} className={css({ bg: 'neon', color: 'black', px: '3', py: '1', borderRadius: '4px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' })}>
              + Add Tier
            </button>
          </div>

          {tiers.map((tier, i) => (
            <div key={tier.tierId} className={css({ bg: 'bg', border: '1px solid token(colors.border)', padding: '16px', borderRadius: '6px', marginBottom: '12px' })}>
              <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' })}>
                <span className={css({ fontFamily: 'mono', fontSize: '12px', color: 'muted' })}>Tier {i + 1}</span>
                {tiers.length > 1 && (
                  <button onClick={() => removeTier(i)} className={css({ color: 'red', fontSize: '12px', cursor: 'pointer' })}>✕ Remove</button>
                )}
              </div>
              <div className={css({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' })}>
                <input type="text" placeholder="Tier Name *" value={tier.tierName} onChange={e => updateTier(i, 'tierName', e.target.value)}
                  className={css({ bg: 'surface', border: '1px solid token(colors.border)', padding: '10px', color: 'text', borderRadius: '4px' })} />
                <input type="number" placeholder="Price (ETH) *" step="0.001" min="0" value={tier.price} onChange={e => updateTier(i, 'price', parseFloat(e.target.value) || 0)}
                  className={css({ bg: 'surface', border: '1px solid token(colors.border)', padding: '10px', color: 'text', borderRadius: '4px' })} />
                <input type="number" placeholder="Quota *" min="1" value={tier.quota} onChange={e => updateTier(i, 'quota', parseInt(e.target.value) || 1)}
                  className={css({ bg: 'surface', border: '1px solid token(colors.border)', padding: '10px', color: 'text', borderRadius: '4px' })} />
                <input type="number" placeholder="Max per Wallet" min="1" value={tier.maxPerWallet} onChange={e => updateTier(i, 'maxPerWallet', parseInt(e.target.value) || 1)}
                  className={css({ bg: 'surface', border: '1px solid token(colors.border)', padding: '10px', color: 'text', borderRadius: '4px' })} />
                <input type="text" placeholder="Perks (comma separated)" value={tier.perks.join(', ')} onChange={e => updateTier(i, 'perks', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className={css({ bg: 'surface', border: '1px solid token(colors.border)', padding: '10px', color: 'text', borderRadius: '4px' })} />
                <input type="text" placeholder="Custom Fields (comma separated)" value={tier.customFields.join(', ')} onChange={e => updateTier(i, 'customFields', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className={css({ bg: 'surface', border: '1px solid token(colors.border)', padding: '10px', color: 'text', borderRadius: '4px' })} />
              </div>
            </div>
          ))}
        </div>

        {/* Live Summary */}
        <div className={css({ background: 'surface', border: '1px solid token(colors.border)', padding: '24px', borderRadius: '8px', marginBottom: '24px' })}>
          <h2 className={css({ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: 'neon' })}>📊 Summary</h2>
          <div className={css({ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' })}>
            <div className={css({ textAlign: 'center', p: '3', bg: 'bg', borderRadius: '6px' })}>
              <p className={css({ fontSize: '11px', color: 'muted' })}>Total Quota</p>
              <p className={css({ fontSize: '20px', fontWeight: '800', color: 'neon' })}>{totalQuota}</p>
            </div>
            <div className={css({ textAlign: 'center', p: '3', bg: 'bg', borderRadius: '6px' })}>
              <p className={css({ fontSize: '11px', color: 'muted' })}>Price Range</p>
              <p className={css({ fontSize: '20px', fontWeight: '800', color: 'neon' })}>{priceRange.min} – {priceRange.max} ETH</p>
            </div>
            <div className={css({ textAlign: 'center', p: '3', bg: 'bg', borderRadius: '6px' })}>
              <p className={css({ fontSize: '11px', color: 'muted' })}>Total Tiers</p>
              <p className={css({ fontSize: '20px', fontWeight: '800', color: 'neon' })}>{tiers.length}</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        {message && <div className={css({ p: '3', mb: '4', bg: message.startsWith('✅') ? 'emerald' : 'red', borderRadius: '4px', color: 'white' })}>{message}</div>}

        <button onClick={handleSubmit} disabled={!canSubmit || submitting}
          className={css({ w: 'full', p: '4', borderRadius: '6px', bg: canSubmit && !submitting ? 'neon' : 'surface', color: canSubmit && !submitting ? 'black' : 'muted', fontWeight: '700', fontSize: '14px', cursor: canSubmit && !submitting ? 'pointer' : 'not-allowed', border: '1px solid token(colors.border)' })}>
          {submitting ? 'Creating...' : '🚀 Create Event'}
        </button>
      </div>
    </main>
  );
}