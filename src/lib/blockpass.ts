import { createPublicClient, http, parseEther, formatEther } from 'viem';
import { BLOCKPASS_TICKET_ADDRESS, BLOCKPASS_TICKET_ABI, BASE_SEPOLIA, TIER_PRICES, TIER_NAMES } from '../config/contracts';

export const publicClient = createPublicClient({
  chain: BASE_SEPOLIA,
  transport: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org'),
});

export { BLOCKPASS_TICKET_ADDRESS, BLOCKPASS_TICKET_ABI, TIER_PRICES, TIER_NAMES };

/** Check whether `owner` holds at least one of tokenId */
export async function verifyTicket(tokenId: number, owner: `0x${string}`) {
  const bal = await publicClient.readContract({
    address: BLOCKPASS_TICKET_ADDRESS,
    abi: BLOCKPASS_TICKET_ABI,
    functionName: 'balanceOf',
    args: [owner, BigInt(tokenId)],
  });
  return Number(bal) > 0;
}

export async function getTierInfo(tierId: number) {
  const result = await publicClient.readContract({
    address: BLOCKPASS_TICKET_ADDRESS,
    abi: BLOCKPASS_TICKET_ABI,
    functionName: 'tiers',
    args: [BigInt(tierId)],
  }) as [bigint, bigint, bigint, boolean];

  const [maxSupply, currentSupply, price, active] = result;
  return {
    maxSupply: Number(maxSupply),
    currentSupply: Number(currentSupply),
    priceWei: price,
    priceEth: formatEther(price),
    active,
  };
}

export async function getOwnedBalances(owner: `0x${string}`) {
  const ids = [1, 2, 3] as const;
  const balances = await Promise.all(
    ids.map(async (id) => {
      const bal = await publicClient.readContract({
        address: BLOCKPASS_TICKET_ADDRESS,
        abi: BLOCKPASS_TICKET_ABI,
        functionName: 'balanceOf',
        args: [owner, BigInt(id)],
      });
      return { tierId: id, name: TIER_NAMES[id], balance: Number(bal) };
    })
  );
  return balances.filter((b) => b.balance > 0);
}

export function priceForTier(tierId: number, amount = 1): bigint {
  const eth = TIER_PRICES[tierId as keyof typeof TIER_PRICES] || '0.001';
  return parseEther(eth) * BigInt(amount);
}
