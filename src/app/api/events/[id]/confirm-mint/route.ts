import { NextRequest, NextResponse } from 'next/server';
import { confirmMint } from '@/lib/eventStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { tierId, quantity = 1, txHash } = body;
    if (!tierId) {
      return NextResponse.json({ status: 'error', message: 'tierId wajib' }, { status: 400 });
    }

    const result = await confirmMint(params.id, tierId, Number(quantity) || 1, txHash);
    if ('error' in result) {
      return NextResponse.json({ status: 'error', message: result.error }, { status: result.status });
    }

    return NextResponse.json({ status: 'success', data: result.data });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
