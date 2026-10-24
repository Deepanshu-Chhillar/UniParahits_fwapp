import { NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const limit = Number(searchParams.get('limit')) || 50;

    let events = store.getLeaderboardEvents();
    if (category) {
      events = events.filter((e) => e.category === category.toUpperCase());
    }
    if (status) {
      events = events.filter((e) => e.verificationStatus === status.toUpperCase());
    }

    return NextResponse.json({
      success: true,
      count: events.length,
      events: events.slice(0, limit),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch leaderboard events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, userId, guildId, activityType, referenceId, points, description, idempotencyKey } = body;

    if (!category || !activityType || !referenceId || !idempotencyKey) {
      return NextResponse.json(
        { success: false, error: 'category, activityType, referenceId, and idempotencyKey are required.' },
        { status: 400 }
      );
    }

    const outcome = store.recordLeaderboardScoreEvent({
      category,
      userId,
      guildId,
      activityType,
      referenceId,
      points,
      description,
      idempotencyKey,
      verifiedBy: request.headers.get('x-user-id') || 'system',
    });

    return NextResponse.json(
      {
        success: true,
        alreadyProcessed: outcome.alreadyProcessed,
        event: outcome.event,
      },
      { status: outcome.alreadyProcessed ? 200 : 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to record leaderboard event' },
      { status: 400 }
    );
  }
}
