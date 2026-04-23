import { NextResponse } from 'next/server';
import base from '@/lib/airtable';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const records = await base('Students').select().all();

    const students = records.map(record => ({
      id: record.id,
      name: (record.get('Name') as string) || (record.get('Email') as string) || `Student ${record.get('ID')}`,
    }));

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
