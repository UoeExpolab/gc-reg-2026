import { NextResponse } from 'next/server';
import base from '@/lib/airtable';

export async function POST(request: Request) {
  try {
    const { teamId, inventoryIds, timeSlotId } = await request.json();

    if (!teamId || !inventoryIds || inventoryIds.length === 0 || !timeSlotId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Create the reservation
    const reservation = await base('Inventory Reservations').create([
      {
        fields: {
          "Inventory": inventoryIds,
          "Time Slots": [timeSlotId],
          "Booked By": [teamId]
        }
      }
    ]);

    return NextResponse.json({ success: true, reservationId: reservation[0].id });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}
