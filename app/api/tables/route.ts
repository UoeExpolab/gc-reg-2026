import { NextResponse } from 'next/server';
import base from '@/lib/airtable';
import { validateApiReadRequest } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!validateApiReadRequest(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const records = await base('Tables').select().all();

    const tables = records.map(record => ({
      id: record.id,
      name: record.get('Name') as string,
      reserved: (record.get('Table Reservations') as string[])?.length > 0,
      notes: record.get('Notes') as string || "",
      reservedChallenge: record.get('Reserved Challenge') as string[] || []
    }));

    return NextResponse.json({ tables });
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 });
  }
}
