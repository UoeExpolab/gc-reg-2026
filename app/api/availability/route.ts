import { NextResponse } from 'next/server';
import base from '@/lib/airtable';
import {
  checkInventoryAvailabilityForTimeSlots,
  normalizeInventoryIds,
} from '@/lib/inventory-availability';
import { validateApiReadRequest } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!validateApiReadRequest(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const itemIdsStr = searchParams.get('itemIds');
  const itemIds = normalizeInventoryIds(itemIdsStr);

  if (itemIds.length === 0) {
    return NextResponse.json({ error: 'Missing itemIds parameter' }, { status: 400 });
  }

  if (itemIds.length > 1) {
    return NextResponse.json({ error: 'Only one inventory item can be checked at a time' }, { status: 400 });
  }

  try {
    // 1. Fetch all time slots
    const timeSlotsRecords = await base('Time Slots').select().all();
    const timeSlots = timeSlotsRecords.map(record => ({
      id: record.id,
      name: (record.get('Slot Name/Time') || record.get('Name') || record.get('Slot Name') || 'Unnamed Slot') as string,
    }));

    const timeSlotNamesById = new Map(timeSlots.map(ts => [ts.id, ts.name]));
    const availabilityByTimeSlot = await checkInventoryAvailabilityForTimeSlots({
      inventoryIds: itemIds,
      timeSlotIds: timeSlots.map(ts => ts.id),
      quantityRequested: 1,
      timeSlotNamesById,
    });

    const availabilityByTimeSlotId = new Map(
      availabilityByTimeSlot.map(availability => [availability.timeSlotId, availability])
    );
    const availableTimeSlots = timeSlots.flatMap(ts => {
      const availability = availabilityByTimeSlotId.get(ts.id);

      if (!availability?.available) {
        return [];
      }

      return [{
        ...ts,
        remainingAvailable: availability.remainingAvailable,
      }];
    });

    return NextResponse.json({ availableTimeSlots });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}
