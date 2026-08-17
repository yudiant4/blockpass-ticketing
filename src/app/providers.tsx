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
import { sepolia, mainnet, foundry } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

// WalletConnect Project ID. Make sure NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID exists in .env.local
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error(
    'Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID. Add it to .env.local or set it in your environment.'
  );
}

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      // Pass wallet functions (not invoked) — RainbowKit injects connectors at mount
      wallets: [injectedWallet, metaMaskWallet, walletConnectWallet],
    },
  ],
  { projectId, appName: 'TicketPro' }
);

const sepoliaRpc = process.env.NEXT_PUBLIC_SEPOLIA_RPC || 'https://ethereum-sepolia-rpc.publicnode.com';
const forkRpc = process.env.NEXT_PUBLIC_FORK_RPC;

export const config = createConfig({
  connectors,
  chains: [sepolia, foundry, mainnet],
  transports: {
    [sepolia.id]: http(forkRpc ?? sepoliaRpc),
    [foundry.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}