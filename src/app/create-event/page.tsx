'use client';

import { useState, useMemo } from 'react';
import { css } from 'styled-system/css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { FileText, Layers, AlertCircle } from 'lucide-react';

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
    if (tiers.length === 0) return { min: 0, max: 0 };
    const prices = tiers.map(t => t.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [tiers]);

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://129.226.95.94:3002'}/api/events`, {
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
        setMessage('Event created successfully');
      } else {
        setMessage(data.message);
      }
    } catch (e: any) {
      setMessage(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Wallet Access Gate
  if (!isConnected) {
    return (
      <main className={css({ minHeight: '100vh', bg: 'gray.900', py: '24', px: '4', display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
        <div className={css({
          bg: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          rounded: 'lg',
          p: '8',
          textAlign: 'center',
          maxW: 'md',
        })}>
          <div className={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2',
            mb: '4',
          })}>
            <AlertCircle size={20} color="#06b6d4" />
            <span className={css({
              fontFamily: 'mono',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'emerald.400',
              fontSize: 'xs',
              fontWeight: 'bold',
            })}>ACCESS RESTRICTED</span>
          </div>
          <h1 className={css({
            fontSize: '2xl',
            fontWeight: 'bold',
            color: 'white',
            mb: '2',
          })}>CONNECT WALLET TO CREATE EVENT</h1>
          <p className={css({ color: 'muted', mb: '6' })}>
            You must connect your Web3 wallet before accessing the event builder interface.
          </p>
          <ConnectButton />
        </div>
      </main>
    );
  }

  return (
    <main className={css({ minHeight: '100vh', bg: 'gray.900', py: '24', px: '4' })}>
      <div className={css({ maxW: '4xl', mx: 'auto' })}>
        <h1 className={css({ fontSize: '3xl', fontWeight: 'bold', color: 'white', mb: '6' })}>CREATE NEW EVENT</h1>

        <section className={css({
          bg: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          rounded: 'lg',
          p: '6',
          mb: '8',
        })}>
          <div className={css({ display: 'flex', alignItems: 'center', mb: '4' })}>
            <div className={css({ w: '2', h: '8', bg: 'neon', mr: '3' })} />
            <div className={css({ display: 'flex', alignItems: 'center', gap: '2', color: 'neon' })}>
              <FileText size={20} />
              <span className={css({ fontSize: 'lg', fontWeight: '600' })}>General Information</span>
            </div>
          </div>
          <div className={css({ gap: '4', gridTemplateColumns: { base: '1fr', md: 'repeat(2,1fr)' } })}>
            <label className={css({ display: 'block' })}>
              <span className={css({ fontFamily: 'mono', fontSize: 'xs', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'gray.400' })}>TITLE<span className={css({ color: 'neon' })}>*</span></span>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className={css({ w: 'full', mt: '1', bg: 'gray.800', border: '1px solid gray.700', rounded: 'md', p: '2', color: 'white' })}
              />
            </label>

            <label className={css({ display: 'block' })}>
              <span className={css({ fontFamily: 'mono', fontSize: 'xs', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'gray.400' })}>CATEGORY<span className={css({ color: 'neon' })}>*</span></span>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className={css({ w: 'full', mt: '1', bg: 'gray.800', border: '1px solid gray.700', rounded: 'md', p: '2', color: 'white', cursor: 'pointer' })}
              >
                <option value="Web3">WEB3</option>
                <option value="Sports/Race">SPORTS</option>
                <option value="Music">MUSIC</option>
                <option value="Conference">CONFERENCE</option>
              </select>
            </label>

            <label className={css({ display: 'block' })}>
              <span className={css({ fontFamily: 'mono', fontSize: 'xs', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'gray.400' })}>START DATE<span className={css({ color: 'neon' })}>*</span></span>
              <input type="datetime-local" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                className={css({ w: 'full', mt: '1', bg: 'gray.800', border: '1px solid gray.700', rounded: 'md', p: '2', color: 'white' })}
              />
            </label>

            <label className={css({ display: 'block' })}>
              <span className={css({ fontFamily: 'mono', fontSize: 'xs', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'gray.400' })}>END DATE<span className={css({ color: 'neon' })}>*</span></span>
              <input type="datetime-local" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                className={css({ w: 'full', mt: '1', bg: 'gray.800', border: '1px solid gray.700', rounded: 'md', p: '2', color: 'white' })}
              />
            </label>

            <label className={css({ display: 'block' })}>
              <span className={css({ fontFamily: 'mono', fontSize: 'xs', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'gray.400' })}>LOCATION<span className={css({ color: 'neon' })}>*</span></span>
              <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className={css({ w: 'full', mt: '1', bg: 'gray.800', border: '1px solid gray.700', rounded: 'md', p: '2', color: 'white' })}
              />
            </label>

            <label className={css({ display: 'block' })}>
              <span className={css({ fontFamily: 'mono', fontSize: 'xs', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'gray.400' })}>BANNER URL</span>
              <input type="text" value={form.bannerUrl} onChange={e => setForm(f => ({ ...f, bannerUrl: e.target.value }))}
                className={css({ w: 'full', mt: '1', bg: 'gray.800', border: '1px solid gray.700', rounded: 'md', p: '2', color: 'white' })}
              />
            </label>

            <label className={css({ display: 'block', gridColumn: 'span 2' })}>
              <span className={css({ fontFamily: 'mono', fontSize: 'xs', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'gray.400' })}>DESCRIPTION</span>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className={css({ w: 'full', mt: '1', bg: 'gray.800', border: '1px solid gray.700', rounded: 'md', p: '2', color: 'white', minH: '120px' })}
              />
            </label>
          </div>
        </section>

        <section className={css({
          bg: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          rounded: 'lg',
          p: '6',
          mb: '8',
        })}>
          <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '4' })}>
            <div className={css({ display: 'flex', alignItems: 'center', gap: '2', color: 'neon' })}>
              <Layers size={20} />
              <span className={css({ fontSize: 'lg', fontWeight: '600' })}>Ticket Tiers</span>
            </div>
            <button onClick={addTier} className={css({ bg: 'neon', color: 'black', px: '3', py: '1', rounded: 'md', fontSize: 'sm', fontWeight: 'bold', cursor: 'pointer' })}>ADD TIER</button>
          </div>

          {tiers.map((tier, i) => (
            <div key={tier.tierId} className={css({ bg: 'gray.800', border: '1px solid gray.700', rounded: 'md', p: '4', mb: '4' })}>
              <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '2' })}>
                <span className={css({ fontFamily: 'mono', textXs: true, color: 'gray.400' })}>TIER {i + 1}</span>
                {tiers.length > 1 && (
                  <button onClick={() => removeTier(i)} className={css({ color: 'red.400', fontSize: 'sm', cursor: 'pointer', fontFamily: 'mono' })}>REMOVE</button>
                )}
              </div>
              <div className={css({ gap: '3', gridTemplateColumns: { base: '1fr', md: 'repeat(2,1fr)' } })}>
                <label className={css({ display: 'block' })}>
                  <span className={css({ fontFamily: 'mono', fontSize: 'xs', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'gray.400' })}>TIER NAME<span className={css({ color: 'neon' })}>*</span></span>
                  <input type="text" value={tier.tierName} onChange={e => updateTier(i, 'tierName', e.target.value)}
                    className={css({ w: 'full', mt: '1', bg: 'gray.900', border: '1px solid gray.700', rounded: 'md', p: '2', color: 'white' })}
                  />
                </label>
                <label className={css({ display: 'block' })}>
                  <span className={css({ fontFamily: 'mono', fontSize: 'xs', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'gray.400' })}>PRICE (ETH)<span className={css({ color: 'neon' })}>*</span></span>
                  <input type="number" step="0.001" min="0" value={tier.price} onChange={e => updateTier(i, 'price', parseFloat(e.target.value) || 0)}
                    className={css({ w: 'full', mt: '1', bg: 'gray.900', border: '1px solid gray.700', rounded: 'md', p: '2', color: 'white' })}
                  />
                </label>
                <label className={css({ display: 'block' })}>
                  <span className={css({ fontFamily: 'mono', fontSize: 'xs', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'gray.400' })}>QUOTA<span className={css({ color: 'neon' })}>*</span></span>
                  <input type="number" min="1" value={tier.quota} onChange={e => updateTier(i, 'quota', parseInt(e.target.value) || 1)}
                    className={css({ w: 'full', mt: '1', bg: 'gray.900', border: '1px solid gray.700', rounded: 'md', p: '2', color: 'white' })}
                  />
                </label>
                <label className={css({ display: 'block' })}>
                  <span className={css({ fontFamily: 'mono', fontSize: 'xs', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'gray.400' })}>MAX PER WALLET<span className={css({ color: 'neon' })}>*</span></span>
                  <input type="number" min="1" value={tier.maxPerWallet} onChange={e => updateTier(i, 'maxPerWallet', parseInt(e.target.value) || 1)}
                    className={css({ w: 'full', mt: '1', bg: 'gray.900', border: '1px solid gray.700', rounded: 'md', p: '2', color: 'white' })}
                  />
                </label>
                <label className={css({ display: 'block' })}>
                  <span className={css({ fontFamily: 'mono', fontSize: 'xs', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'gray.400' })}>PERKS</span>
                  <input type="text" value={tier.perks.join(', ')} onChange={e => updateTier(i, 'perks', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    className={css({ w: 'full', mt: '1', bg: 'gray.900', border: '1px solid gray.700', rounded: 'md', p: '2', color: 'white' })}
                  />
                </label>
                <label className={css({ display: 'block' })}>
                  <span className={css({ fontFamily: 'mono', fontSize: 'xs', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'gray.400' })}>CUSTOM FIELDS</span>
                  <input type="text" value={tier.customFields.join(', ')} onChange={e => updateTier(i, 'customFields', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    className={css({ w: 'full', mt: '1', bg: 'gray.900', border: '1px solid gray.700', rounded: 'md', p: '2', color: 'white' })}
                  />
                </label>
              </div>
            </div>
          ))}
        </section>

        <section className={css({
          bg: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          rounded: 'lg',
          p: '6',
          mb: '8',
        })}>
          <div className={css({ display: 'flex', alignItems: 'center', mb: '4' })}>
            <div className={css({ w: '2', h: '8', bg: 'neon', mr: '3' })} />
            <div className={css({ display: 'flex', alignItems: 'center', gap: '2', color: 'neon' })}>
              <Layers size={20} />
              <span className={css({ fontSize: 'lg', fontWeight: '600' })}>Summary</span>
            </div>
          </div>
          <div className={css({ gap: '4', gridTemplateColumns: { base: '1fr', md: 'repeat(3,1fr)' } })}>
            <div className={css({ textAlign: 'center', p: '3', bg: 'gray.800', rounded: 'md' })}>
              <p className={css({ fontFamily: 'mono', textXs: true, color: 'gray.400', textTransform: 'uppercase' })}>TOTAL QUOTA</p>
              <p className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'neon' })}>{totalQuota}</p>
            </div>
            <div className={css({ textAlign: 'center', p: '3', bg: 'gray.800', rounded: 'md' })}>
              <p className={css({ fontFamily: 'mono', textXs: true, color: 'gray.400', textTransform: 'uppercase' })}>PRICE RANGE</p>
              <p className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'neon' })}>{priceRange.min} - {priceRange.max} ETH</p>
            </div>
            <div className={css({ textAlign: 'center', p: '3', bg: 'gray.800', rounded: 'md' })}>
              <p className={css({ fontFamily: 'mono', textXs: true, color: 'gray.400', textTransform: 'uppercase' })}>TOTAL TIERS</p>
              <p className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'neon' })}>{tiers.length}</p>
            </div>
          </div>
        </section>

        {message && (
          <div className={css({ p: '3', mb: '6', bg: message.includes('success') ? 'emerald.700' : 'red.700', rounded: 'md', color: 'white', fontWeight: 'medium', fontFamily: 'mono' })}>
            {message}
          </div>
        )}

        <button onClick={handleSubmit} disabled={!canSubmit || submitting}
          className={css({
            w: 'full', py: '3', rounded: 'lg',
            bg: canSubmit && !submitting ? 'neon' : 'gray.700',
            color: 'black', fontWeight: 'bold', cursor: 'pointer',
            fontFamily: 'mono',
          })}>
          {submitting ? 'CREATING...' : 'CREATE EVENT'}
        </button>
      </div>
    </main>
  );
}