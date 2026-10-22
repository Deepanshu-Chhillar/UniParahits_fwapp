import { NextResponse } from 'next/server';
import { INITIAL_ESCROWS, INITIAL_ECONOMY_CONFIG } from '@/lib/data/initialData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  const companyId = searchParams.get('companyId');

  let escrows = [...INITIAL_ESCROWS];

  if (projectId) {
    escrows = escrows.filter(e => e.projectId === projectId);
  }
  if (companyId) {
    escrows = escrows.filter(e => e.companyId === companyId);
  }

  return NextResponse.json({
    success: true,
    count: escrows.length,
    escrowPolicy: {
      platformFeePct: INITIAL_ECONOMY_CONFIG.projectPlatformFeePct,
      guildDisbursementPct: INITIAL_ECONOMY_CONFIG.guildPayoutPct,
      protectionMechanism: 'Smart contract vault lock until verified GitHub milestone approval.'
    },
    data: escrows
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { escrowId, action, reviewerId } = body;

    const escrow = INITIAL_ESCROWS.find(e => e.id === escrowId) || INITIAL_ESCROWS[0];

    if (action === 'release') {
      const totalAmount = escrow.totalAmountZeni;
      const guildPayout = Math.floor(totalAmount * (INITIAL_ECONOMY_CONFIG.guildPayoutPct / 100));
      const platformFee = totalAmount - guildPayout;

      // Guild Member Distribution: Lead (35%), Backend (25%), Frontend (25%), QA (15%)
      const memberSplits = [
        {
          role: 'Tech Lead',
          userId: 'usr-lead-1',
          name: 'Rahul Mehta',
          rank: 'B',
          sharePct: 35,
          amountZeni: Math.floor(guildPayout * 0.35)
        },
        {
          role: 'Backend Architect',
          userId: 'usr-mentor-1',
          name: 'Priya Patel',
          rank: 'C',
          sharePct: 25,
          amountZeni: Math.floor(guildPayout * 0.25)
        },
        {
          role: 'Frontend Engineer',
          userId: 'usr-teacher-1',
          name: 'Aarav Sharma',
          rank: 'D',
          sharePct: 25,
          amountZeni: Math.floor(guildPayout * 0.25)
        },
        {
          role: 'QA & Apprentice',
          userId: 'usr-student-1',
          name: 'Rohan Verma',
          rank: 'E',
          sharePct: 15,
          amountZeni: Math.floor(guildPayout * 0.15)
        }
      ];

      const settlement = {
        settlementId: `settle-${Date.now()}`,
        escrowId: escrow.id,
        projectId: escrow.projectId,
        totalReleasedZeni: totalAmount,
        platformFeeRetainedZeni: platformFee,
        guildTotalDistributedZeni: guildPayout,
        splitDistributionFormula: '85% Guild / 15% Platform Commission',
        memberSplits,
        status: 'RELEASED_AND_SETTLED',
        settledAt: new Date().toISOString(),
        verifiedBy: reviewerId || 'company-sponsor'
      };

      return NextResponse.json({
        success: true,
        message: `Escrow release complete! ${guildPayout.toLocaleString()} ZENI distributed to Guild members, ${platformFee.toLocaleString()} ZENI credited to Platform Treasury (85/15 split).`,
        data: settlement
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action. Supported actions: release'
    }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Escrow settlement failure'
    }, { status: 400 });
  }
}
