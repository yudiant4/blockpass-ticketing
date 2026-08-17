'use client';

import { getAddress, type Abi } from 'viem';
import abi from '../contracts/BlockpassTicketAbi.json';

export const BLOCKPASS_ADDRESS = getAddress(
  process.env.NEXT_PUBLIC_BLOCKPASS_ADDRESS ||
    '0x3296f5a01b1a46266c852ac5d6c8313242e4397b'
);

export const BLOCKPASS_ABI: Abi = (abi as { abi: Abi }).abi;
