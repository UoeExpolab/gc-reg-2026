import { NextResponse } from 'next/server';
import base from '@/lib/airtable';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const itemIdsStr = searchParams.get('itemIds');
  const itemIds = itemIdsStr ? itemIdsStr.split(',') : [];

  if (itemIds.length === 0) {
    return NextResponse.json({ error: 'Missing itemIds parameter' }, { status: 400 });
  }

  try {
    // 1. Fetch all time slots
    const timeSlotsRecords = await base('Time Slots').select().all();
    const timeSlots = timeSlotsRecords.map(record => ({
      id: record.id,
      name: (record.get('Slot Name/Time') || record.get('Name') || record.get('Slot Name') || 'Unnamed Slot') as string,
    }));

    // 2. Fetch all reservations
    const reservationsRecords = await base('Inventory Reservations').select().all();
    
    // Find all time slot IDs that are already booked for ANY of the requested itemIds
    const bookedTimeSlotIds = new Set<string>();
    
    reservationsRecords.forEach(record => {
      const inventoryLinks = record.get('Inventory') as string[] | undefined;
      const timeSlotLinks = record.get('Time Slots') as string[] | undefined;
      
      if (inventoryLinks && timeSlotLinks) {
        const hasOverlap = itemIds.some(id => inventoryLinks.includes(id));
        if (hasOverlap) {
          timeSlotLinks.forEach(tsId => bookedTimeSlotIds.add(tsId));
        }
      }
    });

    // 3. Filter available time slots
    const availableTimeSlots = timeSlots.filter(ts => !bookedTimeSlotIds.has(ts.id));

    return NextResponse.json({ availableTimeSlots });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}
