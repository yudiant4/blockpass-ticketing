'use client';

import { useState, useMemo } from 'react';
import { css } from 'styled-system/css';
import { useAccount } from 'wagmi';
import { FileText, Calendar, MapPin, Layers, AlertCircle } from 'lucide-react';

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
        setMessage('✅ Event created successfully');
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (e: any) {
      setMessage(`❌ ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={css({ minHeight: '100vh', bg: 'gray.900', py: '24', px: '4' })}>
      <div className={css({ maxW: '4xl', mx: 'auto' })}>
        {/* Wallet banner */}
        {!adminWallet && (
          <div className={css({
            bg: 'amber.800',
            border: '1px solid amber.600',
            rounded: 'lg',
            p: '4',
            mb: '8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          })}>
            <div className={css({ display: 'flex', alignItems: 'center', gap: '2', color: 'amber.200' })}>
              <AlertCircle size={20} />
              <span className={css({ fontSize: 'sm', fontFamily: 'mono', fontWeight: '500' })}>
                Connect your wallet to create an event.
              </span>
            </div>
            <button className={css({
              bg: 'emerald.600',
              hover: { bg: 'emerald.500' },
              color: 'white',
              px: '4',
              py: '2',
              rounded: 'md',
              fontSize: 'sm',
              fontWeight: '600',
              cursor: 'pointer',
            })}>
              Connect Wallet
            </button>
          </div>
        )}

        {/* Page Title */}
        <h1 className={css({ fontSize: '3xl', fontWeight: 'bold', color: 'white', mb: '6' })}>Create New Event</h1>

        {/* General Information */}
        <section className={css({
          bg: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          rounded: 'lg',
          p: '6',
          mb: '8',
        })}>
          <div className={css({ display: 'flex', alignItems: 'center', mb: '4' })}>
            <div className={css({ w: '2', h: '8', bg: 'emerald.500', mr: '3' })} />
            <div className={css({ display: 'flex', alignItems: 'center', gap: '2', color: 'emerald.400' })}>
              <FileText size={20} />
              <span className={css({ fontSize: 'lg', fontWeight: '600' })}>General Information</span>
            </div>
          </div>
          <div className={css({ gap: '4', gridTemplateColumns: { base: '1fr', md: 'repeat(2,1fr)' } })}>
            {/* Title */}
            <label className={css({ block })}>
              <span className={css({ textXs: true, fontFamily: 'mono', color: 'gray.400' })}>Title<span className={css({ color: 'emerald.400' })}>*</span></span>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className={css({
                  w: 'full',
                  mt: '1',
                  bg: 'gray.800',
                  border: '1px solid gray.700',
                  rounded: 'md',
                  p: '2',
                  color: 'white',
                  focus: { outline: 'none', ring: '2', ringColor: 'emerald.500' },
                })}
              />
            </label>

            {/* Category */}
            <label className={css({ block })}>
              <span className={css({ textXs: true, fontFamily: 'mono', color: 'gray.400' })}>Category<span className={css({ color: 'emerald.400' })}>*</span></span>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className={css({
                  w: 'full',
                  mt: '1',
                  bg: 'gray.800',
                  border: '1px solid gray.700',
                  rounded: 'md',
                  p: '2',
                  color: 'white',
                  focus: { outline: 'none', ring: '2', ringColor: 'emerald.500' },
                })}
              >
                <option value="Web3">Web3</option>
                <option value="Sports/Race">Sports/Race</option>
                <option value="Music">Music</option>
                <option value="Conference">Conference</option>
              </select>
            </label>

            {/* Start / End Date */}
            <label className={css({ block })}>
              <span className={css({ textXs: true, fontFamily: 'mono', color: 'gray.400' })}>Start Date<span className={css({ color: 'emerald.400' })}>*</span></span>
              <input type="datetime-local" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                className={css({
                  w: 'full',
                  mt: '1',
                  bg: 'gray.800',
                  border: '1px solid gray.700',
                  rounded: 'md',
                  p: '2',
                  color: 'white',
                  focus: { outline: 'none', ring: '2', ringColor: 'emerald.500' },
                })}
              />
            </label>
            <label className={css({ block })}>
              <span className={css({ textXs: true, fontFamily: 'mono', color: 'gray.400' })}>End Date<span className={css({ color: 'emerald.400' })}>*</span></span>
              <input type="datetime-local" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                className={css({
                  w: 'full',
                  mt: '1',
                  bg: 'gray.800',
                  border: '1px solid gray.700',
                  rounded: 'md',
                  p: '2',
                  color: 'white',
                  focus: { outline: 'none', ring: '2', ringColor: 'emerald.500' },
                })}
              />
            </label>

            {/* Location */}
            <label className={css({ block })}>
              <span className={css({ textXs: true, fontFamily: 'mono', color: 'gray.400' })}>Location<span className={css({ color: 'emerald.400' })}>*</span></span>
              <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className={css({
                  w: 'full',
                  mt: '1',
                  bg: 'gray.800',
                  border: '1px solid gray.700',
                  rounded: 'md',
                  p: '2',
                  color: 'white',
                  focus: { outline: 'none', ring: '2', ringColor: 'emerald.500' },
                })}
              />
            </label>

            {/* Banner URL */}
            <label className={css({ block })}>
              <span className={css({ textXs: true, fontFamily: 'mono', color: 'gray.400' })}>Banner URL</span>
              <input type="text" value={form.bannerUrl} onChange={e => setForm(f => ({ ...f, bannerUrl: e.target.value }))}
                className={css({
                  w: 'full',
                  mt: '1',
                  bg: 'gray.800',
                  border: '1px solid gray.700',
                  rounded: 'md',
                  p: '2',
                  color: 'white',
                  focus: { outline: 'none', ring: '2', ringColor: 'emerald.500' },
                })}
              />
            </label>

            {/* Description */}
                        <label className={css({ block, gridColumn: 'span 2' })} >
              <span className={css({ textXs: true, fontFamily: 'mono', color: 'gray.400' })}>Description</span>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className={css({
                  w: 'full',
                  mt: '1',
                  bg: 'gray.800',
                  border: '1px solid gray.700',
                  rounded: 'md',
                  p: '2',
                  color: 'white',
                  minH: '120px',
                  focus: { outline: 'none', ring: '2', ringColor: 'emerald.500' },
                })}
              />
            </label>
          </div>
        </section>

        {/* Tier Builder */}
        <section className={css({
          bg: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          rounded: 'lg',
          p: '6',
          mb: '8',
        })}>
          <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '4' })}>
            <div className={css({ display: 'flex', alignItems: 'center', gap: '2', color: 'emerald.400' })}>
              <Layers size={20} />
              <span className={css({ fontSize: 'lg', fontWeight: '600' })}>Ticket Tiers</span>
            </div>
            <button onClick={addTier} className={css({
              bg: 'emerald.600',
              hover: { bg: 'emerald.500' },
              color: 'white',
              px: '3',
              py: '1',
              rounded: 'md',
              fontSize: 'sm',
              cursor: 'pointer',
            })}>Add Tier</button>
          </div>
          {tiers.map((tier, i) => (
            <div key={tier.tierId} className={css({
              bg: 'gray.800',
              border: '1px solid gray.700',
              rounded: 'md',
              p: '4',
              mb: '4',
            })}>
              <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '2' })}>
                <span className={css({ fontFamily: 'mono', textXs: true, color: 'gray.400' })}>Tier {i + 1}</span>
                {tiers.length > 1 && (
                  <button onClick={() => removeTier(i)} className={css({ color: 'red.400', fontSize: 'sm', cursor: 'pointer' })}>Remove</button>
                )}
              </div>
              <div className={css({ gap: '3', gridTemplateColumns: { base: '1fr', md: 'repeat(2,1fr)' } })}>
                <label className={css({ block })}>
                  <span className={css({ textXs: true, fontFamily: 'mono', color: 'gray.400' })}>Tier Name<span className={css({ color: 'emerald.400' })}>*</span></span>
                  <input type="text" value={tier.tierName} onChange={e => updateTier(i, 'tierName', e.target.value)}
                    className={css({
                      w: 'full',
                      mt: '1',
                      bg: 'gray.900',
                      border: '1px solid gray.700',
                      rounded: 'md',
                      p: '2',
                      color: 'white',
                      focus: { outline: 'none', ring: '2', ringColor: 'emerald.500' },
                    })}
                  />
                </label>
                <label className={css({ block })}>
                  <span className={css({ textXs: true, fontFamily: 'mono', color: 'gray.400' })}>Price (ETH)<span className={css({ color: 'emerald.400' })}>*</span></span>
                  <input type="number" step="0.001" min="0" value={tier.price} onChange={e => updateTier(i, 'price', parseFloat(e.target.value) || 0)}
                    className={css({
                      w: 'full',
                      mt: '1',
                      bg: 'gray.900',
                      border: '1px solid gray.700',
                      rounded: 'md',
                      p: '2',
                      color: 'white',
                      focus: { outline: 'none', ring: '2', ringColor: 'emerald.500' },
                    })}
                  />
                </label>
                <label className={css({ block })}>
                  <span className={css({ textXs: true, fontFamily: 'mono', color: 'gray.400' })}>Quota<span className={css({ color: 'emerald.400' })}>*</span></span>
                  <input type="number" min="1" value={tier.quota} onChange={e => updateTier(i, 'quota', parseInt(e.target.value) || 1)}
                    className={css({
                      w: 'full',
                      mt: '1',
                      bg: 'gray.900',
                      border: '1px solid gray.700',
                      rounded: 'md',
                      p: '2',
                      color: 'white',
                      focus: { outline: 'none', ring: '2', ringColor: 'emerald.500' },
                    })}
                  />
                </label>
                <label className={css({ block })}>
                  <span className={css({ textXs: true, fontFamily: 'mono', color: 'gray.400' })}>Max per Wallet<span className={css({ color: 'emerald.400' })}>*</span></span>
                  <input type="number" min="1" value={tier.maxPerWallet} onChange={e => updateTier(i, 'maxPerWallet', parseInt(e.target.value) || 1)}
                    className={css({
                      w: 'full',
                      mt: '1',
                      bg: 'gray.900',
                      border: '1px solid gray.700',
                      rounded: 'md',
                      p: '2',
                      color: 'white',
                      focus: { outline: 'none', ring: '2', ringColor: 'emerald.500' },
                    })}
                  />
                </label>
                <label className={css({ block })}>
                  <span className={css({ textXs: true, fontFamily: 'mono', color: 'gray.400' })}>Perks (comma separated)</span>
                  <input type="text" value={tier.perks.join(', ')} onChange={e => updateTier(i, 'perks', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    className={css({
                      w: 'full',
                      mt: '1',
                      bg: 'gray.900',
                      border: '1px solid gray.700',
                      rounded: 'md',
                      p: '2',
                      color: 'white',
                      focus: { outline: 'none', ring: '2', ringColor: 'emerald.500' },
                    })}
                  />
                </label>
                <label className={css({ block })}>
                  <span className={css({ textXs: true, fontFamily: 'mono', color: 'gray.400' })}>Custom Fields (comma separated)</span>
                  <input type="text" value={tier.customFields.join(', ')} onChange={e => updateTier(i, 'customFields', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    className={css({
                      w: 'full',
                      mt: '1',
                      bg: 'gray.900',
                      border: '1px solid gray.700',
                      rounded: 'md',
                      p: '2',
                      color: 'white',
                      focus: { outline: 'none', ring: '2', ringColor: 'emerald.500' },
                    })}
                  />
                </label>
              </div>
            </div>
          ))}
        </section>

        {/* Summary */}
        <section className={css({
          bg: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          rounded: 'lg',
          p: '6',
          mb: '8',
        })}>
          <div className={css({ display: 'flex', alignItems: 'center', mb: '4' })}>
            <div className={css({ w: '2', h: '8', bg: 'emerald.500', mr: '3' })} />
            <div className={css({ display: 'flex', alignItems: 'center', gap: '2', color: 'emerald.400' })}>
              <Layers size={20} />
              <span className={css({ fontSize: 'lg', fontWeight: '600' })}>Summary</span>
            </div>
          </div>
          <div className={css({ gap: '4', gridTemplateColumns: { base: '1fr', md: 'repeat(3,1fr)' } })}>
            <div className={css({ textAlign: 'center', p: '3', bg: 'gray.800', rounded: 'md' })}>
              <p className={css({ textXs: true, color: 'gray.400' })}>Total Quota</p>
              <p className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'emerald.400' })}>{totalQuota}</p>
            </div>
            <div className={css({ textAlign: 'center', p: '3', bg: 'gray.800', rounded: 'md' })}>
              <p className={css({ textXs: true, color: 'gray.400' })}>Price Range (ETH)</p>
              <p className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'emerald.400' })}>${priceRange.min} – {priceRange.max}</p>
            </div>
            <div className={css({ textAlign: 'center', p: '3', bg: 'gray.800', rounded: 'md' })}>
              <p className={css({ textXs: true, color: 'gray.400' })}>Tiers Count</p>
              <p className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'emerald.400' })}>{tiers.length}</p>
            </div>
          </div>
        </section>

        {/* Feedback Message */}
        {message && (
          <div className={css({ p: '3', mb: '6', bg: message.startsWith('✅') ? 'emerald.700' : 'red.700', rounded: 'md', color: 'white', fontWeight: 'medium' })}>
            {message}
          </div>
        )}

        {/* Submit button */}
        <button onClick={handleSubmit} disabled={!canSubmit || submitting}
          className={css({
            w: 'full',
            py: '3',
            rounded: 'lg',
            bg: canSubmit && !submitting ? 'emerald.600' : 'gray.700',
            hover: { bg: canSubmit && !submitting ? 'emerald.500' : undefined },
            color: 'white',
            fontWeight: 'bold',
            cursor: canSubmit && !submitting ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s',
          })}>
          {submitting ? 'Creating…' : 'Create Event'}
        </button>
      </div>
    </main>
  );
}