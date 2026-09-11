import { NextResponse } from 'next/server';
import { verifyTicket } from '../../../lib/blockpass';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get('wallet');
  const tokenId = searchParams.get('tokenId');

  if (!wallet || !tokenId) {
    return NextResponse.json({ success: false, error: 'wallet dan tokenId diperlukan' }, { status: 400 });
  }

  try {
    const isValid = await verifyTicket(parseInt(tokenId), wallet as `0x${string}`);
    return NextResponse.json({ success: true, data: { valid: isValid, wallet, tokenId } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}