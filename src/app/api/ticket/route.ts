import { NextRequest, NextResponse } from 'next/server';
import { publicClient, BLOCKPASS_TICKET_ADDRESS, BLOCKPASS_TICKET_ABI, verifyTicket } from '@/lib/blockpass';
import { BASE_SEPOLIA, TIER_PRICES } from '@/config/contracts';
import { privateKeyToAccount } from 'viem/accounts';

// POST /api/ticket/mint - Mint ticket
export async function POST(req: NextRequest) {
  try {
    const { privateKey, tierId, amount } = await req.json();
    if (!privateKey) return NextResponse.json({ success: false, error: 'Private key diperlukan' }, { status: 401 });
    if (![1, 2, 3].includes(tierId)) return NextResponse.json({ success: false, error: 'Tier tidak valid' }, { status: 400 });
    if (amount <= 0 || amount > 10) return NextResponse.json({ success: false, error: 'Jumlah tidak valid' }, { status: 400 });

    const tierPrices = TIER_PRICES as Record<number, string>;
    const account = privateKeyToAccount(privateKey as `0x${string}`);

    const [maxSupply, currentSupply, , active] = await publicClient.readContract({
      address: BLOCKPASS_TICKET_ADDRESS,
      abi: BLOCKPASS_TICKET_ABI,
      functionName: 'tierInfo',
      args: [BigInt(tierId)],
    }) as [bigint, bigint, bigint, boolean];
    if (!active) return NextResponse.json({ success: false, error: 'Tier tidak aktif' }, { status: 400 });
    if (currentSupply + BigInt(amount) > maxSupply) return NextResponse.json({ success: false, error: 'Supply habis' }, { status: 400 });

    const hash = await publicClient.writeContract({
      address: BLOCKPASS_TICKET_ADDRESS,
      abi: BLOCKPASS_TICKET_ABI,
      functionName: 'mintTicket',
      args: [BigInt(tierId), BigInt(amount)],
      value: BigInt(Number(tierPrices[tierId]!) * 1e18 * amount),
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    return NextResponse.json({ success: true, data: receipt.transactionHash });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Gagal mint' }, { status: 500 });
  }
}

// GET /api/ticket/verify
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get('wallet');
  const tokenId = searchParams.get('tokenId');
  if (!wallet || !tokenId) return NextResponse.json({ success: false, error: 'butuh wallet & tokenId' }, { status: 400 });
  const isValid = await verifyTicket(parseInt(tokenId), wallet as `0x${string}`);
  return NextResponse.json({ success: true, data: { valid: isValid, wallet, tokenId } });
}
