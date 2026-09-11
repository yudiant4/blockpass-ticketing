import { NextRequest, NextResponse } from 'next/server';

// GET /api/events - List all events
export async function GET(req: NextRequest) {
  // TODO: Fetch from MongoDB
  const events = [
    {
      id: '1',
      title: 'Web3 Dev Connect',
      date: '2025-01-20',
      time: '10:00 - 18:00',
      location: 'Hotel Indonesia, Jakarta',
      isActive: true,
    },
  ];
  
  return NextResponse.json({ success: true, data: events });
}

// POST /api/events - Create new event (organizer only)
export async function POST(req: NextRequest) {
  // TODO: Validate organizer role via JWT
  const body = await req.json();
  
  const event = {
    id: Date.now().toString(),
    ...body,
    createdAt: new Date(),
    isActive: true,
  };
  
  // TODO: Save to MongoDB
  
  return NextResponse.json({ success: true, data: event });
}