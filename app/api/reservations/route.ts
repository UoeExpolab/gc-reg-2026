import { NextResponse } from 'next/server';
import base from '@/lib/airtable';
import { validateBrowserRequest } from '@/lib/utils';
import {
  checkInventoryAvailability,
  formatAvailabilityError,
  normalizeInventoryIds,
  normalizeRequestedQuantity,
} from '@/lib/inventory-availability';

export async function POST(request: Request) {
  // Validate that this is a legitimate browser request
  if (!validateBrowserRequest(request)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 403 });
  }

  try {
    const {
      teamId,
      inventoryIds: rawInventoryIds,
      timeSlotId: rawTimeSlotId,
      quantityRequested: rawQuantityRequested,
    } = await request.json();
    const inventoryIds = normalizeInventoryIds(rawInventoryIds);
    const timeSlotId = typeof rawTimeSlotId === 'string' ? rawTimeSlotId : '';
    const quantityRequested = normalizeRequestedQuantity(rawQuantityRequested);

    if (!teamId || !inventoryIds || inventoryIds.length === 0 || !timeSlotId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const availability = await checkInventoryAvailability({
      inventoryIds,
      timeSlotId,
      quantityRequested,
    });

    if (!availability.available) {
      return NextResponse.json(
        {
          error: formatAvailabilityError(availability),
          availability,
        },
        { status: 409 }
      );
    }

    // 2. Create the reservation
    const reservation = await base('Inventory Reservations').create([
      {
        fields: {
          "Inventory": inventoryIds,
          "Time Slots": [timeSlotId],
          "Booked By": [teamId],
          "Quantity Requested": quantityRequested
        }
      }
    ]);

    return NextResponse.json({ success: true, reservationId: reservation[0].id });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}
