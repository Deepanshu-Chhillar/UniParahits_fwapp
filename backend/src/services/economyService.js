/**
 * UniParahits - Core Economy & Escrow Settlement Engine
 * 
 * Server-Side Financial Rules:
 * 1. 1 ZENI = ₹1 pegged currency
 * 2. MANA is pure XP / contribution (cannot be bought or minted with real money)
 * 3. 85% Guild / 15% Platform project escrow split
 * 4. 85% Teacher / 15% Platform course royalty split
 * 5. Batch capacity starts at 10; expansion requires 500 ZENI platform sink
 * 6. Never allow negative wallet balances or double payouts
 */

const DEFAULT_CONFIG = {
  projectPlatformFeePct: 15,
  guildPayoutPct: 85,
  coursePlatformFeePct: 15,
  courseTeacherPayoutPct: 85,
  defaultCourseCapacity: 10,
  capacityUpgradeSize: 10,
  capacityUpgradeCost: 500,
};

class EconomyEngine {
  constructor(config = DEFAULT_CONFIG) {
    this.config = { ...config };
  }

  // Calculate project escrow split
  calculateProjectSplit(budgetZeni) {
    if (budgetZeni <= 0) throw new Error('Budget must be positive');
    const platformFee = Math.round(budgetZeni * (this.config.projectPlatformFeePct / 100));
    const guildPayout = budgetZeni - platformFee;
    return {
      totalBudget: budgetZeni,
      platformFee,
      guildPayout,
      platformFeePct: this.config.projectPlatformFeePct,
      guildPayoutPct: this.config.guildPayoutPct,
    };
  }

  // Calculate individual guild member payouts
  calculateGuildMemberPayouts(guildPayoutZeni, members) {
    const totalPercentage = members.reduce((sum, m) => sum + (m.sharePercentage || 0), 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new Error(`Total guild member percentages must sum to 100%. Got ${totalPercentage}%`);
    }

    return members.map((member) => {
      const amount = Math.floor(guildPayoutZeni * (member.sharePercentage / 100));
      return {
        studentId: member.studentId,
        studentName: member.studentName,
        role: member.role,
        sharePercentage: member.sharePercentage,
        amountZeni: amount,
      };
    });
  }

  // Calculate course enrollment split
  calculateCourseSplit(coursePriceZeni) {
    if (coursePriceZeni < 0) throw new Error('Price cannot be negative');
    const teacherPayout = Math.floor(coursePriceZeni * (this.config.courseTeacherPayoutPct / 100));
    const platformFee = coursePriceZeni - teacherPayout;
    return {
      priceZeni: coursePriceZeni,
      teacherPayout,
      platformFee,
      splitPct: `${this.config.courseTeacherPayoutPct}% Teacher / ${this.config.coursePlatformFeePct}% Platform`,
    };
  }

  // Validate capacity upgrade
  validateCapacityUpgrade(currentCapacity, teacherZeniBalance) {
    if (teacherZeniBalance < this.config.capacityUpgradeCost) {
      throw new Error(
        `Insufficient ZENI balance. Need ${this.config.capacityUpgradeCost} ZENI to upgrade capacity, currently have ${teacherZeniBalance} ZENI.`
      );
    }
    const newCapacity = currentCapacity + this.config.capacityUpgradeSize;
    return {
      cost: this.config.capacityUpgradeCost,
      newCapacity,
      previousCapacity: currentCapacity,
    };
  }
}

module.exports = {
  EconomyEngine,
  economyEngine: new EconomyEngine(),
  DEFAULT_CONFIG,
};
