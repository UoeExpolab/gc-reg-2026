import { NextResponse } from 'next/server';
import base from '@/lib/airtable';
import { validateApiReadRequest } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!validateApiReadRequest(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const records = await base('Inventory').select({
      fields: ['Name', 'Total'],
    }).all();

    const inventory = records.map(record => ({
      id: record.id,
      name: record.get('Name') as string,
      total: Number(record.get('Total') || 0),
    })).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

    return NextResponse.json({ inventory });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}
