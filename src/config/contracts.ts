// src/config/contracts.ts
// Multi-chain contract address mapping (testnet only).
import { getAddress, type Address } from 'viem';

export const SUPPORTED_CHAIN_IDS = [11155111, 84532] as const; // Sepolia, Base Sepolia
export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number];

interface ChainConfig {
  id: SupportedChainId;
  name: string;
  shortName: string;
  contractAddress: Address;
  blockExplorer: string;
}

// Contract address per chain. Override via env:
//   NEXT_PUBLIC_CONTRACT_SEPOLIA / NEXT_PUBLIC_CONTRACT_BASE_SEPOLIA
const chainConfigs: Record<SupportedChainId, ChainConfig> = {
  [11155111]: {
    id: 11155111,
    name: 'Sepolia',
    shortName: 'Sepolia',
    contractAddress: getAddress(
      process.env.NEXT_PUBLIC_CONTRACT_SEPOLIA ||
        process.env.NEXT_PUBLIC_BLOCKPASS_ADDRESS ||
        '0x3296f5a01b1a46266c852ac5d6c8313242e4397b'
    ),
    blockExplorer: 'https://sepolia.etherscan.io',
  },
  [84532]: {
    id: 84532,
    name: 'Base Sepolia',
    shortName: 'Base Sepolia',
    contractAddress: getAddress(
      process.env.NEXT_PUBLIC_CONTRACT_BASE_SEPOLIA ||
        '0x3296f5a01b1a46266c852ac5d6c8313242e4397b'
    ),
    blockExplorer: 'https://sepolia.basescan.org',
  },
};

export function getChainConfig(chainId: number): ChainConfig | undefined {
  return chainConfigs[chainId as SupportedChainId];
}

/** Returns the deployed contract address for the active chain. */
export function getContractAddress(chainId: number): Address | undefined {
  return getChainConfig(chainId)?.contractAddress;
}

export function getChainName(chainId: number): string | undefined {
  return getChainConfig(chainId)?.name;
}
