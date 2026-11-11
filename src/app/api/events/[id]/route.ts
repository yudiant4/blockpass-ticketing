import { NextRequest, NextResponse } from 'next/server';
import { deleteEvent, getEvent } from '@/lib/eventStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ADMIN_HEADER = 'x-admin-wallet';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await getEvent(params.id);
    if (!event) {
      return NextResponse.json({ status: 'error', message: 'Acara tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ status: 'success', data: event });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const wallet = req.headers.get(ADMIN_HEADER);
    if (!wallet) {
      return NextResponse.json(
        { status: 'error', message: 'Forbidden: admin wallet required' },
        { status: 403 }
      );
    }

    const event = await getEvent(params.id);
    if (!event) {
      return NextResponse.json({ status: 'error', message: 'Acara tidak ditemukan' }, { status: 404 });
    }

    if (event.createdBy.toLowerCase() !== wallet.toLowerCase()) {
      const admin = process.env.ADMIN_WALLET;
      if (!admin || admin.toLowerCase() !== wallet.toLowerCase()) {
        return NextResponse.json(
          { status: 'error', message: 'Forbidden: bukan organizer event ini' },
          { status: 403 }
        );
      }
    }

    await deleteEvent(params.id);
    return NextResponse.json({ status: 'success', message: 'Event dihapus' });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
