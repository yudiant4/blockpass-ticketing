import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { BLOCKPASS_TICKET_ADDRESS, BLOCKPASS_TICKET_ABI, BASE_SEPOLIA } from '../config/contracts';

// Public client
export const publicClient = createPublicClient({
  chain: BASE_SEPOLIA,
  transport: http(),
});

export { BLOCKPASS_TICKET_ADDRESS, BLOCKPASS_TICKET_ABI };

// Verify ticket
export async function verifyTicket(tokenId: number, owner: `0x${string}`) {
  const bal = await publicClient.readContract({
    address: BLOCKPASS_TICKET_ADDRESS,
    abi: BLOCKPASS_TICKET_ABI,
    functionName: 'balanceOf',
    args: [owner, BigInt(tokenId)],
  });
  return Number(bal) > 0;
}

// Wallet client helper
export function getWalletClient(privateKey?: string) {
  if (!privateKey) return null;
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  return createWalletClient({ account, chain: BASE_SEPOLIA, transport: http() });
}