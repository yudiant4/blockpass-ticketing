/** Client-safe event helpers (no Node fs) */

export type EventTierLike = {
  tierName: string;
  price: number;
  quota: number;
  sold: number;
};

export type EventLike = {
  _id: string;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  createdBy: string;
  status: 'Draft' | 'Published' | 'Ended' | string;
  network?: string;
  tiers: EventTierLike[];
};

export function statusLabel(event: EventLike): string {
  if (event.status === 'Ended' || new Date(event.endDate) < new Date()) return 'Sold Out';
  const soldOut = event.tiers.every((t) => t.sold >= t.quota);
  if (soldOut) return 'Sold Out';
  if (event.status === 'Draft') return 'Upcoming';
  if (new Date(event.startDate) > new Date()) return 'Upcoming';
  return 'Live Minting';
}

export function lowestPrice(event: EventLike): number {
  if (!event.tiers.length) return 0;
  return Math.min(...event.tiers.map((t) => t.price));
}

export function supplySummary(event: EventLike) {
  return event.tiers.reduce(
    (acc, t) => {
      acc.minted += t.sold;
      acc.total += t.quota;
      return acc;
    },
    { minted: 0, total: 0 }
  );
}
