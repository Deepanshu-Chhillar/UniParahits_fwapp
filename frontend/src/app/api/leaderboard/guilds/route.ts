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

    // Strict Scope: Only Guilds are ranked in this category based on collective contributions
    const result = store.getGuildLeaderboard(period, search, page, limit);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch guild leaderboard' },
      { status: 500 }
    );
  }
}
