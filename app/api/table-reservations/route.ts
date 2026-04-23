import { NextResponse } from 'next/server';
import base from '@/lib/airtable';

export async function POST(request: Request) {
  try {
    const { teamId, tableId } = await request.json();

    if (!teamId || !tableId) {
      return NextResponse.json({ error: 'Team and Table are required' }, { status: 400 });
    }

    // Check if table is already reserved
    const tableRecord = await base('Tables').find(tableId);
    if (tableRecord.get('Table Reservations') && (tableRecord.get('Table Reservations') as string[]).length > 0) {
      return NextResponse.json({ error: 'This table is already reserved' }, { status: 400 });
    }

    const newReservation = await base('Table Reservations').create([
      {
        fields: {
          "Table Reservation": `Res - ${tableRecord.get('Name')}`,
          "Tables": [tableId],
          "Teams": [teamId]
        }
      }
    ]);

    return NextResponse.json({ success: true, reservationId: newReservation[0].id });
  } catch (error) {
    console.error('Error creating table reservation:', error);
    return NextResponse.json({ error: 'Failed to reserve table' }, { status: 500 });
  }
}
