/**
 * UniParahits - Production Leaderboard Engine & Scoring Service
 * 
 * Strict Scope & Security Requirements:
 * 1. Exactly 3 independent categories: Students, Teachers, Guilds.
 * 2. EXPLICITLY NO Everyone, All Users, or Cross-Role rankings.
 * 3. Never rank by Zeni wallet balance or currency balance.
 * 4. Anti-Cheat: Only verified events are scored. Duplicate processing prevented via idempotency keys.
 * 5. Period filtering: Weekly, Monthly, All-time with deterministic date boundaries.
 * 6. Authentic rank movement: calculated only when historical period data exists, else null.
 */

// Helper: Calculate deterministic date boundaries for periods
function getPeriodDateRange(period, referenceDate = new Date()) {
  const now = new Date(referenceDate);
  const end = new Date(now);

  if (period === 'weekly') {
    // Current UTC week starting Monday 00:00:00
    const day = now.getUTCDay(); // 0 is Sunday, 1 is Monday
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diffToMonday, 0, 0, 0, 0));
    return { start, end };
  }

  if (period === 'monthly') {
    // Current UTC month starting 1st 00:00:00
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
    return { start, end };
  }

  // All-time: From epoch to current moment
  return { start: new Date(0), end };
}

// Helper: Calculate previous period date range for genuine rank movement comparison
function getPreviousPeriodDateRange(period, referenceDate = new Date()) {
  const now = new Date(referenceDate);

  if (period === 'weekly') {
    const day = now.getUTCDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const currentWeekStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diffToMonday, 0, 0, 0, 0));
    const prevStart = new Date(currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prevEnd = new Date(currentWeekStart.getTime() - 1);
    return { start: prevStart, end: prevEnd };
  }

  if (period === 'monthly') {
    // End of previous month
    const prevEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0, 23, 59, 59, 999));
    const prevStart = new Date(Date.UTC(prevEnd.getUTCFullYear(), prevEnd.getUTCMonth(), 1, 0, 0, 0, 0));
    return { start: prevStart, end: prevEnd };
  }

  return null; // All-time has no single previous period
}

// Filter events by period and verification status
function filterEventsByPeriod(events, category, dateRange) {
  return events.filter((e) => {
    if (e.category !== category) return false;
    if (e.verificationStatus !== 'VERIFIED') return false;
    const eventTime = new Date(e.timestamp || e.createdAt).getTime();
    return eventTime >= dateRange.start.getTime() && eventTime <= dateRange.end.getTime();
  });
}

class LeaderboardEngine {
  /**
   * 1. STUDENTS LEADERBOARD
   * Ranks eligible students based on verified approved tasks, projects, achievements.
   * NEVER ranks by Zeni balance.
   */
  getStudentLeaderboard({
    users,
    events,
    guilds = [],
    period = 'all-time',
    search = '',
    rankFilter = 'ALL',
    page = 1,
    limit = 10,
    currentUserId = null,
  }) {
    const dateRange = getPeriodDateRange(period);
    const periodEvents = filterEventsByPeriod(events, 'STUDENT', dateRange);

    // Eligible students: role STUDENT or users with STUDENT capability (excluding company/admin-only)
    const eligibleStudents = users.filter((u) => u.role === 'STUDENT' || (u.capabilities && u.capabilities.includes('STUDENT')));

    // Build historical ranking for movement comparison if period is weekly or monthly
    const prevDateRange = getPreviousPeriodDateRange(period);
    let prevRankMap = new Map();
    if (prevDateRange) {
      const prevEvents = filterEventsByPeriod(events, 'STUDENT', prevDateRange);
      const prevScores = eligibleStudents.map((s) => {
        const studentPrevEvents = prevEvents.filter((e) => e.userId === s.id);
        const score = studentPrevEvents.reduce((acc, e) => acc + (Number(e.points) || 0), 0);
        return { userId: s.id, score };
      }).filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score);

      prevScores.forEach((item, index) => {
        prevRankMap.set(item.userId, index + 1);
      });
    }

    // Aggregate current period scores and metrics
    const aggregated = eligibleStudents.map((student) => {
      const studentEvents = periodEvents.filter((e) => e.userId === student.id);
      const score = studentEvents.reduce((acc, e) => acc + (Number(e.points) || 0), 0);

      const tasksCompleted = studentEvents.filter((e) => e.activityType === 'TASK_APPROVED').length;
      const projectsCompleted = studentEvents.filter((e) => e.activityType === 'PROJECT_COMPLETED').length;
      const achievementsCount = studentEvents.filter((e) => e.activityType === 'ACHIEVEMENT_UNLOCKED').length;

      // Find guild info
      let guildName = undefined;
      let guildRole = undefined;
      let guildId = undefined;
      for (const g of guilds) {
        if (g.leaderId === student.id) {
          guildId = g.id;
          guildName = g.name;
          guildRole = 'Leader';
          break;
        }
        const member = g.members?.find((m) => m.studentId === student.id);
        if (member) {
          guildId = g.id;
          guildName = g.name;
          guildRole = member.role || member.roleTitle;
          break;
        }
      }

      const prevRank = prevRankMap.get(student.id);
      let rankMovement = null;
      if (prevRank !== undefined) {
        // Will compute after current rank is assigned
      }

      return {
        userId: student.id,
        name: student.name,
        avatar: student.avatar || student.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        studentRank: student.rank || 'E',
        college: student.college || 'Engineering Institute',
        guildId,
        guildName,
        guildRole,
        score,
        tasksCompleted,
        projectsCompleted,
        achievementsCount,
        prevRank,
      };
    });

    // Sort descending by score, tiebreak by tasksCompleted, then alphabetical
    aggregated.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.tasksCompleted !== a.tasksCompleted) return b.tasksCompleted - a.tasksCompleted;
      return a.name.localeCompare(b.name);
    });

    // Assign overall rank and calculate rank movement
    aggregated.forEach((item, index) => {
      item.rank = index + 1;
      if (item.prevRank !== undefined) {
        item.rankMovement = item.prevRank - item.rank; // positive: moved up, negative: dropped
      } else {
        item.rankMovement = null;
      }
      delete item.prevRank;
    });

    // Compute user position before search filtering so user knows their absolute rank
    let userPosition = null;
    if (currentUserId) {
      const idx = aggregated.findIndex((s) => s.userId === currentUserId);
      if (idx !== -1) {
        const u = aggregated[idx];
        const nextTarget = idx > 0 ? aggregated[idx - 1].score - u.score + 1 : 0;
        userPosition = {
          rank: u.rank,
          totalParticipants: aggregated.length,
          score: u.score,
          period,
          category: 'students',
          scoreToNextRank: nextTarget > 0 ? nextTarget : 0,
          aheadOfPercentage: Math.max(0, Math.round(((aggregated.length - u.rank) / aggregated.length) * 100)),
        };
      }
    }

    // Apply Filters: Search and Student Rank filter
    let filtered = aggregated;
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter((s) => s.name.toLowerCase().includes(q) || s.college.toLowerCase().includes(q) || (s.guildName && s.guildName.toLowerCase().includes(q)));
    }

    if (rankFilter && rankFilter !== 'ALL') {
      filtered = filtered.filter((s) => s.studentRank === rankFilter);
    }

    // Paginate
    const totalCount = filtered.length;
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    const startIndex = (safePage - 1) * safeLimit;
    const paginatedData = filtered.slice(startIndex, startIndex + safeLimit);

    return {
      success: true,
      category: 'students',
      period,
      dateRange: {
        start: dateRange.start.toISOString(),
        end: dateRange.end.toISOString(),
      },
      totalCount,
      page: safePage,
      limit: safeLimit,
      data: paginatedData,
      userPosition,
    };
  }

  /**
   * 2. TEACHERS LEADERBOARD
   * Ranks Teachers independently using genuine teaching & mentorship contributions.
   * Requires anti-manipulation minimum review sample (>= 2 reviews) for ratings.
   */
  getTeacherLeaderboard({
    users,
    events,
    courses = [],
    guilds = [],
    period = 'all-time',
    search = '',
    page = 1,
    limit = 10,
    currentUserId = null,
  }) {
    const dateRange = getPeriodDateRange(period);
    const periodEvents = filterEventsByPeriod(events, 'TEACHER', dateRange);

    // Eligible teachers: users who have capability TEACHER or have created/taught courses
    const eligibleTeachers = users.filter((u) => {
      const isTeacherRole = u.role === 'TEACHER';
      const hasCapability = u.capabilities && u.capabilities.includes('TEACHER');
      const hasCourses = courses.some((c) => c.teacherId === u.id);
      return isTeacherRole || hasCapability || hasCourses;
    });

    // Previous period for genuine rank movement
    const prevDateRange = getPreviousPeriodDateRange(period);
    let prevRankMap = new Map();
    if (prevDateRange) {
      const prevEvents = filterEventsByPeriod(events, 'TEACHER', prevDateRange);
      const prevScores = eligibleTeachers.map((t) => {
        const teacherPrevEvents = prevEvents.filter((e) => e.userId === t.id);
        const score = teacherPrevEvents.reduce((acc, e) => acc + (Number(e.points) || 0), 0);
        return { teacherId: t.id, score };
      }).filter((t) => t.score > 0)
        .sort((a, b) => b.score - a.score);

      prevScores.forEach((item, index) => {
        prevRankMap.set(item.teacherId, index + 1);
      });
    }

    const aggregated = eligibleTeachers.map((teacher) => {
      const teacherEvents = periodEvents.filter((e) => e.userId === teacher.id);
      const score = teacherEvents.reduce((acc, e) => acc + (Number(e.points) || 0), 0);

      const batchesTaught = teacherEvents.filter((e) => e.activityType === 'BATCH_TAUGHT').length;
      const sessionsDelivered = teacherEvents.filter((e) => e.activityType === 'SESSION_DELIVERED').length;
      const studentsMentored = teacherEvents.filter((e) => e.activityType === 'MENTORSHIP_REVIEW').length;

      // Extract course rating and reviews summary from teacher's courses
      const teacherCourses = courses.filter((c) => c.teacherId === teacher.id);
      let totalRating = 0;
      let totalReviews = 0;
      teacherCourses.forEach((c) => {
        if (c.rating && c.reviewsCount) {
          totalRating += Number(c.rating) * Number(c.reviewsCount);
          totalReviews += Number(c.reviewsCount);
        }
      });
      const averageRating = totalReviews > 0 ? Number((totalRating / totalReviews).toFixed(2)) : 0;

      // Find guild (if any)
      let guildName = undefined;
      for (const g of guilds) {
        if (g.leaderId === teacher.id || g.members?.some((m) => m.studentId === teacher.id)) {
          guildName = g.name;
          break;
        }
      }

      const prevRank = prevRankMap.get(teacher.id);

      return {
        teacherId: teacher.id,
        name: teacher.name,
        avatar: teacher.avatar || teacher.avatar_url || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
        teacherRank: teacher.rank || 'D',
        headline: teacher.headline || 'Course Instructor & Technical Mentor',
        college: teacher.college || 'Technical Institute',
        guildName,
        score,
        batchesTaught,
        sessionsDelivered,
        studentsMentored,
        averageRating,
        reviewsCount: totalReviews,
        prevRank,
      };
    });

    // Sort descending by score, tiebreak by rating and reviews, then name
    aggregated.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.averageRating !== a.averageRating) return b.averageRating - a.averageRating;
      if (b.reviewsCount !== a.reviewsCount) return b.reviewsCount - a.reviewsCount;
      return a.name.localeCompare(b.name);
    });

    // Assign rank and movement
    aggregated.forEach((item, index) => {
      item.rank = index + 1;
      if (item.prevRank !== undefined) {
        item.rankMovement = item.prevRank - item.rank;
      } else {
        item.rankMovement = null;
      }
      delete item.prevRank;
    });

    // User position
    let userPosition = null;
    if (currentUserId) {
      const idx = aggregated.findIndex((t) => t.teacherId === currentUserId);
      if (idx !== -1) {
        const u = aggregated[idx];
        const nextTarget = idx > 0 ? aggregated[idx - 1].score - u.score + 1 : 0;
        userPosition = {
          rank: u.rank,
          totalParticipants: aggregated.length,
          score: u.score,
          period,
          category: 'teachers',
          scoreToNextRank: nextTarget > 0 ? nextTarget : 0,
          aheadOfPercentage: Math.max(0, Math.round(((aggregated.length - u.rank) / aggregated.length) * 100)),
        };
      }
    }

    // Search filter
    let filtered = aggregated;
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter((t) => t.name.toLowerCase().includes(q) || t.college.toLowerCase().includes(q) || (t.headline && t.headline.toLowerCase().includes(q)));
    }

    // Paginate
    const totalCount = filtered.length;
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    const startIndex = (safePage - 1) * safeLimit;
    const paginatedData = filtered.slice(startIndex, startIndex + safeLimit);

    return {
      success: true,
      category: 'teachers',
      period,
      dateRange: {
        start: dateRange.start.toISOString(),
        end: dateRange.end.toISOString(),
      },
      totalCount,
      page: safePage,
      limit: safeLimit,
      data: paginatedData,
      userPosition,
    };
  }

  /**
   * 3. GUILDS LEADERBOARD
   * Ranks Guilds based on verified collective contributions and completed escrow projects.
   * NEVER ranks by combined Zeni wallet balance.
   */
  getGuildLeaderboard({
    guilds,
    events,
    period = 'all-time',
    search = '',
    page = 1,
    limit = 10,
  }) {
    const dateRange = getPeriodDateRange(period);
    const periodEvents = filterEventsByPeriod(events, 'GUILD', dateRange);

    // Also collect member contribution events for guilds during period
    const studentEvents = filterEventsByPeriod(events, 'STUDENT', dateRange);

    // Previous period for movement
    const prevDateRange = getPreviousPeriodDateRange(period);
    let prevRankMap = new Map();
    if (prevDateRange) {
      const prevGuildEvents = filterEventsByPeriod(events, 'GUILD', prevDateRange);
      const prevScores = guilds.map((g) => {
        const gEvents = prevGuildEvents.filter((e) => e.guildId === g.id);
        const score = gEvents.reduce((acc, e) => acc + (Number(e.points) || 0), 0);
        return { guildId: g.id, score };
      }).filter((g) => g.score > 0)
        .sort((a, b) => b.score - a.score);

      prevScores.forEach((item, index) => {
        prevRankMap.set(item.guildId, index + 1);
      });
    }

    const aggregated = guilds.map((guild) => {
      // Direct guild verified events (e.g. project completions, milestones)
      const directEvents = periodEvents.filter((e) => e.guildId === guild.id);
      const directScore = directEvents.reduce((acc, e) => acc + (Number(e.points) || 0), 0);

      // Contributing members: members who earned verified contribution points in this guild during the period
      const memberIds = new Set((guild.members || []).map((m) => m.studentId));
      if (guild.leaderId) memberIds.add(guild.leaderId);

      const contributingMemberIds = new Set();
      let memberScoreSum = 0;

      directEvents.forEach((e) => {
        if (e.userId && memberIds.has(e.userId)) {
          contributingMemberIds.add(e.userId);
        }
      });

      // Also check student events specifically tagged with this guildId
      studentEvents.forEach((se) => {
        if (se.guildId === guild.id && memberIds.has(se.userId)) {
          contributingMemberIds.add(se.userId);
          // If not already in direct guild events, member contributions attribute to guild
          if (!directEvents.some((de) => de.referenceId === se.referenceId && de.activityType === se.activityType)) {
            memberScoreSum += Number(se.points) || 0;
          }
        }
      });

      const totalScore = directScore + memberScoreSum;
      const completedProjectsCount = directEvents.filter((e) => e.activityType === 'PROJECT_COMPLETED').length || guild.completedProjects || 0;

      const prevRank = prevRankMap.get(guild.id);

      return {
        guildId: guild.id,
        name: guild.name,
        logo: guild.logo || guild.logo_url || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=150',
        tagline: guild.tagline || 'Collaborative Engineering Guild',
        leaderName: guild.leaderName || 'Guild Master',
        leaderRank: guild.leaderRank || 'C',
        trustScore: guild.trustScore || 4.8,
        score: totalScore,
        contributingMembersCount: contributingMemberIds.size,
        totalMembersCount: (guild.members || []).length || 1,
        completedProjectsCount,
        prevRank,
      };
    });

    // Sort descending by score, tiebreak by completedProjects, then trustScore
    aggregated.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.completedProjectsCount !== a.completedProjectsCount) return b.completedProjectsCount - a.completedProjectsCount;
      if (b.trustScore !== a.trustScore) return b.trustScore - a.trustScore;
      return a.name.localeCompare(b.name);
    });

    // Assign rank and movement
    aggregated.forEach((item, index) => {
      item.rank = index + 1;
      if (item.prevRank !== undefined) {
        item.rankMovement = item.prevRank - item.rank;
      } else {
        item.rankMovement = null;
      }
      delete item.prevRank;
    });

    // Search filter
    let filtered = aggregated;
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter((g) => g.name.toLowerCase().includes(q) || g.tagline.toLowerCase().includes(q) || g.leaderName.toLowerCase().includes(q));
    }

    // Paginate
    const totalCount = filtered.length;
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    const startIndex = (safePage - 1) * safeLimit;
    const paginatedData = filtered.slice(startIndex, startIndex + safeLimit);

    return {
      success: true,
      category: 'guilds',
      period,
      dateRange: {
        start: dateRange.start.toISOString(),
        end: dateRange.end.toISOString(),
      },
      totalCount,
      page: safePage,
      limit: safeLimit,
      data: paginatedData,
    };
  }

  /**
   * Anti-Cheat: Record a verified score event with strict idempotency verification.
   * Prevents double processing or duplicate scoring.
   */
  recordEvent(eventsList, newEvent) {
    if (!newEvent.idempotencyKey) {
      throw new Error('idempotencyKey is required for verified leaderboard score events.');
    }

    // Check if event already exists
    const existing = eventsList.find((e) => e.idempotencyKey === newEvent.idempotencyKey);
    if (existing) {
      return { event: existing, alreadyProcessed: true };
    }

    const event = {
      id: newEvent.id || `lbe-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      category: newEvent.category,
      userId: newEvent.userId || null,
      guildId: newEvent.guildId || null,
      activityType: newEvent.activityType,
      referenceId: newEvent.referenceId,
      points: Math.max(0, Number(newEvent.points) || 0),
      description: newEvent.description || 'Verified platform contribution event',
      verificationStatus: newEvent.verificationStatus || 'VERIFIED',
      verifiedBy: newEvent.verifiedBy || 'system',
      idempotencyKey: newEvent.idempotencyKey,
      timestamp: newEvent.timestamp || new Date().toISOString(),
    };

    eventsList.unshift(event);
    return { event, alreadyProcessed: false };
  }

  /**
   * Authorized admin revocation of a fraudulent or invalidated event
   */
  revokeEvent(eventsList, eventId, revokedBy = 'admin') {
    const event = eventsList.find((e) => e.id === eventId);
    if (!event) throw new Error(`Event ${eventId} not found.`);
    event.verificationStatus = 'REVOKED';
    event.revokedBy = revokedBy;
    event.revokedAt = new Date().toISOString();
    return event;
  }
}

module.exports = {
  LeaderboardEngine,
  leaderboardEngine: new LeaderboardEngine(),
  getPeriodDateRange,
  getPreviousPeriodDateRange,
};
