// Frontend event helpers – no DB connection needed

// ============================================================
// MONGODB EVENT SCHEMA
// ============================================================
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

// ============================================================
// MONGODB CONNECTION
// ============================================================
let isConnected = false;

export async function dbConnect(uri: string) {
  if (isConnected) return;
  
  await connect(uri);
  isConnected = true;
}

// ============================================================
// EVENT HELPERS
// ============================================================

// Pre-Event: Calculate time remaining
export function getTimeRemaining(eventDate: Date) {
  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, isPast: diff < 0 };
}

// Event Day: Check if scan should be allowed
export function isEventDay(eventDate: Date, startTime: string, endTime: string) {
  const now = new Date();
  const today = new Date(eventDate);
  today.setHours(0, 0, 0, 0);
  
  const start = new Date(today.setHours(parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1])));
  const end = new Date(today.setHours(parseInt(endTime.split(':')[0]), parseInt(endTime.split(':')[1])));
  
  return now >= start && now <= end;
}

// Post-Event: Archive check
export function isPostEvent(eventDate: Date, durationHours: number = 2) {
  const now = new Date();
  const eventEnd = new Date(eventDate.getTime() + durationHours * 60 * 60 * 1000);
  return now > eventEnd;
}

// ============================================================
// TIER UTILS
// ============================================================
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
    case 1: return 'bg-emerald-500/20 border-emerald-500';
    case 2: return 'bg-cyan-500/20 border-cyan-500';
    case 3: return 'bg-purple-500/20 border-purple-500';
    default: return 'bg-slate-500/20 border-slate-500';
  }
}

export function tierPriceETH(id: number): string {
  switch (id) {
    case 1: return '0.001';
    case 2: return '0.003';
    case 3: return '0.01';
    default: return '0.001';
  }
}

// ============================================================
// MARKETPLACE MOCK DATA
// ============================================================
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

export const marketplaceEvents: MarketplaceEvent[] = [
  {
    id: '1',
    title: 'Web3 Dev Connect 2025',
    organizer: 'DevDAO',
    category: 'Konferensi',
    status: 'Live Minting',
    network: 'Base',
    date: '2025-01-20',
    location: 'Hotel Indonesia, Jakarta',
    cryptoPrice: '0.003 ETH',
    fiatPrice: '$10.50',
    supply: { minted: 245, total: 500 },
    rarity: 'VIP',
    statusColor: 'neon',
    action: 'Mint Now',
    trending: true,
    bg: 'linear-gradient(135deg, #0d1017 0%, #1a2030 100%)',
  },
  {
    id: '2',
    title: 'Solana Hackathon Finals',
    organizer: 'SuperteamID',
    category: 'Esports',
    status: 'Upcoming',
    network: 'Solana',
    date: '2025-02-15',
    location: 'Virtual',
    cryptoPrice: '0.05 SOL',
    fiatPrice: '$12.00',
    supply: { minted: 0, total: 1000 },
    rarity: 'Regular',
    statusColor: 'cyan',
    action: 'Register',
    trending: true,
    bg: 'linear-gradient(135deg, #0d1017 0%, #1a2030 100%)',
  },
  {
    id: '3',
    title: 'NFT Art Exhibition',
    organizer: 'Kolektif Nusantara',
    category: 'Exhibition',
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