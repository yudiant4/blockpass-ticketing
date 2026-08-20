'use client';

import { getAddress, type Abi } from 'viem';
import abi from '../contracts/BlockpassTicketAbi.json';

// Base Sepolia deployment (default fallback)
export const BLOCKPASS_ADDRESS = getAddress(
  process.env.NEXT_PUBLIC_CONTRACT_BASE_SEPOLIA ||
    '0xbdb5f9745Db186C25424fA0EC5b81009980B87c2'
);

export const BLOCKPASS_ABI: Abi = (abi as { abi: Abi }).abi;