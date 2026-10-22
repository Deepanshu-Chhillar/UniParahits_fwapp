import { NextResponse } from 'next/server';
import { 
  INITIAL_ECONOMY_CONFIG, 
  RANK_DEFINITIONS, 
  INITIAL_MANA_TRANSACTIONS, 
  INITIAL_ZENI_TRANSACTIONS,
  INITIAL_ESCROWS
} from '@/lib/data/initialData';

export async function GET() {
  const totalManaCirculating = INITIAL_MANA_TRANSACTIONS.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const totalZeniVolume = INITIAL_ZENI_TRANSACTIONS.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const totalEscrowLocked = INITIAL_ESCROWS
    .filter(e => e.status === 'LOCKED')
    .reduce((sum, e) => sum + (e.totalAmountZeni || 0), 0);

  return NextResponse.json({
    success: true,
    data: {
      metrics: {
        dualEconomy: {
          manaXP: {
            circulating: totalManaCirculating,
            transferable: false,
            utility: 'Merit-based rank elevation and guild reputation tracking'
          },
          zeniToken: {
            circulatingVolume: totalZeniVolume,
            peg: '1 ZENI = ₹1.00 INR',
            transferable: true,
            utility: 'Peer-to-peer classroom enrollments, bounties, and escrow payouts'
          }
        },
        escrow: {
          activeEscrowsLockedZeni: totalEscrowLocked,
          guaranteedSplit: '85% Guild / 15% Platform Commission'
        },
        courseEconomics: {
          defaultClassroomSeats: INITIAL_ECONOMY_CONFIG.defaultCourseCapacity,
          seatUpgradeCostZeni: INITIAL_ECONOMY_CONFIG.capacityUpgradeCost,
          seatUpgradeBatchSize: INITIAL_ECONOMY_CONFIG.capacityUpgradeSize,
          teacherRoyaltyPct: INITIAL_ECONOMY_CONFIG.courseTeacherPayoutPct,
          platformRoyaltyPct: INITIAL_ECONOMY_CONFIG.coursePlatformFeePct
        }
      },
      rankHierarchy: RANK_DEFINITIONS,
      economyConfig: INITIAL_ECONOMY_CONFIG
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updatedConfig = {
      ...INITIAL_ECONOMY_CONFIG,
      ...body
    };

    return NextResponse.json({
      success: true,
      message: 'Platform economy rules and fee parameters successfully updated by Administrator.',
      data: updatedConfig
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Config update failed'
    }, { status: 400 });
  }
}
