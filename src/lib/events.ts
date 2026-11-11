// Frontend event helpers – no DB connection needed

export interface IEvent {
  _id?: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  venue: string;
  tierPricing: {
    regular: { price: number; supply: number; sold: number };
    vip: { price: number; supply: number; sold: number };
    vvip: { price: number; supply: number; sold: number };
  };
  contractAddress?: string;
  tokenIdBase?: string;
  isActive: boolean;
  isActiveMinting?: boolean;
  qrCodeEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Pre-Event: Calculate time remaining */
export function getTimeRemaining(eventDate: Date) {
  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isPast: diff < 0 };
}

/** Event Day: Check if scan should be allowed */
export function isEventDay(eventDate: Date, startTime: string, endTime: string) {
  const now = new Date();
  const today = new Date(eventDate);
  today.setHours(0, 0, 0, 0);

  const [sh, sm] = startTime.split(':').map((n) => parseInt(n, 10));
  const [eh, em] = endTime.split(':').map((n) => parseInt(n, 10));
  const start = new Date(today);
  start.setHours(sh, sm, 0, 0);
  const end = new Date(today);
  end.setHours(eh, em, 0, 0);

  return now >= start && now <= end;
}

/** Post-Event: Archive check */
export function isPostEvent(eventDate: Date, durationHours: number = 2) {
  const now = new Date();
  const eventEnd = new Date(eventDate.getTime() + durationHours * 60 * 60 * 1000);
  return now > eventEnd;
}

export const TIER_LABELS = {
  1: 'Regular',
  2: 'VIP',
  3: 'VVIP',
} as const;

export function tierLabel(id: number) {
  return TIER_LABELS[id as keyof typeof TIER_LABELS] || 'Unknown';
}

export function tierColor(id: number) {
  switch (id) {
    case 1:
      return 'bg-emerald-500/20 border-emerald-500';
    case 2:
      return 'bg-cyan-500/20 border-cyan-500';
    case 3:
      return 'bg-purple-500/20 border-purple-500';
    default:
      return 'bg-slate-500/20 border-slate-500';
  }
}

export function tierPriceETH(id: number): string {
  switch (id) {
    case 1:
      return '0.001';
    case 2:
      return '0.003';
    case 3:
      return '0.01';
    default:
      return '0.001';
  }
}

export interface MarketplaceEvent {
  id: string;
  title: string;
  organizer: string;
  category: string;
  status: string;
  network: string;
  date: string;
  location: string;
  cryptoPrice: string;
  fiatPrice: string;
  supply: { minted: number; total: number };
  rarity: string;
  statusColor: string;
  action: string;
  trending: boolean;
  bg: string;
}

/** Fallback mock used only when API is unreachable */
export const marketplaceEvents: MarketplaceEvent[] = [
  {
    id: 'evt-web3-dev-connect',
    title: 'Web3 Dev Connect 2026',
    organizer: 'DevDAO',
    category: 'Web3',
    status: 'Live Minting',
    network: 'Base',
    date: '2026-08-15',
    location: 'Hotel Indonesia, Jakarta',
    cryptoPrice: '0.001 ETH',
    fiatPrice: '$3.50',
    supply: { minted: 42, total: 630 },
    rarity: 'VIP',
    statusColor: 'neon',
    action: 'Mint Now',
    trending: true,
    bg: 'linear-gradient(135deg, #0d1017 0%, #1a2030 100%)',
  },
  {
    id: 'evt-alas-trail-run',
    title: 'ALAS TRAIL RUN 2026',
    organizer: 'Alas Crew',
    category: 'Sports/Race',
    status: 'Upcoming',
    network: 'Base',
    date: '2026-08-15',
    location: 'Alas Purwo National Park',
    cryptoPrice: '0.002 ETH',
    fiatPrice: '$7.00',
    supply: { minted: 187, total: 450 },
    rarity: 'Regular',
    statusColor: 'cyan',
    action: 'Register',
    trending: true,
    bg: 'linear-gradient(135deg, #0a2010 0%, #0f3d2e 100%)',
  },
  {
    id: 'evt-nft-art-exhibition',
    title: 'NFT Art Exhibition',
    organizer: 'Kolektif Nusantara',
    category: 'Conference',
    status: 'Sold Out',
    network: 'Ethereum',
    date: '2025-01-10',
    location: 'Galeri Nasional, Jakarta',
    cryptoPrice: '0.02 ETH',
    fiatPrice: '$65.00',
    supply: { minted: 50, total: 50 },
    rarity: 'VVIP',
    statusColor: 'red',
    action: 'Sold Out',
    trending: false,
    bg: 'linear-gradient(135deg, #1a0d0d 0%, #301a1a 100%)',
  },
];
