import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { statusLabel } from './eventHelpers';

export type EventTier = {
  tierId: string;
  tierName: string;
  price: number;
  quota: number;
  sold: number;
  maxPerWallet: number;
  perks: string[];
  customFields: string[];
  /** Maps to on-chain ERC-1155 token id (1=Regular, 2=VIP, 3=VVIP) */
  onChainTierId?: number;
};

export type StoredEvent = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  bannerUrl: string;
  description: string;
  createdBy: string;
  status: 'Draft' | 'Published' | 'Ended';
  network: string;
  tiers: EventTier[];
  createdAt: string;
  updatedAt: string;
};

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'events.json');

const SEED_EVENTS: StoredEvent[] = [
  {
    _id: 'evt-web3-dev-connect',
    title: 'Web3 Dev Connect 2026',
    slug: 'web3-dev-connect-2026',
    category: 'Web3',
    startDate: '2026-08-15T10:00:00.000Z',
    endDate: '2026-08-15T18:00:00.000Z',
    location: 'Hotel Indonesia, Jakarta',
    bannerUrl: '',
    description: 'Konferensi developer Web3 terbesar di Indonesia. Mint tiket NFT on-chain di Base Sepolia.',
    createdBy: '0x0000000000000000000000000000000000000001',
    status: 'Published',
    network: 'Base',
    tiers: [
      {
        tierId: 'tier-regular',
        tierName: 'Regular',
        price: 0.001,
        quota: 500,
        sold: 42,
        maxPerWallet: 4,
        perks: ['General admission', 'Swag bag'],
        customFields: [],
        onChainTierId: 1,
      },
      {
        tierId: 'tier-vip',
        tierName: 'VIP',
        price: 0.003,
        quota: 100,
        sold: 18,
        maxPerWallet: 2,
        perks: ['VIP lounge', 'Priority seating', 'Meet & greet'],
        customFields: [],
        onChainTierId: 2,
      },
      {
        tierId: 'tier-vvip',
        tierName: 'VVIP',
        price: 0.01,
        quota: 30,
        sold: 5,
        maxPerWallet: 1,
        perks: ['Backstage access', 'Private dinner', 'Signed merch'],
        customFields: [],
        onChainTierId: 3,
      },
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    _id: 'evt-alas-trail-run',
    title: 'ALAS TRAIL RUN 2026',
    slug: 'alas-trail-run-2026',
    category: 'Sports/Race',
    startDate: '2026-08-15T00:00:00.000Z',
    endDate: '2026-08-15T23:59:00.000Z',
    location: 'Alas Purwo National Park',
    bannerUrl: '',
    description: 'Ultra marathon trail run dengan tiket NFT sebagai race bib dan proof of finish.',
    createdBy: '0x0000000000000000000000000000000000000002',
    status: 'Published',
    network: 'Base',
    tiers: [
      {
        tierId: 'tier-42k',
        tierName: '42K Ultra',
        price: 0.005,
        quota: 150,
        sold: 67,
        maxPerWallet: 1,
        perks: ['Race bib NFT', 'Finisher medal', 'Aid stations'],
        customFields: ['shirtSize'],
        onChainTierId: 2,
      },
      {
        tierId: 'tier-21k',
        tierName: '21K',
        price: 0.002,
        quota: 300,
        sold: 120,
        maxPerWallet: 2,
        perks: ['Race bib NFT', 'Finisher medal'],
        customFields: ['shirtSize'],
        onChainTierId: 1,
      },
    ],
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
  {
    _id: 'evt-nft-art-exhibition',
    title: 'NFT Art Exhibition',
    slug: 'nft-art-exhibition',
    category: 'Conference',
    startDate: '2025-01-10T09:00:00.000Z',
    endDate: '2025-01-12T21:00:00.000Z',
    location: 'Galeri Nasional, Jakarta',
    bannerUrl: '',
    description: 'Pameran seni NFT — sold out. Tiket tersisa hanya di secondary market.',
    createdBy: '0x0000000000000000000000000000000000000003',
    status: 'Ended',
    network: 'Ethereum',
    tiers: [
      {
        tierId: 'tier-vvip-art',
        tierName: 'VVIP',
        price: 0.02,
        quota: 50,
        sold: 50,
        maxPerWallet: 1,
        perks: ['Private preview', 'Artist dinner'],
        customFields: [],
        onChainTierId: 3,
      },
    ],
    createdAt: '2024-12-01T00:00:00.000Z',
    updatedAt: '2025-01-12T21:00:00.000Z',
  },
];

async function ensureStore(): Promise<StoredEvent[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as StoredEvent[];
  } catch {
    // seed below
  }
  await fs.writeFile(DATA_FILE, JSON.stringify(SEED_EVENTS, null, 2), 'utf8');
  return structuredClone(SEED_EVENTS);
}

async function writeStore(events: StoredEvent[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2), 'utf8');
}

function inferOnChainTierId(tierName: string, index: number): number {
  const n = tierName.toLowerCase();
  if (n.includes('vvip') || n.includes('legendary')) return 3;
  if (n.includes('vip') || n.includes('ultra')) return 2;
  if (index === 0) return 1;
  if (index === 1) return 2;
  return Math.min(3, index + 1);
}

export async function listEvents(opts?: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  q?: string;
}) {
  const events = await ensureStore();
  let filtered = [...events];

  if (opts?.status && opts.status !== 'All') {
    filtered = filtered.filter((e) => e.status === opts.status || statusLabel(e).includes(opts.status!));
  }
  if (opts?.category && opts.category !== 'All') {
    filtered = filtered.filter((e) => e.category.toLowerCase() === opts.category!.toLowerCase());
  }
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.createdBy.toLowerCase().includes(q)
    );
  }

  filtered.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  const page = Math.max(1, opts?.page || 1);
  const limit = Math.min(50, Math.max(1, opts?.limit || 20));
  const start = (page - 1) * limit;
  const slice = filtered.slice(start, start + limit);

  return {
    data: slice,
    meta: { page, limit, total: filtered.length, pages: Math.max(1, Math.ceil(filtered.length / limit)) },
  };
}

export async function getEvent(id: string) {
  const events = await ensureStore();
  return events.find((e) => e._id === id || e.slug === id) || null;
}

export async function createEvent(input: {
  title: string;
  slug: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  bannerUrl?: string;
  description?: string;
  createdBy: string;
  tiers: Array<Partial<EventTier> & { tierName: string; price: number; quota: number }>;
  network?: string;
  status?: StoredEvent['status'];
}) {
  const events = await ensureStore();
  const slug = input.slug.toLowerCase().replace(/\s+/g, '-');
  if (events.some((e) => e.slug === slug)) {
    const err = new Error('Slug sudah digunakan');
    (err as any).code = 11000;
    throw err;
  }

  const now = new Date().toISOString();
  const tiers: EventTier[] = input.tiers.map((t, i) => ({
    tierId: t.tierId || `tier-${randomUUID().slice(0, 8)}`,
    tierName: t.tierName,
    price: Number(t.price) || 0,
    quota: Math.max(1, Number(t.quota) || 1),
    sold: 0,
    maxPerWallet: Math.max(1, Number(t.maxPerWallet) || 2),
    perks: Array.isArray(t.perks) ? t.perks : [],
    customFields: Array.isArray(t.customFields) ? t.customFields : [],
    onChainTierId: t.onChainTierId || inferOnChainTierId(t.tierName, i),
  }));

  const event: StoredEvent = {
    _id: `evt-${randomUUID().slice(0, 12)}`,
    title: input.title,
    slug,
    category: input.category,
    startDate: new Date(input.startDate).toISOString(),
    endDate: new Date(input.endDate).toISOString(),
    location: input.location,
    bannerUrl: input.bannerUrl || '',
    description: input.description || '',
    createdBy: input.createdBy,
    status: input.status || 'Published',
    network: input.network || 'Base',
    tiers,
    createdAt: now,
    updatedAt: now,
  };

  events.unshift(event);
  await writeStore(events);
  return event;
}

export async function deleteEvent(id: string) {
  const events = await ensureStore();
  const next = events.filter((e) => e._id !== id && e.slug !== id);
  if (next.length === events.length) return false;
  await writeStore(next);
  return true;
}

export async function buyIntent(id: string, tierId: string, wallet: string, quantity = 1) {
  const events = await ensureStore();
  const event = events.find((e) => e._id === id || e.slug === id);
  if (!event) return { error: 'Acara tidak ditemukan', status: 404 as const };

  const tier = event.tiers.find((t) => t.tierId === tierId);
  if (!tier) return { error: 'Tier tidak ditemukan', status: 404 as const };

  const available = tier.quota - tier.sold;
  if (available < quantity) {
    return { error: `Kuota tidak cukup (tersisa ${available})`, status: 400 as const };
  }
  if (quantity > tier.maxPerWallet) {
    return { error: `Maksimal ${tier.maxPerWallet} per wallet`, status: 400 as const };
  }

  // Soft reserve only — sold is confirmed after on-chain mint via /confirm-mint
  event.updatedAt = new Date().toISOString();
  await writeStore(events);

  return {
    status: 200 as const,
    data: {
      eventId: event._id,
      tierId,
      quantity,
      remaining: available,
      priceEth: tier.price,
      onChainTierId: tier.onChainTierId || 1,
      wallet,
      reserved: true,
    },
  };
}

export async function confirmMint(id: string, tierId: string, quantity = 1, txHash?: string) {
  const events = await ensureStore();
  const event = events.find((e) => e._id === id || e.slug === id);
  if (!event) return { error: 'Acara tidak ditemukan', status: 404 as const };

  const tier = event.tiers.find((t) => t.tierId === tierId);
  if (!tier) return { error: 'Tier tidak ditemukan', status: 404 as const };

  const available = tier.quota - tier.sold;
  if (available < quantity) {
    return { error: `Kuota tidak cukup (tersisa ${available})`, status: 400 as const };
  }

  tier.sold += quantity;
  event.updatedAt = new Date().toISOString();
  await writeStore(events);

  return {
    status: 200 as const,
    data: {
      eventId: event._id,
      tierId,
      quantity,
      sold: tier.sold,
      remaining: tier.quota - tier.sold,
      txHash: txHash || null,
    },
  };
}

export { statusLabel, lowestPrice, supplySummary } from './eventHelpers';
// statusLabel is also imported above for listEvents filtering
