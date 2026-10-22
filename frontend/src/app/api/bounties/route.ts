import { NextResponse } from 'next/server';
import { INITIAL_BOUNTIES, INITIAL_ECONOMY_CONFIG } from '@/lib/data/initialData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const minRank = searchParams.get('minRank');
  const targetType = searchParams.get('targetType');
  const status = searchParams.get('status');

  let bounties = [...INITIAL_BOUNTIES];

  if (minRank) {
    bounties = bounties.filter(b => b.minRank === minRank);
  }
  if (targetType) {
    bounties = bounties.filter(b => b.targetType.toUpperCase() === targetType.toUpperCase());
  }
  if (status) {
    bounties = bounties.filter(b => b.status.toUpperCase() === status.toUpperCase());
  }

  return NextResponse.json({
    success: true,
    count: bounties.length,
    escrowPolicy: {
      guildPayoutPct: INITIAL_ECONOMY_CONFIG.guildPayoutPct,
      platformFeePct: INITIAL_ECONOMY_CONFIG.projectPlatformFeePct,
      description: 'Upon sponsor release, 85% of escrowed ZENI is disbursed to Guild members; 15% is retained as platform treasury fee.'
    },
    data: bounties
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const budgetZeni = Number(body.budgetZeni) || 50000;
    const guildSplit = Math.floor(budgetZeni * (INITIAL_ECONOMY_CONFIG.guildPayoutPct / 100));
    const platformFee = budgetZeni - guildSplit;

    const newBounty = {
      id: `bounty-${Date.now()}`,
      companyId: body.companyId || 'company-novatech',
      companyName: body.companyName || 'NovaTech Labs',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      title: body.title || 'Untitled Bounty',
      description: body.description || '',
      skills: body.skills || ['Full Stack'],
      budgetZeni,
      escrowBreakdown: {
        totalBudgetZeni: budgetZeni,
        guildPayoutZeni: guildSplit,
        platformFeeZeni: platformFee,
        splitDistribution: '85% Guild / 15% Platform'
      },
      deadline: body.deadline || new Date(Date.now() + 14 * 86400000).toISOString(),
      minRank: body.minRank || 'C',
      targetType: body.targetType || 'GUILD',
      deliverables: body.deliverables || ['Tested code in GitHub repository'],
      status: 'OPEN',
      applicationsCount: 0,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Bounty created with simulated escrow lock initiated.',
      data: newBounty
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Failed to create bounty'
    }, { status: 400 });
  }
}
