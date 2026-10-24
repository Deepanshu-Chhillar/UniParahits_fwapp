import { NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { LeaderboardPeriod } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || request.headers.get('x-user-id');
    const category = (searchParams.get('category') as 'students' | 'teachers') || 'students';
    const period = (searchParams.get('period') as LeaderboardPeriod) || 'all-time';

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
    }

    const userPosition = store.getUserLeaderboardPosition(userId, category, period);

    return NextResponse.json({
      success: true,
      userPosition,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch user leaderboard position' },
      { status: 500 }
    );
  }
}
