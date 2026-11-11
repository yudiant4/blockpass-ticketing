import { NextRequest, NextResponse } from 'next/server';
import { createEvent, listEvents } from '@/lib/eventStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ADMIN_HEADER = 'x-admin-wallet';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const result = await listEvents({
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '20', 10),
      status: searchParams.get('status') || undefined,
      category: searchParams.get('category') || undefined,
      q: searchParams.get('q') || undefined,
    });
    return NextResponse.json({ status: 'success', ...result });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: 'Gagal fetch events', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const wallet = req.headers.get(ADMIN_HEADER);
    if (!wallet) {
      return NextResponse.json(
        { status: 'error', message: 'Forbidden: admin wallet required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, slug, category, startDate, endDate, location, bannerUrl, description, tiers, network } = body;

    if (!title || !slug || !category || !startDate || !endDate || !location || !tiers?.length) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Parameter wajib: title, slug, category, startDate, endDate, location, tiers[]',
        },
        { status: 400 }
      );
    }

    const totalQuota = tiers.reduce((sum: number, t: any) => sum + (t.quota || 0), 0);
    if (totalQuota < 1) {
      return NextResponse.json({ status: 'error', message: 'Total quota minimal 1' }, { status: 400 });
    }

    const event = await createEvent({
      title,
      slug,
      category,
      startDate,
      endDate,
      location,
      bannerUrl,
      description,
      createdBy: wallet,
      tiers,
      network,
      status: 'Published',
    });

    return NextResponse.json({ status: 'success', data: event }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ status: 'error', message: 'Slug sudah digunakan' }, { status: 409 });
    }
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
