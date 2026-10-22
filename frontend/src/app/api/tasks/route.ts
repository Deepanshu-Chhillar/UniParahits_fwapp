import { NextResponse } from 'next/server';
import { INITIAL_TASKS } from '@/lib/data/initialData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const difficulty = searchParams.get('difficulty');
  const category = searchParams.get('category');
  const minRank = searchParams.get('minRank');

  let tasks = [...INITIAL_TASKS];

  if (difficulty) {
    tasks = tasks.filter(t => t.difficulty.toLowerCase() === difficulty.toLowerCase());
  }
  if (category) {
    tasks = tasks.filter(t => t.category.toLowerCase() === category.toLowerCase());
  }
  if (minRank) {
    tasks = tasks.filter(t => (t.minRank === minRank) || (t.requiredRank === minRank));
  }

  return NextResponse.json({
    success: true,
    count: tasks.length,
    data: tasks
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTask = {
      id: `task-${Date.now()}`,
      title: body.title || 'Untitled Task',
      description: body.description || '',
      category: body.category || 'frontend',
      difficulty: body.difficulty || 'beginner',
      minRank: body.minRank || 'E',
      manaReward: Number(body.manaReward) || 100,
      zeniReward: Number(body.zeniReward) || 50,
      estimatedHours: Number(body.estimatedHours) || 3,
      skillsRequired: body.skillsRequired || ['General'],
      deliverables: body.deliverables || ['Pull Request / Repository link'],
      verificationCriteria: body.verificationCriteria || ['Pass automated tests'],
      deadlineDays: Number(body.deadlineDays) || 7,
      completedCount: 0,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Task successfully created',
      data: newTask
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Invalid payload'
    }, { status: 400 });
  }
}
