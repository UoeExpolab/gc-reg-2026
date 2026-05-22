import base from "@/lib/airtable";

const DEFAULT_QUANTITY_REQUESTED = 1;

export interface InventoryAvailabilityItem {
  itemId: string;
  itemName: string;
  total: number;
  totalAlreadyBooked: number;
  quantityRequested: number;
  remaining: number;
  available: boolean;
}

export interface InventoryAvailabilityResult {
  timeSlotId: string;
  timeSlotName: string;
  available: boolean;
  remainingAvailable: number;
  items: InventoryAvailabilityItem[];
}

interface CheckInventoryAvailabilityForTimeSlotsInput {
  inventoryIds: string[];
  timeSlotIds: string[];
  quantityRequested?: number;
  timeSlotNamesById?: Map<string, string> | Record<string, string>;
}

interface CheckInventoryAvailabilityInput {
  inventoryIds: string[];
  timeSlotId: string;
  quantityRequested?: number;
  timeSlotName?: string;
}

export function normalizeInventoryIds(value: unknown): string[] {
  const rawIds = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];

  return Array.from(
    new Set(
      rawIds
        .map(id => (typeof id === "string" ? id.trim() : ""))
        .filter(Boolean)
    )
  );
}

export function normalizeRequestedQuantity(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_QUANTITY_REQUESTED;
  }

  return Math.ceil(parsed);
}

export function formatAvailabilityError(result: InventoryAvailabilityResult): string {
  const unavailableItems = result.items.filter(item => !item.available);
  const slotName = result.timeSlotName || "this time slot";

  if (unavailableItems.length === 1) {
    const item = unavailableItems[0];
    const units = item.remaining === 1 ? "unit" : "units";
    return `Only ${item.remaining} ${units} available for ${slotName}`;
  }

  const remainingByItem = unavailableItems
    .map(item => `${item.itemName}: ${item.remaining}`)
    .join(", ");

  return `Not enough units available for ${slotName}. Remaining: ${remainingByItem}`;
}

export async function checkInventoryAvailability({
  inventoryIds,
  timeSlotId,
  quantityRequested,
  timeSlotName,
}: CheckInventoryAvailabilityInput): Promise<InventoryAvailabilityResult> {
  const results = await checkInventoryAvailabilityForTimeSlots({
    inventoryIds,
    timeSlotIds: [timeSlotId],
    quantityRequested,
    timeSlotNamesById: timeSlotName ? { [timeSlotId]: timeSlotName } : undefined,
  });

  return results[0];
}

export async function checkInventoryAvailabilityForTimeSlots({
  inventoryIds,
  timeSlotIds,
  quantityRequested,
  timeSlotNamesById,
}: CheckInventoryAvailabilityForTimeSlotsInput): Promise<InventoryAvailabilityResult[]> {
  const normalizedInventoryIds = normalizeInventoryIds(inventoryIds);
  const normalizedTimeSlotIds = normalizeInventoryIds(timeSlotIds);
  const requestedQuantity = normalizeRequestedQuantity(quantityRequested);

  const [inventoryItemsById, timeSlotNames, reservationRecords] = await Promise.all([
    loadInventoryItems(normalizedInventoryIds),
    loadTimeSlotNames(normalizedTimeSlotIds, timeSlotNamesById),
    base("Inventory Reservations").select({
      fields: ["Inventory", "Time Slots", "Quantity Requested"],
    }).all(),
  ]);

  const inventoryIdSet = new Set(normalizedInventoryIds);
  const timeSlotIdSet = new Set(normalizedTimeSlotIds);
  const bookedBySlotAndItem = new Map<string, Map<string, number>>();

  normalizedTimeSlotIds.forEach(timeSlotId => {
    bookedBySlotAndItem.set(
      timeSlotId,
      new Map(normalizedInventoryIds.map(inventoryId => [inventoryId, 0]))
    );
  });

  reservationRecords.forEach(record => {
    const reservationInventoryIds = toStringArray(record.get("Inventory"))
      .filter(inventoryId => inventoryIdSet.has(inventoryId));
    const reservationTimeSlotIds = toStringArray(record.get("Time Slots"))
      .filter(slotId => timeSlotIdSet.has(slotId));

    if (reservationInventoryIds.length === 0 || reservationTimeSlotIds.length === 0) {
      return;
    }

    const bookedQuantity = getReservationQuantity(record.get("Quantity Requested"));

    reservationTimeSlotIds.forEach(timeSlotId => {
      const bookedByItem = bookedBySlotAndItem.get(timeSlotId);
      if (!bookedByItem) return;

      reservationInventoryIds.forEach(inventoryId => {
        bookedByItem.set(inventoryId, (bookedByItem.get(inventoryId) || 0) + bookedQuantity);
      });
    });
  });

  return normalizedTimeSlotIds.map(timeSlotId => {
    const bookedByItem = bookedBySlotAndItem.get(timeSlotId) || new Map<string, number>();
    const items = normalizedInventoryIds.map(itemId => {
      const inventoryItem = inventoryItemsById.get(itemId);
      const total = inventoryItem?.total || 0;
      const totalAlreadyBooked = bookedByItem.get(itemId) || 0;
      const remaining = Math.max(0, total - totalAlreadyBooked);

      return {
        itemId,
        itemName: inventoryItem?.name || itemId,
        total,
        totalAlreadyBooked,
        quantityRequested: requestedQuantity,
        remaining,
        available: remaining >= requestedQuantity,
      };
    });

    return {
      timeSlotId,
      timeSlotName: timeSlotNames.get(timeSlotId) || "this time slot",
      available: items.every(item => item.available),
      remainingAvailable: items.length
        ? Math.min(...items.map(item => item.remaining))
        : 0,
      items,
    };
  });
}

async function loadInventoryItems(inventoryIds: string[]) {
  const records = await Promise.all(inventoryIds.map(id => base("Inventory").find(id)));

  return new Map(
    records.map(record => [
      record.id,
      {
        name: coerceText(record.get("Name"), record.id),
        total: coerceNumber(record.get("Total")),
      },
    ])
  );
}

async function loadTimeSlotNames(
  timeSlotIds: string[],
  providedNames?: Map<string, string> | Record<string, string>
) {
  const names = new Map<string, string>();

  timeSlotIds.forEach(timeSlotId => {
    const providedName = getProvidedTimeSlotName(providedNames, timeSlotId);
    if (providedName) {
      names.set(timeSlotId, providedName);
    }
  });

  const missingTimeSlotIds = timeSlotIds.filter(timeSlotId => !names.has(timeSlotId));
  if (missingTimeSlotIds.length === 0) {
    return names;
  }

  const records = await Promise.all(missingTimeSlotIds.map(id => base("Time Slots").find(id)));
  records.forEach(record => {
    names.set(
      record.id,
      coerceText(
        record.get("Slot Name/Time") || record.get("Name") || record.get("Slot Name"),
        record.id
      )
    );
  });

  return names;
}

function getProvidedTimeSlotName(
  providedNames: Map<string, string> | Record<string, string> | undefined,
  timeSlotId: string
) {
  if (!providedNames) {
    return undefined;
  }

  return providedNames instanceof Map
    ? providedNames.get(timeSlotId)
    : providedNames[timeSlotId];
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function getReservationQuantity(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_QUANTITY_REQUESTED;
  }

  return Math.ceil(parsed);
}

function coerceNumber(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function coerceText(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}
