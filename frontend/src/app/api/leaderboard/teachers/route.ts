import { NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { LeaderboardPeriod } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') as LeaderboardPeriod) || 'all-time';
    const search = searchParams.get('search') || '';
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const userId = searchParams.get('userId') || request.headers.get('x-user-id') || undefined;

    // Strict Scope: Only teachers are ranked in this category
    const result = store.getTeacherLeaderboard(period, search, page, limit, userId);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch teacher leaderboard' },
      { status: 500 }
    );
  }
}
