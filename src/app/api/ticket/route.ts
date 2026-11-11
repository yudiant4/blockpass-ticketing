import { NextRequest, NextResponse } from 'next/server';
import { getTierInfo, verifyTicket, getOwnedBalances } from '@/lib/blockpass';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/ticket?wallet=0x..&tokenId=1  — verify ownership
 * GET /api/ticket?wallet=0x..            — list owned tier balances
 *
 * Minting is client-side via wagmi (never send private keys to the API).
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get('wallet');
    const tokenId = searchParams.get('tokenId');

    if (!wallet) {
      return NextResponse.json({ success: false, error: 'wallet diperlukan' }, { status: 400 });
    }

    if (tokenId) {
      const isValid = await verifyTicket(parseInt(tokenId, 10), wallet as `0x${string}`);
      return NextResponse.json({ success: true, data: { valid: isValid, wallet, tokenId } });
    }

    const balances = await getOwnedBalances(wallet as `0x${string}`);
    return NextResponse.json({ success: true, data: { wallet, balances } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Gagal baca tiket' }, { status: 500 });
  }
}

/** POST /api/ticket — return on-chain tier quote (no mint) */
export async function POST(req: NextRequest) {
  try {
    const { tierId, amount = 1 } = await req.json();
    if (![1, 2, 3].includes(tierId)) {
      return NextResponse.json({ success: false, error: 'Tier tidak valid' }, { status: 400 });
    }
    if (amount <= 0 || amount > 10) {
      return NextResponse.json({ success: false, error: 'Jumlah tidak valid' }, { status: 400 });
    }

    const info = await getTierInfo(tierId);
    if (!info.active) {
      return NextResponse.json({ success: false, error: 'Tier tidak aktif' }, { status: 400 });
    }
    if (info.currentSupply + amount > info.maxSupply) {
      return NextResponse.json({ success: false, error: 'Supply habis' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        tierId,
        amount,
        priceEth: info.priceEth,
        totalEth: (Number(info.priceEth) * amount).toString(),
        remaining: info.maxSupply - info.currentSupply,
        mintHint: 'Gunakan wagmi writeContract mintTicket dari browser wallet — jangan kirim private key ke server.',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Gagal quote' }, { status: 500 });
  }
}
