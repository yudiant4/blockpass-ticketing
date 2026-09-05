import { connect } from 'mongoose';

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