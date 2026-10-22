import { NextResponse } from 'next/server';
import { INITIAL_COURSES, INITIAL_ECONOMY_CONFIG } from '@/lib/data/initialData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teacherId = searchParams.get('teacherId');
  const level = searchParams.get('level');

  let courses = [...INITIAL_COURSES];

  if (teacherId) {
    courses = courses.filter(c => c.teacherId === teacherId);
  }
  if (level) {
    courses = courses.filter(c => c.level && c.level.toLowerCase() === level.toLowerCase());
  }

  return NextResponse.json({
    success: true,
    count: courses.length,
    economy: {
      defaultCapacity: INITIAL_ECONOMY_CONFIG.defaultCourseCapacity,
      upgradeCost: INITIAL_ECONOMY_CONFIG.capacityUpgradeCost,
      upgradeIncrement: INITIAL_ECONOMY_CONFIG.capacityUpgradeSize,
      teacherPayoutPct: INITIAL_ECONOMY_CONFIG.courseTeacherPayoutPct,
      platformFeePct: INITIAL_ECONOMY_CONFIG.coursePlatformFeePct
    },
    data: courses
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const price = Number(body.priceZeni) || 200;
    const teacherPayout = Math.floor(price * (INITIAL_ECONOMY_CONFIG.courseTeacherPayoutPct / 100));
    const platformFee = price - teacherPayout;

    const newCourse = {
      id: `course-${Date.now()}`,
      title: body.title || 'Interactive Web Engineering',
      description: body.description || 'Full stack practical course led by student instructor.',
      teacherId: body.teacherId || 'usr-teacher-1',
      teacherName: body.teacherName || 'Aarav Sharma',
      teacherRank: body.teacherRank || 'D',
      priceZeni: price,
      platformFeeZeni: platformFee,
      teacherPayoutZeni: teacherPayout,
      enrolledCount: 0,
      maxCapacity: INITIAL_ECONOMY_CONFIG.defaultCourseCapacity, // strictly 10 default
      capacityUpgrades: 0,
      status: 'active',
      tags: body.tags || ['Web', 'Next.js', 'Full Stack'],
      level: body.level || 'Intermediate',
      sessions: body.sessions || [
        { id: 'sess-1', title: 'Session 1: Architectural Foundations', completed: false }
      ],
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Course created successfully with 10 default seats and 85/15 revenue split',
      data: newCourse
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Invalid course payload'
    }, { status: 400 });
  }
}
