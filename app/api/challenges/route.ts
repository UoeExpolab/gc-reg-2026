import { NextResponse } from 'next/server';
import base from '@/lib/airtable';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const records = await base('Challenges').select().all();

    const challenges = records.map(record => ({
      id: record.id,
      name: record.get('Name') as string,
      abbreviation: record.get('Abbreviation') as string || "",
    }));

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
  }
}
