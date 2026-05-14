import { NextResponse } from 'next/server';
import base from '@/lib/airtable';
import { validateBrowserRequest } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch all teams to identify which students are already assigned
    const teamRecords = await base('Teams').select().all();
    const assignedStudentIds = new Set<string>();
    
    teamRecords.forEach(team => {
      const students = team.get('Students') as string[] | undefined;
      if (students) {
        students.forEach(id => assignedStudentIds.add(id));
      }
    });

    // Fetch all students
    const records = await base('Students').select().all();

    const students = records
      .map(record => ({
        id: record.id,
        name: (record.get('Name') as string) || (record.get('Email') as string) || `Student ${record.get('ID')}`,
        inTeam: assignedStudentIds.has(record.id)
      }))
      .filter(s => !s.inTeam); // Only return students not in teams

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
