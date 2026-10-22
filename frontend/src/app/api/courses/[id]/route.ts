import { NextResponse } from 'next/server';
import { INITIAL_COURSES, INITIAL_ECONOMY_CONFIG } from '@/lib/data/initialData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const course = INITIAL_COURSES.find(c => c.id === id);

  if (!course) {
    return NextResponse.json({
      success: false,
      error: `Course with id '${id}' not found`
    }, { status: 404 });
  }

  const capacity = course.batchCapacity || 10;
  const isFull = course.enrolledCount >= capacity;
  const availableSeats = Math.max(0, capacity - course.enrolledCount);

  return NextResponse.json({
    success: true,
    data: {
      ...course,
      isFull,
      availableSeats,
      upgradeAvailable: true,
      upgradeCost: INITIAL_ECONOMY_CONFIG.capacityUpgradeCost,
      upgradeSeats: INITIAL_ECONOMY_CONFIG.capacityUpgradeSize
    }
  });
}

// POST: Enroll student into course
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const course = INITIAL_COURSES.find(c => c.id === id);

  if (!course) {
    return NextResponse.json({
      success: false,
      error: `Course with id '${id}' not found`
    }, { status: 404 });
  }

  const maxSeats = course.batchCapacity || 10;
  if (course.enrolledCount >= maxSeats) {
    return NextResponse.json({
      success: false,
      error: `Course is fully booked (${course.enrolledCount}/${maxSeats} seats filled). Instructor must purchase a +10 seat capacity upgrade for 500 ZENI.`
    }, { status: 400 });
  }

  try {
    const body = await request.json();
    const studentId = body.studentId || 'usr-student-1';
    const teacherPayout = Math.floor(course.priceZeni * 0.85);
    const platformFee = course.priceZeni - teacherPayout;

    const enrollmentRecord = {
      id: `enr-${Date.now()}`,
      courseId: id,
      studentId,
      enrolledAt: new Date().toISOString(),
      amountPaidZeni: course.priceZeni,
      teacherPayoutZeni: teacherPayout,
      platformFeeZeni: platformFee,
      splitPct: '85% Teacher / 15% Platform'
    };

    return NextResponse.json({
      success: true,
      message: 'Student successfully enrolled! Payment split: 85% to Instructor, 15% to Platform Reserve.',
      data: enrollmentRecord
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Enrollment error'
    }, { status: 400 });
  }
}

// PATCH: Teacher purchases capacity upgrade (+10 seats for 500 ZENI)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const course = INITIAL_COURSES.find(c => c.id === id);

  if (!course) {
    return NextResponse.json({
      success: false,
      error: `Course with id '${id}' not found`
    }, { status: 404 });
  }

  try {
    const body = await request.json();
    const teacherId = body.teacherId || course.teacherId;

    const currentCapacity = course.batchCapacity || 10;
    const newCapacity = currentCapacity + INITIAL_ECONOMY_CONFIG.capacityUpgradeSize;
    const upgradeLog = {
      id: `upg-${Date.now()}`,
      courseId: id,
      teacherId,
      costZeni: INITIAL_ECONOMY_CONFIG.capacityUpgradeCost,
      previousCapacity: currentCapacity,
      newCapacity,
      economicSink: '500 ZENI burned to platform treasury sink',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: `Capacity expanded by +${INITIAL_ECONOMY_CONFIG.capacityUpgradeSize} seats! New maximum capacity: ${newCapacity}. 500 ZENI platform sink debited.`,
      data: upgradeLog
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Capacity upgrade failed'
    }, { status: 400 });
  }
}
