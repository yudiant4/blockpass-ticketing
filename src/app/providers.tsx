'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia, baseSepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

// WalletConnect Project ID — optional for injected/MetaMask-only local use
const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  '00000000000000000000000000000000';

const wallets = projectId && projectId !== '00000000000000000000000000000000'
  ? [injectedWallet, metaMaskWallet, walletConnectWallet]
  : [injectedWallet, metaMaskWallet];

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets,
    },
  ],
  { projectId, appName: 'Blockpass' }
);

const sepoliaRpc =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC || 'https://ethereum-sepolia-rpc.publicnode.com';
const baseSepoliaRpc =
  process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org';

export const config = createConfig({
  connectors,
  chains: [baseSepolia, sepolia],
  transports: {
    [baseSepolia.id]: http(baseSepoliaRpc),
    [sepolia.id]: http(sepoliaRpc),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()} initialChain={baseSepolia}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
