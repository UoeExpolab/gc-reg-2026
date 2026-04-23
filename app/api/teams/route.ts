import { NextResponse } from 'next/server';
import base from '@/lib/airtable';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const records = await base('Teams').select().all();

    const teams = records.map(record => ({
      id: record.id,
      name: record.get('Team Name') as string,
      project: record.get('Project Name') as string,
      group: record.get('Group Number') as string,
      challenge: record.get('Challenges') as string[] // array of linked ids
    }));

    return NextResponse.json({ teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamName, studentIds, challengeId, projectName, projectDescription } = body;

    if (!teamName || !studentIds || studentIds.length === 0 || !challengeId || !projectName) {
      return NextResponse.json({ error: 'Team name, students, challenge, and project name are required' }, { status: 400 });
    }

    // Auto-calculate the next group number for this challenge
    const allTeams = await base('Teams').select().all();
    let maxGroupNumber = 0;
    
    allTeams.forEach(team => {
      const teamChallenges = team.get('Challenges') as string[] | undefined;
      if (teamChallenges && teamChallenges.includes(challengeId)) {
        const gNumRaw = team.get('Group Number') as string | undefined;
        if (gNumRaw) {
          // Strip any non-numeric prefix (e.g. 'FF1' -> 1)
          const numericPart = parseInt(gNumRaw.replace(/^[^0-9]*/,''), 10);
          if (!isNaN(numericPart) && numericPart > maxGroupNumber) {
            maxGroupNumber = numericPart;
          }
        }
      }
    });
    
    const assignedNumber = maxGroupNumber + 1;

    // Fetch the challenge abbreviation to prefix the group number
    const challengeRecord = await base('Challenges').find(challengeId);
    const abbreviation = (challengeRecord.get('Abbreviation') as string) || '';
    const assignedGroupNumber = `${abbreviation}${assignedNumber}`;

    const fields: any = {
      "Team Name": teamName,
      "Students": studentIds,
      "Challenges": [challengeId],
      "Group Number": assignedGroupNumber,
      "Project Name": projectName,
    };
    if (projectDescription) fields["Project  Description"] = projectDescription;

    const newTeam = await base('Teams').create([{ fields }]);

    // Also link the selected students to the Challenge record
    try {
      const challengeRecord = await base('Challenges').find(challengeId);
      const existingStudents = (challengeRecord.get('Students') as string[]) || [];
      const mergedStudents = Array.from(new Set([...existingStudents, ...studentIds]));
      await base('Challenges').update(challengeId, { "Students": mergedStudents });
    } catch (linkErr) {
      // Non-fatal: team was created, just log the link failure
      console.warn('Could not link students to challenge:', linkErr);
    }

    return NextResponse.json({ success: true, teamId: newTeam[0].id, groupNumber: assignedGroupNumber });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}
