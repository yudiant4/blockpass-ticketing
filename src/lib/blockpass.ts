import { createPublicClient, createWalletClient, http, parseEther, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { BASE_SEPOLIA, BLOCKPASS_TICKET_ADDRESS, BLOCKPASS_TICKET_ABI, TICKET_TIERS } from '../config/contracts';

// ============================================================
// PUBLIC CLIENT - Read-only from Base Sepolia
// ============================================================
export const publicClient = createPublicClient({
  chain: BASE_SEPOLIA,
  transport: http(),
});

// ============================================================
// WALLET CLIENT - For contract calls (requires private key)
// ============================================================
export function getWalletClient(privateKey: string | undefined) {
  if (!privateKey) return null;
  
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  
  return createWalletClient({
    account,
    chain: BASE_SEPOLIA,
    transport: http(),
  });
}

// ============================================================
// CONTRACT READ: Get tier info
// ============================================================
export async function getTierInfo(tierId: number) {
  const [maxSupply, currentSupply, price, active] = await publicClient.readContract({
    address: BLOCKPASS_TICKET_ADDRESS,
    abi: BLOCKPASS_TICKET_ABI,
    functionName: 'tierInfo',
    args: [BigInt(tierId)],
  });
  
  return {
    id: tierId,
    maxSupply: Number(maxSupply),
    currentSupply: Number(currentSupply),
    price: Number(price) / 1e18,
    priceWei: BigInt(price),
    active: active as boolean,
    remaining: Number(maxSupply) - Number(currentSupply),
  };
}

// ============================================================
// CONTRACT READ: Check user balance
// ============================================================
export async function getUserBalance(userAddress: `0x${string}`, tierId: number) {
  const balance = await publicClient.readContract({
    address: BLOCKPASS_TICKET_ADDRESS,
    abi: BLOCKPASS_TICKET_ABI,
    functionName: 'balanceOf',
    args: [userAddress, BigInt(tierId)],
  });
  
  return Number(balance);
}

// ============================================================
// CONTRACT READ: Check if QR code is valid
// ============================================================
export async function verifyTicket(tokenId: number, owner: `0x${string}`) {
  const balance = await publicClient.readContract({
    address: BLOCKPASS_TICKET_ADDRESS,
    abi: BLOCKPASS_TICKET_ABI,
    functionName: 'balanceOf',
    args: [owner, BigInt(tokenId)],
  });
  
  return BigInt(balance) > 0n;
}

// ============================================================
// CONTRACT WRITE: Mint ticket (requires wallet & ETH)
// ============================================================
export async function mintTicket(
  privateKey: `0x${string}`,
  tierId: number,
  amount: number
) {
  const account = privateKeyToAccount(privateKey);
  const walletClient = createWalletClient({
    account,
    chain: BASE_SEPOLIA,
    transport: http(),
  });
  
  const priceWei = BigInt(TICKET_TIERS[tierId === 1 ? 'regular' : tierId === 2 ? 'vip' : 'vvip'].priceEth) * BigInt(10**18);
  const total = priceWei * BigInt(amount);
  
  const hash = await walletClient.deployContract({
    address: BLOCKPASS_TICKET_ADDRESS,
    abi: BLOCKPASS_TICKET_ABI,
    functionName: 'mintTicket',
    args: [BigInt(tierId), BigInt(amount)],
    value: total,
  });
  
  // Wait for confirmation
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  return receipt.transactionHash;
}

// ============================================================
// CONTRACT WRITE: Burn/Cancel ticket (for refunds)
// ============================================================
export async function cancelTicket(
  privateKey: `0x${string}`,
  tierId: number,
  amount: number
) {
  const account = privateKeyToAccount(privateKey);
  const walletClient = createWalletClient({
    account,
    chain: BASE_SEPOLIA,
    transport: http(),
  });
  
  const hash = await walletClient.sendTransaction({
    address: BLOCKPASS_TICKET_ADDRESS,
    abi: BLOCKPASS_TICKET_ABI,
    functionName: 'cancelTicket',
    args: [BigInt(tierId), BigInt(amount)],
  });
  
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  return receipt.transactionHash;
}

// ============================================================
// HELPER: Get contract balance (funds withdrawal target)
// ============================================================
export async function getContractBalance() {
  const balance = await publicClient.readContract({
    address: BLOCKPASS_TICKET_ADDRESS,
    abi: BLOCKPASS_TICKET_ABI,
    functionName: 'getBalance',
  });
  
  return {
    wei: BigInt(balance),
    eth: formatEther(balance as bigint),
  };
}