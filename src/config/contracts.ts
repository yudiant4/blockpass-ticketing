import { Chain } from 'viem';
import { createConfig, configureChains, mainnet, sepolia } from 'wagmi';
import { createPublicClient, http } from 'viem';

// ============================================================
// CONTRACT ADDRESSES (Base Sepolia Testnet)
// ============================================================
export const BLOCKPASS_TICKET_ADDRESS = '0xbdb5f9745db186c25424fa0ec5b81009980b87c2' as const;

// ============================================================
// ABI - Auto-extracted from BlockpassTicket.sol
// ============================================================
export const BLOCKPASS_TICKET_ABI = [
  {"type":"constructor","inputs":[{"name":"baseUri","type":"string","internalType":"string"}],"stateMutability":"nonpayable"},
  {"type":"function","name":"ADMIN_ROLE","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},
  {"type":"function","name":"DEFAULT_ADMIN_ROLE","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},
  {"type":"function","name":"ORGANIZER_ROLE","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},
  {"type":"function","name":"REGULAR_ID","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
  {"type":"function","name":"VIP_ID","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
  {"type":"function","name":"VVIP_ID","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
  {"type":"function","name":"balanceOf","inputs":[{"name":"account","type":"address","internalType":"address"},{"name":"id","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
  {"type":"function","name":"balanceOfBatch","inputs":[{"name":"accounts","type":"address[]","internalType":"address[]"},{"name":"ids","type":"uint256[]","internalType":"uint256[]"}],"outputs":[{"name":"","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"view"},
  {"type":"function","name":"cancelTicket","inputs":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},
  {"type":"function","name":"configureTier","inputs":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"maxSupply","type":"uint256","internalType":"uint256"},{"name":"price","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},
  {"type":"function","name":"getBalance","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
  {"type":"function","name":"mintTicket","inputs":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"payable"},
  {"type":"function","name":"pause","inputs":[],"outputs":[],"stateMutability":"nonpayable"},
  {"type":"function","name":"supportsInterface","inputs":[{"name":"interfaceId","type":"bytes4","internalType":"bytes4"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},
  {"type":"function","name":"tierInfo","inputs":[{"name":"tierId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"maxSupply","type":"uint256","internalType":"uint256"},{"name":"currentSupply","type":"uint256","internalType":"uint256"},{"name":"price","type":"uint256","internalType":"uint256"},{"name":"active","type":"bool","internalType":"bool"}],"stateMutability":"view"},
  {"type":"function","name":"totalSupply","inputs":[{"name":"id","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
  {"type":"function","name":"unpause","inputs":[],"outputs":[],"stateMutability":"nonpayable"},
  {"type":"function","name":"updatePrice","inputs":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"newPrice","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},
  {"type":"function","name":"uri","inputs":[{"name":"id","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},
  {"type":"function","name":"withdraw","inputs":[],"outputs":[],"stateMutability":"nonpayable"},
  {"type":"event","name":"FundsWithdrawn","anonymous":false,"inputs":[{"indexed":true,"name":"admin","type":"address","internalType":"address"},{"indexed":false,"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[]},
  {"type":"event","name":"PriceUpdated","anonymous":false,"inputs":[{"indexed":true,"name":"tierId","type":"uint256","internalType":"uint256"},{"indexed":false,"name":"newPrice","type":"uint256","internalType":"uint256}],"outputs":[]},
  {"type":"event","name":"TicketMinted","anonymous":false,"inputs":[{"indexed":true,"name":"buyer","type":"address","internalType":"address"},{"indexed":true,"name":"tokenId","type":"uint256","internalType":"uint256"},{"indexed":false,"name":"amount","type":"uint256","internalType":"uint256"},{"indexed":false,"name":"totalPrice","type":"uint256","internalType":"uint256}],"outputs":[]},
  {"type":"event","name":"TierConfigured","anonymous":false,"inputs":[{"indexed":true,"name":"tokenId","type":"uint256","internalType":"uint256"},{"indexed":false,"name":"maxSupply","type":"uint256","internalType":"uint256"},{"indexed":false,"name":"price","type":"uint256","internalType":"uint256}],"outputs":[]}
] as const;

// ============================================================
// CHAIN CONSTANTS
// ============================================================
export const BASE_SEPOLIA_CHAIN_ID = 84532;

export const BASE_SEPOLIA: Chain = {
  id: BASE_SEPOLIA_CHAIN_ID,
  name: 'Base Sepolia',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://sepolia.base.org'] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://sepolia.base.org/explorers' },
  },
  testnet: true,
};

// ============================================================
// MINTED COUNTS (per tier)
// ============================================================
export const TICKET_TIERS = {
  regular: { id: 1n, priceEth: '0.001', maxSupply: 1000 },
  vip: { id: 2n, priceEth: '0.003', maxSupply: 500 },
  vvip: { id: 3n, priceEth: '0.01', maxSupply: 100 },
} as const;