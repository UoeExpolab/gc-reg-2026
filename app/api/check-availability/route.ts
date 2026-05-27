import { NextResponse } from "next/server";
import { validateBrowserRequest } from "@/lib/request-security";
import {
  checkInventoryAvailability,
  formatAvailabilityError,
  normalizeInventoryIds,
  normalizeRequestedQuantity,
} from "@/lib/inventory-availability";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!validateBrowserRequest(request)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 403 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payload = body as {
    inventoryId?: unknown;
    inventoryIds?: unknown;
    timeSlotId?: unknown;
    quantityRequested?: unknown;
  };
  const inventoryIds = normalizeInventoryIds(payload.inventoryIds ?? payload.inventoryId);
  const timeSlotId = typeof payload.timeSlotId === "string" ? payload.timeSlotId : "";
  const quantityRequested = normalizeRequestedQuantity(payload.quantityRequested);

  if (inventoryIds.length === 0 || !timeSlotId) {
    return NextResponse.json(
      { error: "Inventory and time slot are required" },
      { status: 400 }
    );
  }

  if (inventoryIds.length > 1) {
    return NextResponse.json(
      { error: "Only one inventory item can be reserved at a time" },
      { status: 400 }
    );
  }

  try {
    const availability = await checkInventoryAvailability({
      inventoryIds,
      timeSlotId,
      quantityRequested,
    });

    return NextResponse.json({
      ...availability,
      error: availability.available ? undefined : formatAvailabilityError(availability),
    });
  } catch (error) {
    console.error("Error checking inventory availability:", error);
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  }
}
