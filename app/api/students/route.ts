import { NextResponse } from 'next/server';
import base from '@/lib/airtable';

export const dynamic = 'force-dynamic';

function normalizeLookupKey(value: string) {
  return value.trim().toLowerCase();
}

function getChallengeIds(value: unknown, challengeLookup: Map<string, string>) {
  const values = Array.isArray(value) ? value : [value];

  return values.flatMap(item => {
    if (typeof item !== 'string') return [];

    const cleanItem = item.trim();
    if (!cleanItem) return [];

    return [challengeLookup.get(normalizeLookupKey(cleanItem)) || cleanItem];
  });
}

export async function GET() {
  try {
    const [teamRecords, challengeRecords, records] = await Promise.all([
      base('Teams').select().all(),
      base('Challenges').select().all(),
      base('Students').select().all(),
    ]);

    const assignedStudentIds = new Set<string>();
    const studentChallengeIds = new Map<string, Set<string>>();
    const challengeLookup = new Map<string, string>();

    teamRecords.forEach(team => {
      const students = team.get('Students') as string[] | undefined;
      if (students) {
        students.forEach(id => assignedStudentIds.add(id));
      }
    });

    challengeRecords.forEach(challenge => {
      [challenge.id, challenge.get('Name'), challenge.get('Abbreviation')].forEach(value => {
        if (typeof value === 'string' && value.trim()) {
          challengeLookup.set(normalizeLookupKey(value), challenge.id);
        }
      });

      const linkedStudents = challenge.get('Students') as string[] | undefined;
      if (!linkedStudents) return;

      linkedStudents.forEach(studentId => {
        const existing = studentChallengeIds.get(studentId) || new Set<string>();
        existing.add(challenge.id);
        studentChallengeIds.set(studentId, existing);
      });
    });

    const students = records
      .map(record => {
        const directChallengeIds = [
          ...getChallengeIds(record.get('Challenges'), challengeLookup),
          ...getChallengeIds(record.get('Challenge'), challengeLookup),
        ];
        const challengeIds = Array.from(new Set([
          ...directChallengeIds,
          ...Array.from(studentChallengeIds.get(record.id) || []),
        ]));

        return {
          id: record.id,
          name: (record.get('Name') as string) || (record.get('Email') as string) || `Student ${record.get('ID')}`,
          challengeIds,
          inTeam: assignedStudentIds.has(record.id)
        };
      })
      .filter(s => !s.inTeam) // Only return students not in teams
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
