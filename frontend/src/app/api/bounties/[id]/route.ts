import { NextResponse } from 'next/server';
import { INITIAL_BOUNTIES, INITIAL_ECONOMY_CONFIG } from '@/lib/data/initialData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bounty = INITIAL_BOUNTIES.find(b => b.id === id);

  if (!bounty) {
    return NextResponse.json({
      success: false,
      error: `Bounty with id '${id}' not found`
    }, { status: 404 });
  }

  const guildPayout = Math.floor(bounty.budgetZeni * (INITIAL_ECONOMY_CONFIG.guildPayoutPct / 100));
  const platformFee = bounty.budgetZeni - guildPayout;

  return NextResponse.json({
    success: true,
    data: {
      ...bounty,
      escrowSummary: {
        totalEscrowZeni: bounty.budgetZeni,
        guildDisbursementZeni: guildPayout,
        platformCommissionZeni: platformFee,
        contractRatio: '85% Guild / 15% Platform'
      }
    }
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bounty = INITIAL_BOUNTIES.find(b => b.id === id);

  if (!bounty) {
    return NextResponse.json({
      success: false,
      error: `Bounty with id '${id}' not found`
    }, { status: 404 });
  }

  try {
    const body = await request.json();
    const applicantRank = body.applicantRank || 'C';
    const applicantType = body.applicantType || 'GUILD';

    // Rank validation order
    const rankHierarchy: Record<string, number> = { E: 1, D: 2, C: 3, B: 4, A: 5 };
    const userRankLevel = rankHierarchy[applicantRank] || 1;
    const requiredRankLevel = rankHierarchy[bounty.minRank] || 1;

    if (userRankLevel < requiredRankLevel) {
      return NextResponse.json({
        success: false,
        error: `Insufficient Rank. Bounty requires Rank ${bounty.minRank}, but applicant has Rank ${applicantRank}.`
      }, { status: 403 });
    }

    const application = {
      id: `app-${Date.now()}`,
      bountyId: id,
      applicantId: body.applicantId || 'usr-lead-1',
      applicantName: body.applicantName || 'CyberForge Guild',
      applicantRank,
      applicantType,
      proposalText: body.proposalText || 'We have verified talent to execute this bounty within deadline.',
      estimatedDeliveryDays: Number(body.estimatedDeliveryDays) || 14,
      status: 'PENDING',
      appliedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: `Application submitted successfully for bounty '${bounty.title}'!`,
      data: application
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Application error'
    }, { status: 400 });
  }
}
