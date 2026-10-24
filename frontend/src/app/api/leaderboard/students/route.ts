import { NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { LeaderboardPeriod } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') as LeaderboardPeriod) || 'all-time';
    const search = searchParams.get('search') || '';
    const rank = searchParams.get('rank') || 'ALL';
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const userId = searchParams.get('userId') || request.headers.get('x-user-id') || undefined;

    // Strict Scope: Only students are ranked in this category
    const result = store.getStudentLeaderboard(period, search, rank, page, limit, userId);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch student leaderboard' },
      { status: 500 }
    );
  }
}
