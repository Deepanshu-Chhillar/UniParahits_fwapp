import { NextResponse } from 'next/server';
import { INITIAL_USERS, INITIAL_STUDENT_PROFILES } from '@/lib/data/initialData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');
  const rank = searchParams.get('rank');

  let users = [...INITIAL_USERS];

  if (role) {
    users = users.filter(u => u.role.toLowerCase() === role.toLowerCase());
  }
  if (rank) {
    users = users.filter(u => {
      const profile = INITIAL_STUDENT_PROFILES[u.id];
      return (u.rank === rank.toUpperCase()) || (profile?.currentRank === rank.toUpperCase());
    });
  }

  const enrichedUsers = users.map(u => {
    const studentProfile = INITIAL_STUDENT_PROFILES[u.id];
    return {
      ...u,
      studentDetails: studentProfile || null
    };
  });

  return NextResponse.json({
    success: true,
    count: enrichedUsers.length,
    data: enrichedUsers
  });
}
