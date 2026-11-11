import { Chain } from 'viem';
import BlockpassABI from './abis/BlockpassTicket.json';

export const BLOCKPASS_TICKET_ADDRESS = (
  process.env.NEXT_PUBLIC_BLOCKPASS_ADDRESS ||
  '0xbdb5f9745db186c25424fa0ec5b81009980b87c2'
) as `0x${string}`;

export const BLOCKPASS_TICKET_ABI = BlockpassABI as any;

export const BASE_SEPOLIA: Chain = {
  id: 84532,
  name: 'Base Sepolia',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://sepolia.base.org'] } },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://sepolia.basescan.org' },
  },
  testnet: true,
};

/** Fallback prices (ETH) matching DeployBlockpassTicket script */
export const TIER_PRICES = { 1: '0.001', 2: '0.003', 3: '0.01' } as const;

export const TIER_NAMES = { 1: 'Regular', 2: 'VIP', 3: 'VVIP' } as const;
