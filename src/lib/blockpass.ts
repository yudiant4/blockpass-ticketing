'use client';

import { getAddress, type Abi } from 'viem';
import abi from '../contracts/BlockpassTicketAbi.json';

// Contract address: Base Sepolia deployment of BlockpassTicket (ERC-1155)
// Override via NEXT_PUBLIC_CONTRACT_BASE_SEPOLIA or NEXT_PUBLIC_BLOCKPASS_ADDRESS
export const BLOCKPASS_ADDRESS = getAddress(
  process.env.NEXT_PUBLIC_CONTRACT_BASE_SEPOLIA ||
    process.env.NEXT_PUBLIC_BLOCKPASS_ADDRESS ||
    '0xbdb5f9745Db186C25424fA0EC5b81009980B87c2'
);

export const BLOCKPASS_ABI: Abi = (abi as { abi: Abi }).abi;