import { NextRequest, NextResponse } from 'next/server';
import { buyIntent } from '@/lib/eventStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { tierId, wallet, quantity = 1 } = body;
    if (!tierId || !wallet) {
      return NextResponse.json(
        { status: 'error', message: 'tierId & wallet wajib' },
        { status: 400 }
      );
    }

    const result = await buyIntent(params.id, tierId, wallet, Number(quantity) || 1);
    if ('error' in result) {
      return NextResponse.json({ status: 'error', message: result.error }, { status: result.status });
    }

    return NextResponse.json({ status: 'success', data: result.data });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
