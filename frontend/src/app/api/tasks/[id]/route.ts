import { NextResponse } from 'next/server';
import { INITIAL_TASKS } from '@/lib/data/initialData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const task = INITIAL_TASKS.find(t => t.id === id);

  if (!task) {
    return NextResponse.json({
      success: false,
      error: `Task with id '${id}' not found`
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: task
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const task = INITIAL_TASKS.find(t => t.id === id);

  if (!task) {
    return NextResponse.json({
      success: false,
      error: `Task with id '${id}' not found`
    }, { status: 404 });
  }

  try {
    const body = await request.json();
    const submission = {
      id: `sub-${Date.now()}`,
      taskId: id,
      studentId: body.studentId || 'usr-student-1',
      studentName: body.studentName || 'Student',
      githubUrl: body.githubUrl,
      liveUrl: body.liveUrl || null,
      videoUrl: body.videoUrl || null,
      notes: body.notes || '',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      potentialRewards: {
        mana: task.manaReward,
        zeni: task.zeniReward
      }
    };

    return NextResponse.json({
      success: true,
      message: 'Proof of work submitted successfully for peer review',
      data: submission
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Invalid submission payload'
    }, { status: 400 });
  }
}
