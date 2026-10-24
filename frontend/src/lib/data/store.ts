'use client';

import {
  User,
  StudentProfile,
  CompanyProfile,
  Task,
  TaskSubmission,
  Guild,
  GuildMember,
  MentorRelationship,
  Bounty,
  Application,
  Project,
  Course,
  CourseMessage,
  CourseEnrollment,
  CourseCapacityUpgrade,
  CourseReview,
  ManaTransaction,
  ZeniTransaction,
  TransactionType,
  Escrow,
  PaymentSplit,
  Notification,
  Achievement,
  EconomyConfig,
  AuditLog,
  RankCode,
  GrowthPath,
  SubmissionType,
  LeaderboardScoreEvent,
  LeaderboardPeriod,
  LeaderboardCategory,
  StudentLeaderboardEntry,
  TeacherLeaderboardEntry,
  GuildLeaderboardEntry,
  LeaderboardResponse,
  UserLeaderboardPosition,
} from '../types';

import {
  INITIAL_USERS,
  INITIAL_STUDENT_PROFILES,
  INITIAL_COMPANY_PROFILE,
  INITIAL_TASKS,
  INITIAL_SUBMISSIONS,
  INITIAL_GUILDS,
  INITIAL_MENTOR_RELATIONSHIPS,
  INITIAL_COURSES,
  INITIAL_COURSE_MESSAGES,
  INITIAL_ENROLLMENTS,
  INITIAL_BOUNTIES,
  INITIAL_APPLICATIONS,
  INITIAL_PROJECTS,
  INITIAL_ESCROWS,
  INITIAL_PAYMENT_SPLITS,
  INITIAL_MANA_TRANSACTIONS,
  INITIAL_ZENI_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ECONOMY_CONFIG,
  RANK_DEFINITIONS,
  INITIAL_LEADERBOARD_EVENTS,
} from './initialData';

import {
  UNIVERSAL_DEMO_USER,
  UNIVERSAL_DEMO_STUDENT_PROFILE,
  UNIVERSAL_DEMO_COMPANY_PROFILE,
} from '../demo/demoAccounts';

const STORAGE_KEY = 'uniparahits_database_v2';

interface AppDatabase {
  users: User[];
  currentUserId: string;
  studentProfiles: Record<string, StudentProfile>;
  companyProfiles: Record<string, CompanyProfile>;
  tasks: Task[];
  submissions: TaskSubmission[];
  guilds: Guild[];
  mentorRelationships: MentorRelationship[];
  courses: Course[];
  courseMessages: CourseMessage[];
  enrollments: CourseEnrollment[];
  capacityUpgrades: CourseCapacityUpgrade[];
  bounties: Bounty[];
  applications: Application[];
  projects: Project[];
  escrows: Escrow[];
  paymentSplits: PaymentSplit[];
  manaTransactions: ManaTransaction[];
  zeniTransactions: ZeniTransaction[];
  notifications: Notification[];
  achievements: Achievement[];
  auditLogs: AuditLog[];
  economyConfig: EconomyConfig;
  leaderboardEvents: LeaderboardScoreEvent[];
}

class StoreService {
  private db: AppDatabase;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.db = this.loadDatabase();
  }

  private loadDatabase(): AppDatabase {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.users && parsed.tasks && parsed.courses) {
            if (!parsed.users.some((u: any) => u.id === UNIVERSAL_DEMO_USER.id)) {
              parsed.users.unshift(UNIVERSAL_DEMO_USER);
              parsed.studentProfiles[UNIVERSAL_DEMO_USER.id] = UNIVERSAL_DEMO_STUDENT_PROFILE;
              parsed.companyProfiles[UNIVERSAL_DEMO_COMPANY_PROFILE.id] = UNIVERSAL_DEMO_COMPANY_PROFILE;
            }
            if (!parsed.leaderboardEvents || parsed.leaderboardEvents.length === 0) {
              parsed.leaderboardEvents = [...INITIAL_LEADERBOARD_EVENTS];
            }
            return parsed;
          }
        }
      } catch (e) {
        console.error('Failed to load UniParahits DB from localStorage', e);
      }
    }

    return {
      users: [UNIVERSAL_DEMO_USER, ...INITIAL_USERS],
      currentUserId: 'user-rohan-e', // Default beginner student
      studentProfiles: {
        [UNIVERSAL_DEMO_USER.id]: { ...UNIVERSAL_DEMO_STUDENT_PROFILE },
        ...INITIAL_STUDENT_PROFILES,
      },
      companyProfiles: {
        'company-novatech': { ...INITIAL_COMPANY_PROFILE },
        [UNIVERSAL_DEMO_COMPANY_PROFILE.id]: { ...UNIVERSAL_DEMO_COMPANY_PROFILE },
      },
      tasks: [...INITIAL_TASKS],
      submissions: [...INITIAL_SUBMISSIONS],
      guilds: [...INITIAL_GUILDS],
      mentorRelationships: [...INITIAL_MENTOR_RELATIONSHIPS],
      courses: [...INITIAL_COURSES],
      courseMessages: [...INITIAL_COURSE_MESSAGES],
      enrollments: [...INITIAL_ENROLLMENTS],
      capacityUpgrades: [],
      bounties: [...INITIAL_BOUNTIES],
      applications: [...INITIAL_APPLICATIONS],
      projects: [...INITIAL_PROJECTS],
      escrows: [...INITIAL_ESCROWS],
      paymentSplits: [...INITIAL_PAYMENT_SPLITS],
      manaTransactions: [...INITIAL_MANA_TRANSACTIONS],
      zeniTransactions: [...INITIAL_ZENI_TRANSACTIONS],
      notifications: [...INITIAL_NOTIFICATIONS],
      achievements: [...INITIAL_ACHIEVEMENTS],
      auditLogs: [...INITIAL_AUDIT_LOGS],
      economyConfig: { ...INITIAL_ECONOMY_CONFIG },
      leaderboardEvents: [...INITIAL_LEADERBOARD_EVENTS],
    };
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db));
      } catch (e) {
        console.error('Failed to persist UniParahits DB', e);
      }
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error('Error in store listener', e);
      }
    });
  }

  public resetToDefaults() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    this.db = this.loadDatabase();
    this.persist();
  }

  // Current User & Profiles
  public getCurrentUser(): User {
    const user = this.db.users.find((u) => u.id === this.db.currentUserId);
    return user || this.db.users[0];
  }

  public setCurrentUserId(id: string) {
    const user = this.db.users.find((u) => u.id === id);
    if (user) {
      this.db.currentUserId = id;
      this.persist();
    }
  }

  public registerUser(userData: {
    name: string;
    email: string;
    role: 'STUDENT' | 'COMPANY';
    college?: string;
    skills?: string[];
  }): User {
    const id = `user-${Date.now()}`;
    const newUser: User = {
      id,
      email: userData.email,
      name: userData.name,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      role: userData.role,
      rank: userData.role === 'STUDENT' ? 'E' : undefined,
      capabilities: [userData.role],
      college: userData.college || (userData.role === 'STUDENT' ? 'Engineering Institute' : 'Corporate Partner'),
      headline: userData.role === 'STUDENT' ? 'Apprentice (Rank E)' : 'Corporate Partner',
      createdAt: new Date().toISOString(),
    };

    this.db.users.push(newUser);

    if (userData.role === 'STUDENT') {
      this.db.studentProfiles[id] = {
        userId: id,
        currentRank: 'E',
        trustScore: 4.0,
        manaBalance: 0,
        zeniBalance: 100, // 100 ZENI welcome bonus
        skills: userData.skills || ['HTML5', 'CSS3', 'JavaScript'],
        bio: 'New verified student on UniParahits. Ready to learn, complete tasks and rank up.',
        college: userData.college || 'Engineering Institute',
        tasksCompleted: 0,
        projectsCompleted: 0,
        courseBatchesTaught: 0,
        teachingRating: 0,
        mentorRecommended: false,
        proofApproved: false,
        isDReady: false,
        isCReady: false,
      };

      // Add corresponding welcome bonus entry so ledger accurately matches 100 ZENI
      this.db.zeniTransactions.unshift({
        id: `zeni-tx-${Date.now()}`,
        userId: id,
        amount: 100,
        balanceAfter: 100,
        type: 'EARN',
        reason: 'Onboarding Grant: Welcome to UniParahits',
        timestamp: new Date().toISOString(),
        status: 'COMPLETED',
      });
    } else {
      const companyId = `company-${id}`;
      this.db.companyProfiles[companyId] = {
        id: companyId,
        userId: id,
        companyName: userData.name,
        logo: newUser.avatar,
        industry: 'Software & Technology',
        description: 'Verified enterprise partner posting bounties and hiring student talent.',
        website: 'https://example.com',
        verified: true,
        trustScore: 4.5,
        bountiesPosted: 0,
        totalSpentZeni: 0,
      };
    }

    this.db.currentUserId = id;
    this.addAuditLog('USER_REGISTERED', id, userData.name, `New ${userData.role} account registered`);
    this.persist();
    return newUser;
  }

  public getStudentProfile(userId?: string): StudentProfile | null {
    const uid = userId || this.db.currentUserId;
    return this.db.studentProfiles[uid] || null;
  }

  public getCompanyProfile(userId?: string): CompanyProfile | null {
    const uid = userId || this.db.currentUserId;
    return Object.values(this.db.companyProfiles).find((c) => c.userId === uid) || this.db.companyProfiles['company-novatech'];
  }

  public getAllUsers(): User[] {
    return this.db.users;
  }

  public getEconomyConfig(): EconomyConfig {
    return this.db.economyConfig;
  }

  // Tasks & Submissions (FLOW 1)
  public getTasks(): Task[] {
    return this.db.tasks;
  }

  public getTaskById(id: string): Task | undefined {
    return this.db.tasks.find((t) => t.id === id);
  }

  public getSubmissions(): TaskSubmission[] {
    return this.db.submissions;
  }

  public getSubmissionsByStudent(studentId: string): TaskSubmission[] {
    return this.db.submissions.filter((s) => s.studentId === studentId);
  }

  public submitTaskProof(taskId: string, submissionType: SubmissionType, submissionUrl: string, notes: string): TaskSubmission {
    const user = this.getCurrentUser();
    const profile = this.getStudentProfile(user.id);
    const task = this.getTaskById(taskId);

    if (!task) throw new Error('Task not found');
    if (!profile) throw new Error('Student profile not found');

    const newSub: TaskSubmission = {
      id: `sub-${Date.now()}`,
      taskId,
      taskTitle: task.title,
      studentId: user.id,
      studentName: user.name,
      studentRank: profile.currentRank,
      submissionType,
      submissionUrl,
      notes,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
    };

    this.db.submissions.unshift(newSub);
    task.submissionsCount = (task.submissionsCount || 0) + 1;

    this.addNotification(
      'user-priya-c', // Mentor
      'New Task Submission for Review',
      `${user.name} submitted proof for "${task.title}".`,
      'INFO',
      '/teacher/mentorship'
    );

    this.addAuditLog('TASK_SUBMITTED', user.id, user.name, `Submitted proof for task: ${task.title}`);
    this.persist();
    return newSub;
  }

  public reviewTaskSubmission(submissionId: string, status: 'APPROVED' | 'REJECTED' | 'REVISION_REQUIRED', feedback: string) {
    const reviewer = this.getCurrentUser();
    const sub = this.db.submissions.find((s) => s.id === submissionId);
    if (!sub) throw new Error('Submission not found');

    const task = this.getTaskById(sub.taskId);
    if (!task) throw new Error('Task not found');

    const wasAlreadyApproved = sub.status === 'APPROVED';
    sub.status = status;
    sub.feedback = feedback;
    sub.reviewedByMentorId = reviewer.id;
    sub.reviewedByMentorName = reviewer.name;
    sub.reviewedAt = new Date().toISOString();

    if (status === 'APPROVED' && !wasAlreadyApproved) {
      const studentProfile = this.db.studentProfiles[sub.studentId];
      if (studentProfile) {
        // Award MANA
        const manaAward = task.manaReward;
        studentProfile.manaBalance += manaAward;
        studentProfile.tasksCompleted += 1;
        sub.manaAwarded = manaAward;

        // Create MANA transaction
        this.db.manaTransactions.unshift({
          id: `mtx-${Date.now()}`,
          userId: sub.studentId,
          type: 'EARN',
          amount: manaAward,
          sourceReason: `Task Approved: ${task.title}`,
          relatedEntityType: 'TASK',
          relatedEntityId: task.id,
          timestamp: new Date().toISOString(),
        });

        // Award ZENI if paid task
        if (task.zeniReward > 0) {
          studentProfile.zeniBalance += task.zeniReward;
          sub.zeniAwarded = task.zeniReward;
          this.db.zeniTransactions.unshift({
            id: `ztx-${Date.now()}`,
            userId: sub.studentId,
            type: 'EARN',
            amount: task.zeniReward,
            balanceAfter: studentProfile.zeniBalance,
            reason: `Paid Task Reward: ${task.title}`,
            relatedEntityType: 'BOUNTY',
            relatedEntityId: task.id,
            timestamp: new Date().toISOString(),
            status: 'COMPLETED',
          });
        }

        // Check if student meets Rank D criteria
        if (
          studentProfile.currentRank === 'E' &&
          studentProfile.tasksCompleted >= this.db.economyConfig.minTasksRankD &&
          studentProfile.trustScore >= this.db.economyConfig.minTrustScoreRankD
        ) {
          studentProfile.isDReady = true;
          this.addNotification(
            sub.studentId,
            'Rank D Ready!',
            'Congratulations! You have satisfied all criteria for Rank D. Click to choose your career path.',
            'ACHIEVEMENT',
            '/student/rank'
          );
        }

        this.addNotification(
          sub.studentId,
          'Task Approved! 🎉',
          `Mentor ${reviewer.name} approved your submission for "${task.title}" (+${manaAward} MANA awarded).`,
          'SUCCESS',
          '/student/tasks'
        );

        // Record Verified Student Leaderboard Event (Anti-cheat: Idempotency check prevents duplicate points)
        const taskDiffPoints = task.difficulty === 'ADVANCED' ? 350 : task.difficulty === 'INTERMEDIATE' ? 180 : 100;
        const eligibleScore = taskDiffPoints + (task.manaReward || 0);

        // Find student's guild if any
        const studentGuild = this.db.guilds.find(
          (g) => g.leaderId === sub.studentId || g.members?.some((m) => m.studentId === sub.studentId)
        );

        this.recordLeaderboardScoreEvent({
          category: 'STUDENT',
          userId: sub.studentId,
          guildId: studentGuild?.id,
          activityType: 'TASK_APPROVED',
          referenceId: task.id,
          points: eligibleScore,
          description: `Verified task approval: ${task.title}`,
          verificationStatus: 'VERIFIED',
          verifiedBy: reviewer.id,
          idempotencyKey: `evt_task_${task.id}_${sub.studentId}`,
        });

        // Record Guild Collective Contribution Event
        if (studentGuild) {
          this.recordLeaderboardScoreEvent({
            category: 'GUILD',
            userId: sub.studentId,
            guildId: studentGuild.id,
            activityType: 'TASK_APPROVED',
            referenceId: task.id,
            points: taskDiffPoints,
            description: `Collective verified member contribution for task: ${task.title}`,
            verificationStatus: 'VERIFIED',
            verifiedBy: reviewer.id,
            idempotencyKey: `evt_gld_task_${task.id}_${sub.studentId}`,
          });
        }
      }

      // Reward Mentor with MANA (+50 MANA for review work)
      const mentorProfile = this.db.studentProfiles[reviewer.id];
      if (mentorProfile) {
        mentorProfile.manaBalance += 50;
        this.db.manaTransactions.unshift({
          id: `mtx-${Date.now() + 1}`,
          userId: reviewer.id,
          type: 'EARN',
          amount: 50,
          sourceReason: `Mentorship: Reviewed and approved task submission by ${sub.studentName}`,
          relatedEntityType: 'MENTORSHIP',
          relatedEntityId: sub.id,
          timestamp: new Date().toISOString(),
        });

        // Record verified Teacher/Mentor Leaderboard Event
        this.recordLeaderboardScoreEvent({
          category: 'TEACHER',
          userId: reviewer.id,
          activityType: 'MENTORSHIP_REVIEW',
          referenceId: sub.id,
          points: 75,
          description: `Verified mentorship evaluation for ${sub.studentName}`,
          verificationStatus: 'VERIFIED',
          verifiedBy: reviewer.id,
          idempotencyKey: `evt_mentor_review_${sub.id}_${reviewer.id}`,
        });
      }
    }

    this.addAuditLog('TASK_REVIEWED', reviewer.id, reviewer.name, `Reviewed submission ${submissionId} with status: ${status}`);
    this.persist();
  }

  public promoteStudentToRankD(studentId: string, growthPath: GrowthPath) {
    const profile = this.db.studentProfiles[studentId];
    if (!profile) throw new Error('Student profile not found');
    profile.currentRank = 'D';
    profile.growthPath = growthPath;
    profile.isDReady = false;

    // Grant TEACHER capability if Teaching or Both
    const user = this.db.users.find((u) => u.id === studentId);
    if (user && !user.capabilities.includes('TEACHER')) {
      user.capabilities.push('TEACHER');
    }

    this.addNotification(
      studentId,
      'Promoted to Rank D! 🛡️',
      `You are now a Rank D student! You unlocked course creation, teaching revenue, and paid bounties. Growth path: ${growthPath}.`,
      'ACHIEVEMENT',
      '/student/dashboard'
    );

    this.addAuditLog('RANK_PROMOTION', studentId, user?.name || studentId, `Promoted to Rank D with growth path: ${growthPath}`);
    this.persist();
  }

  // Courses & Capacity System (FLOWS 2, 3, 4, 5, 6)
  public getCourses(): Course[] {
    return this.db.courses;
  }

  public getCourseById(id: string): Course | undefined {
    return this.db.courses.find((c) => c.id === id);
  }

  public getCoursesByTeacher(teacherId: string): Course[] {
    return this.db.courses.filter((c) => c.teacherId === teacherId);
  }

  public getEnrollmentsByStudent(studentId: string): CourseEnrollment[] {
    return this.db.enrollments.filter((e) => e.studentId === studentId);
  }

  public isStudentEnrolled(courseId: string, studentId: string): boolean {
    return this.db.enrollments.some((e) => e.courseId === courseId && e.studentId === studentId);
  }

  public createCourse(data: {
    title: string;
    description: string;
    skills: string[];
    curriculum: string[];
    priceZeni: number;
    meetUrl: string;
  }): Course {
    const user = this.getCurrentUser();
    const profile = this.getStudentProfile(user.id);
    if (!profile || (profile.currentRank !== 'D' && profile.currentRank !== 'C' && profile.currentRank !== 'B' && profile.currentRank !== 'A')) {
      throw new Error('Only students of Rank D or higher can create and teach courses.');
    }

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: data.title,
      description: data.description,
      teacherId: user.id,
      teacherName: user.name,
      teacherRank: profile.currentRank,
      teacherTrustScore: profile.trustScore,
      teacherAvatar: user.avatar,
      skills: data.skills,
      curriculum: data.curriculum,
      priceZeni: data.priceZeni,
      batchCapacity: this.db.economyConfig.defaultCourseCapacity, // Starts at 10
      enrolledCount: 0,
      rating: 5.0,
      reviewsCount: 0,
      meetUrl: data.meetUrl || 'https://meet.google.com/uni-para-demo',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      sessions: [
        {
          id: `sess-${Date.now()}-1`,
          courseId: `course-${Date.now()}`,
          topic: 'Orientation & Core Foundations',
          date: 'Next Saturday',
          startTime: '05:00 PM',
          endTime: '06:30 PM',
          meetUrl: data.meetUrl || 'https://meet.google.com/uni-para-demo',
          lessonNumber: 1,
          status: 'UPCOMING',
        },
      ],
      lessons: [
        {
          id: `less-${Date.now()}-1`,
          courseId: `course-${Date.now()}`,
          title: 'Course Introduction & Environment Setup',
          description: 'Overview of skills, practical setup, and milestone project roadmap.',
          durationMinutes: 60,
          orderIndex: 1,
        },
      ],
      reviews: [],
    };

    this.db.courses.unshift(newCourse);
    profile.courseBatchesTaught = (profile.courseBatchesTaught || 0) + 1;

    this.addAuditLog('COURSE_CREATED', user.id, user.name, `Created course: ${data.title} at ${data.priceZeni} ZENI`);
    this.persist();
    return newCourse;
  }

  public enrollInCourse(courseId: string, studentId?: string): { success: boolean; message: string } {
    const sid = studentId || this.db.currentUserId;
    const studentUser = this.db.users.find((u) => u.id === sid);
    const studentProfile = this.db.studentProfiles[sid];
    const course = this.getCourseById(courseId);

    if (!course) throw new Error('Course not found');
    if (!studentProfile || !studentUser) throw new Error('Student profile not found');

    // 1. Check if already enrolled
    if (this.isStudentEnrolled(courseId, sid)) {
      throw new Error('Student is already enrolled in this course.');
    }

    // 2. Check capacity (FLOW 4)
    if (course.enrolledCount >= course.batchCapacity) {
      throw new Error('BATCH FULL. This batch has reached maximum capacity. The instructor must upgrade seats.');
    }

    // 3. Check student ZENI balance
    if (studentProfile.zeniBalance < course.priceZeni) {
      throw new Error(`Insufficient ZENI balance. You need ${course.priceZeni} ZENI (current balance: ${studentProfile.zeniBalance} ZENI).`);
    }

    // 4. Calculate Economic Split (Section 15: 85% Teacher, 15% Platform)
    const teacherShare = Math.round(course.priceZeni * (this.db.economyConfig.courseTeacherPayoutPct / 100));
    const platformShare = course.priceZeni - teacherShare;

    // Deduct student balance
    studentProfile.zeniBalance -= course.priceZeni;

    // Credit teacher balance
    const teacherProfile = this.db.studentProfiles[course.teacherId];
    if (teacherProfile) {
      teacherProfile.zeniBalance += teacherShare;
      teacherProfile.manaBalance += 50; // Extra MANA reward for teaching enrollment
    }

    // Increment course enrolled count
    course.enrolledCount += 1;

    // Record enrollment
    const newEnrollment: CourseEnrollment = {
      id: `enr-${Date.now()}`,
      courseId: course.id,
      studentId: sid,
      studentName: studentUser.name,
      studentRank: studentProfile.currentRank,
      enrolledAt: new Date().toISOString(),
      zeniPaid: course.priceZeni,
      completedLessons: 0,
    };
    this.db.enrollments.push(newEnrollment);

    // Ledger transactions
    const now = new Date().toISOString();
    // Student Debit
    this.db.zeniTransactions.unshift({
      id: `ztx-${Date.now()}-1`,
      userId: sid,
      type: 'COURSE_PURCHASE',
      amount: -course.priceZeni,
      balanceAfter: studentProfile.zeniBalance,
      reason: `Purchased Course: ${course.title}`,
      senderId: sid,
      receiverId: course.teacherId,
      relatedEntityType: 'COURSE',
      relatedEntityId: course.id,
      timestamp: now,
      status: 'COMPLETED',
    });

    // Teacher Credit
    if (teacherProfile) {
      this.db.zeniTransactions.unshift({
        id: `ztx-${Date.now()}-2`,
        userId: course.teacherId,
        type: 'EARN',
        amount: teacherShare,
        balanceAfter: teacherProfile.zeniBalance,
        reason: `Course Revenue (${this.db.economyConfig.courseTeacherPayoutPct}% Share): ${course.title} enrollment by ${studentUser.name}`,
        senderId: sid,
        receiverId: course.teacherId,
        relatedEntityType: 'COURSE',
        relatedEntityId: course.id,
        timestamp: now,
        status: 'COMPLETED',
      });
    }

    // Platform Fee
    this.db.zeniTransactions.unshift({
      id: `ztx-${Date.now()}-3`,
      userId: 'user-admin',
      type: 'PLATFORM_FEE',
      amount: platformShare,
      balanceAfter: 25000,
      reason: `Course Platform Fee (${this.db.economyConfig.coursePlatformFeePct}%): ${course.title}`,
      senderId: sid,
      receiverId: 'user-admin',
      relatedEntityType: 'COURSE',
      relatedEntityId: course.id,
      timestamp: now,
      status: 'COMPLETED',
    });

    // Notifications
    this.addNotification(
      course.teacherId,
      'New Student Enrolled! 🎓',
      `${studentUser.name} enrolled in "${course.title}". +${teacherShare} ZENI and +50 MANA credited!`,
      'SUCCESS',
      `/teacher/courses/${course.id}/students`
    );

    this.addNotification(
      sid,
      'Enrollment Successful! 🚀',
      `You are now enrolled in "${course.title}". Access lessons, live Google Meet sessions, and private course chat.`,
      'SUCCESS',
      `/student/courses/${course.id}`
    );

    this.addAuditLog('COURSE_ENROLLED', sid, studentUser.name, `Enrolled in ${course.title} for ${course.priceZeni} ZENI`);
    this.persist();
    return { success: true, message: 'Successfully enrolled in course!' };
  }

  public upgradeCourseCapacity(courseId: string): { success: boolean; newCapacity: number } {
    const user = this.getCurrentUser();
    const course = this.getCourseById(courseId);
    if (!course) throw new Error('Course not found');
    if (course.teacherId !== user.id && user.role !== 'ADMIN') {
      throw new Error('Only the course instructor or an administrator can upgrade batch capacity.');
    }

    const teacherProfile = this.db.studentProfiles[user.id];
    const cost = this.db.economyConfig.capacityUpgradeCost; // 500 ZENI
    const increment = this.db.economyConfig.capacityUpgradeSize; // +10 seats

    if (user.role !== 'ADMIN') {
      if (!teacherProfile || teacherProfile.zeniBalance < cost) {
        throw new Error(`Insufficient ZENI. Capacity upgrade costs ${cost} ZENI (current balance: ${teacherProfile?.zeniBalance || 0} ZENI).`);
      }
      teacherProfile.zeniBalance -= cost;
    }

    const prevCapacity = course.batchCapacity;
    course.batchCapacity += increment;

    // Record upgrade entity (Section 16)
    const upgradeRecord: CourseCapacityUpgrade = {
      id: `upgrade-${Date.now()}`,
      courseId: course.id,
      courseTitle: course.title,
      teacherId: user.id,
      previousCapacity: prevCapacity,
      newCapacity: course.batchCapacity,
      zeniCost: cost,
      timestamp: new Date().toISOString(),
    };
    this.db.capacityUpgrades.push(upgradeRecord);

    // Ledger record
    this.db.zeniTransactions.unshift({
      id: `ztx-${Date.now()}`,
      userId: user.id,
      type: 'CAPACITY_UPGRADE',
      amount: -cost,
      balanceAfter: teacherProfile ? teacherProfile.zeniBalance : 0,
      reason: `Batch Capacity Upgrade (+${increment} seats) for ${course.title}`,
      senderId: user.id,
      receiverId: 'user-admin',
      relatedEntityType: 'COURSE',
      relatedEntityId: course.id,
      timestamp: new Date().toISOString(),
      status: 'COMPLETED',
    });

    this.addNotification(
      user.id,
      'Batch Capacity Expanded! 📈',
      `Expanded seats from ${prevCapacity} to ${course.batchCapacity}. New students can now enroll.`,
      'SUCCESS',
      `/teacher/courses/${course.id}`
    );

    this.addAuditLog('CAPACITY_UPGRADED', user.id, user.name, `Expanded capacity of ${course.title} from ${prevCapacity} to ${course.batchCapacity}`);
    this.persist();
    return { success: true, newCapacity: course.batchCapacity };
  }

  // Course Chat (FLOW 5)
  public getCourseMessages(courseId: string): CourseMessage[] {
    return this.db.courseMessages.filter((m) => m.courseId === courseId);
  }

  public postCourseMessage(courseId: string, message: string): CourseMessage {
    const user = this.getCurrentUser();
    const course = this.getCourseById(courseId);
    if (!course) throw new Error('Course not found');

    const isTeacher = course.teacherId === user.id;
    const isEnrolled = this.isStudentEnrolled(courseId, user.id);

    if (!isTeacher && !isEnrolled && user.role !== 'ADMIN') {
      throw new Error('Access denied. Only the instructor and enrolled students can view or send messages in private course chat.');
    }

    const profile = this.getStudentProfile(user.id);
    const newMsg: CourseMessage = {
      id: `msg-${Date.now()}`,
      courseId,
      senderId: user.id,
      senderName: user.name,
      senderRank: profile?.currentRank || 'D',
      senderAvatar: user.avatar,
      isTeacher,
      message,
      timestamp: new Date().toISOString(),
    };

    this.db.courseMessages.push(newMsg);
    this.persist();
    return newMsg;
  }

  public addCourseReview(courseId: string, rating: number, comment: string): CourseReview {
    const user = this.getCurrentUser();
    const course = this.getCourseById(courseId);
    if (!course) throw new Error('Course not found');

    if (!this.isStudentEnrolled(courseId, user.id)) {
      throw new Error('Only enrolled students can review this course.');
    }

    const profile = this.getStudentProfile(user.id);
    const newRev: CourseReview = {
      id: `rev-${Date.now()}`,
      courseId,
      studentId: user.id,
      studentName: user.name,
      studentRank: profile?.currentRank || 'E',
      studentAvatar: user.avatar,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    course.reviews = course.reviews || [];
    course.reviews.push(newRev);
    course.reviewsCount = course.reviews.length;

    // Recalculate average rating
    const avg = course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length;
    course.rating = Math.round(avg * 10) / 10;

    // Update teacher profile rating & trust score
    const teacherProfile = this.db.studentProfiles[course.teacherId];
    if (teacherProfile) {
      teacherProfile.teachingRating = course.rating;
      if (course.rating >= 4.5) {
        teacherProfile.trustScore = Math.min(5.0, Math.round((teacherProfile.trustScore + 0.05) * 100) / 100);
      }
    }

    this.addNotification(
      course.teacherId,
      'New Student Review Received ⭐',
      `${user.name} rated your course ${rating} Stars: "${comment.slice(0, 60)}..."`,
      'INFO',
      `/teacher/dashboard`
    );

    this.persist();
    return newRev;
  }

  // Guilds (FLOW 7)
  public getGuilds(): Guild[] {
    return this.db.guilds;
  }

  public getGuildById(id: string): Guild | undefined {
    return this.db.guilds.find((g) => g.id === id);
  }

  public createGuild(name: string, tagline: string, description: string, skills: string[]): Guild {
    const user = this.getCurrentUser();
    const profile = this.getStudentProfile(user.id);

    if (!profile || (profile.currentRank !== 'C' && profile.currentRank !== 'B' && profile.currentRank !== 'A')) {
      throw new Error('Only Rank C or higher students can create a Guild.');
    }

    const newGuild: Guild = {
      id: `guild-${Date.now()}`,
      name,
      logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=150&auto=format&fit=crop&q=80',
      tagline,
      description,
      leaderId: user.id,
      leaderName: user.name,
      leaderRank: profile.currentRank,
      skills,
      trustScore: profile.trustScore,
      completedProjects: 0,
      totalZeniEarned: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      members: [
        {
          id: `gm-${Date.now()}`,
          guildId: `guild-${Date.now()}`,
          studentId: user.id,
          studentName: user.name,
          studentRank: profile.currentRank,
          studentAvatar: user.avatar,
          role: 'UI/UX Designer',
          sharePercentage: 100,
          joinedAt: new Date().toISOString(),
        },
      ],
    };

    this.db.guilds.push(newGuild);
    this.addAuditLog('GUILD_CREATED', user.id, user.name, `Created guild: ${name}`);
    this.persist();
    return newGuild;
  }

  public joinGuild(guildId: string): Guild {
    const user = this.getCurrentUser();
    const profile = this.getStudentProfile(user.id);
    if (!profile) throw new Error('Only students can join a Guild.');

    const guild = this.getGuildById(guildId);
    if (!guild) throw new Error('Guild not found.');

    const alreadyMember = guild.members.some((m) => m.studentId === user.id);
    if (alreadyMember) throw new Error('Already a member of this Guild.');

    const newMember: GuildMember = {
      id: `gm-${Date.now()}`,
      guildId: guild.id,
      studentId: user.id,
      studentName: user.name,
      studentRank: profile.currentRank,
      studentAvatar: user.avatar,
      role: 'Apprentice',
      sharePercentage: 10,
      joinedAt: new Date().toISOString(),
    };

    guild.members.push(newMember);
    this.addAuditLog('GUILD_JOINED', user.id, user.name, `Joined guild: ${guild.name}`);
    this.persist();
    return guild;
  }

  // Mentorship (FLOW 7)
  public getMentorRelationships(): MentorRelationship[] {
    return this.db.mentorRelationships;
  }

  public getMentorRelationshipByMentor(mentorId: string): MentorRelationship[] {
    return this.db.mentorRelationships.filter((m) => m.mentorId === mentorId);
  }

  // Bounties, Hiring, Escrow & Payment Split (FLOW 8)
  public getBounties(): Bounty[] {
    return this.db.bounties;
  }

  public getBountyById(id: string): Bounty | undefined {
    return this.db.bounties.find((b) => b.id === id);
  }

  public postBounty(data: {
    title: string;
    description: string;
    skills: string[];
    budgetZeni: number;
    deadline: string;
    minRank: RankCode;
    targetType: 'INDIVIDUAL' | 'GUILD';
    deliverables: string[];
  }): Bounty {
    const user = this.getCurrentUser();
    const company = this.getCompanyProfile(user.id);
    if (!company && user.role !== 'ADMIN') throw new Error('Only registered companies or admins can post bounties.');

    const newBounty: Bounty = {
      id: `bounty-${Date.now()}`,
      companyId: company?.id || 'company-novatech',
      companyName: company?.companyName || 'NovaTech Labs',
      companyLogo: company?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      title: data.title,
      description: data.description,
      skills: data.skills,
      budgetZeni: data.budgetZeni,
      deadline: data.deadline,
      minRank: data.minRank,
      targetType: data.targetType,
      deliverables: data.deliverables,
      status: 'OPEN',
      applicationsCount: 0,
      createdAt: new Date().toISOString(),
    };

    this.db.bounties.unshift(newBounty);
    if (company) company.bountiesPosted += 1;

    this.addAuditLog('BOUNTY_POSTED', user.id, user.name, `Posted bounty: ${data.title} (${data.budgetZeni} ZENI)`);
    this.persist();
    return newBounty;
  }

  public getApplications(): Application[] {
    return this.db.applications;
  }

  public getApplicationsByBounty(bountyId: string): Application[] {
    return this.db.applications.filter((a) => a.bountyId === bountyId);
  }

  public applyToBounty(
    bountyId: string,
    applicantType: 'STUDENT' | 'GUILD',
    proposedDeliveryDays: number,
    proposal: string,
    guildId?: string
  ): Application {
    const user = this.getCurrentUser();
    const bounty = this.getBountyById(bountyId);
    if (!bounty) throw new Error('Bounty not found');

    let applicantId = user.id;
    let applicantName = user.name;
    let applicantRank: RankCode = 'C';
    let applicantAvatar = user.avatar;
    let trustScore = 4.5;
    let skills: string[] = [];

    if (applicantType === 'GUILD') {
      const targetGuildId = guildId || 'guild-cyberforge';
      const guild = this.getGuildById(targetGuildId);
      if (!guild) throw new Error('Guild not found');
      applicantId = guild.id;
      applicantName = guild.name;
      applicantRank = guild.leaderRank;
      applicantAvatar = guild.logo;
      trustScore = guild.trustScore;
      skills = guild.skills;
    } else {
      const student = this.getStudentProfile(user.id);
      if (!student) throw new Error('Student profile not found');
      applicantRank = student.currentRank;
      trustScore = student.trustScore;
      skills = student.skills;
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      bountyId: bounty.id,
      bountyTitle: bounty.title,
      applicantType,
      applicantId,
      applicantName,
      applicantRank,
      applicantAvatar,
      trustScore,
      skills,
      proposedDeliveryDays,
      proposal,
      status: 'APPLIED',
      appliedAt: new Date().toISOString(),
    };

    this.db.applications.unshift(newApp);
    bounty.applicationsCount = (bounty.applicationsCount || 0) + 1;

    this.addNotification(
      'user-novatech',
      'New Bounty Application Received 📥',
      `${applicantName} applied to "${bounty.title}".`,
      'INFO',
      '/company/applications'
    );

    this.addAuditLog('BOUNTY_APPLICATION', user.id, user.name, `Applied to bounty: ${bounty.title}`);
    this.persist();
    return newApp;
  }

  public hireApplicantAndLockEscrow(bountyId: string, applicationId: string): { project: Project; escrow: Escrow } {
    const companyUser = this.getCurrentUser();
    const bounty = this.getBountyById(bountyId);
    const app = this.db.applications.find((a) => a.id === applicationId);

    if (!bounty) throw new Error('Bounty not found');
    if (!app) throw new Error('Application not found');

    const company = this.getCompanyProfile(companyUser.id);
    const budget = bounty.budgetZeni;

    // Check if company has enough budget
    if (company && company.totalSpentZeni && company.totalSpentZeni < 0) {
      // simulated check
    }

    // 1. Calculate Escrow Amounts (Section 33 & 34: 15% Platform fee, 85% Net Payout)
    const platformFee = Math.round(budget * (this.db.economyConfig.projectPlatformFeePct / 100)); // 9,000 ZENI on 60,000
    const netPayout = budget - platformFee; // 51,000 ZENI on 60,000

    // 2. Create Escrow Record (Status: LOCKED)
    const newEscrow: Escrow = {
      id: `escrow-${Date.now()}`,
      projectId: `proj-${Date.now()}`,
      bountyId: bounty.id,
      companyId: bounty.companyId,
      companyName: bounty.companyName,
      beneficiaryType: app.applicantType,
      beneficiaryId: app.applicantId,
      beneficiaryName: app.applicantName,
      totalAmountZeni: budget,
      platformFeeZeni: platformFee,
      netPayoutZeni: netPayout,
      status: 'LOCKED',
      fundedAt: new Date().toISOString(),
    };
    this.db.escrows.unshift(newEscrow);

    // 3. Create Project Workspace
    const newProject: Project = {
      id: newEscrow.projectId,
      bountyId: bounty.id,
      title: bounty.title,
      companyId: bounty.companyId,
      companyName: bounty.companyName,
      hiredType: app.applicantType,
      hiredId: app.applicantId,
      hiredName: app.applicantName,
      budgetZeni: budget,
      deadline: bounty.deadline,
      status: 'IN_PROGRESS',
      escrowId: newEscrow.id,
      tasks: [
        { id: 'pt-1', title: 'System Architecture & Database Schema Design', assigneeName: 'Rahul Verma (Backend)', status: 'DONE', dueDate: 'Day 3' },
        { id: 'pt-2', title: 'Interactive Cybernetic Figma Mockups & Design Tokens', assigneeName: 'Priya Singh (UI/UX)', status: 'DONE', dueDate: 'Day 5' },
        { id: 'pt-3', title: 'Full Stack Frontend Implementation with React & Tailwind', assigneeName: 'Aarav Sharma (Frontend)', status: 'IN_PROGRESS', dueDate: 'Day 10' },
        { id: 'pt-4', title: 'Automated QA End-to-End Escrow Testing', assigneeName: 'Neha Patel (QA)', status: 'TODO', dueDate: 'Day 12' },
      ],
      milestones: [
        { id: 'm-1', title: 'Phase 1: Architecture & UI Prototype', description: 'Design specs and DB constraints approved', amountZeni: Math.round(budget * 0.4), status: 'APPROVED' },
        { id: 'm-2', title: 'Phase 2: Functional Core & API Endpoints', description: 'Working full stack MVP and unit tests', amountZeni: Math.round(budget * 0.4), status: 'SUBMITTED' },
        { id: 'm-3', title: 'Phase 3: Production QA & Release', description: 'Complete documentation and deployment ready', amountZeni: Math.round(budget * 0.2), status: 'PENDING' },
      ],
    };
    this.db.projects.unshift(newProject);

    // 4. Update Bounty & Application status
    bounty.status = 'IN_PROGRESS';
    app.status = 'ACCEPTED';

    // 5. Debit Company for Escrow Funding
    this.db.zeniTransactions.unshift({
      id: `ztx-${Date.now()}`,
      userId: companyUser.id,
      type: 'ESCROW_LOCK',
      amount: -budget,
      balanceAfter: 90000,
      reason: `Funded Escrow for Project: ${bounty.title}`,
      senderId: companyUser.id,
      receiverId: 'ESCROW_VAULT',
      relatedEntityType: 'ESCROW',
      relatedEntityId: newEscrow.id,
      timestamp: new Date().toISOString(),
      status: 'COMPLETED',
    });

    // Notify hired applicant
    const notifyTargetId = app.applicantType === 'GUILD' ? 'user-priya-c' : app.applicantId;
    this.addNotification(
      notifyTargetId,
      'You are Hired! Escrow Locked 🔒',
      `NovaTech Labs hired ${app.applicantName} for "${bounty.title}". Escrow vault locked with ${budget.toLocaleString()} ZENI. Work has commenced!`,
      'SUCCESS',
      `/student/projects/${newProject.id}`
    );

    this.addAuditLog('ESCROW_LOCKED', companyUser.id, companyUser.name, `Funded ${budget} ZENI in escrow for project: ${bounty.title}`);
    this.persist();
    return { project: newProject, escrow: newEscrow };
  }

  public getProjects(): Project[] {
    return this.db.projects;
  }

  public getProjectById(id: string): Project | undefined {
    return this.db.projects.find((p) => p.id === id);
  }

  public submitProjectDeliverable(projectId: string, deliverableUrl: string, deliverableNotes: string) {
    const user = this.getCurrentUser();
    const project = this.getProjectById(projectId);
    if (!project) throw new Error('Project not found');

    project.deliverableUrl = deliverableUrl;
    project.deliverableNotes = deliverableNotes;
    project.submittedAt = new Date().toISOString();
    project.status = 'SUBMITTED_FOR_REVIEW';

    this.addNotification(
      'user-novatech',
      'Deliverable Submitted for Review 📦',
      `${project.hiredName} submitted the final deliverable for "${project.title}". Review and release escrow payment.`,
      'INFO',
      `/company/projects/${project.id}`
    );

    this.addAuditLog('DELIVERABLE_SUBMITTED', user.id, user.name, `Submitted deliverable for project: ${project.title}`);
    this.persist();
  }

  public approveProjectAndReleaseEscrow(projectId: string): PaymentSplit {
    const companyUser = this.getCurrentUser();
    const project = this.getProjectById(projectId);
    if (!project) throw new Error('Project not found');

    const escrow = this.db.escrows.find((e) => e.id === project.escrowId || e.projectId === projectId);
    if (!escrow) throw new Error('Escrow record not found for this project');
    if (escrow.status === 'RELEASED') throw new Error('Escrow payment has already been released for this project.');

    // 1. Mark Escrow as RELEASED
    escrow.status = 'RELEASED';
    escrow.releasedAt = new Date().toISOString();

    // 2. Mark Project as APPROVED_AND_PAID
    project.status = 'APPROVED_AND_PAID';
    project.completedAt = new Date().toISOString();

    const totalGross = escrow.totalAmountZeni;
    const platformFee = escrow.platformFeeZeni; // 15% (e.g. 9,000)
    const netGuildPayout = escrow.netPayoutZeni; // 85% (e.g. 51,000)

    // Credit Platform Fee to Admin
    this.db.zeniTransactions.unshift({
      id: `ztx-${Date.now()}-fee`,
      userId: 'user-admin',
      type: 'PLATFORM_FEE',
      amount: platformFee,
      balanceAfter: 34000,
      reason: `Platform Fee (${this.db.economyConfig.projectPlatformFeePct}%) from Escrow Release for "${project.title}"`,
      senderId: 'ESCROW_VAULT',
      receiverId: 'user-admin',
      relatedEntityType: 'PROJECT',
      relatedEntityId: project.id,
      timestamp: new Date().toISOString(),
      status: 'COMPLETED',
    });

    const memberSplits: {
      studentId: string;
      studentName: string;
      role: string;
      percentage: number;
      amountZeni: number;
    }[] = [];

    // 3. Automated Guild Member Payment Split (Section 34)
    if (escrow.beneficiaryType === 'GUILD') {
      const guild = this.getGuildById(escrow.beneficiaryId);
      if (guild && guild.members && guild.members.length > 0) {
        guild.completedProjects += 1;
        guild.totalZeniEarned += netGuildPayout;

        // Calculate each member's exact share
        guild.members.forEach((member) => {
          const memberAmount = Math.round(netGuildPayout * (member.sharePercentage / 100));
          memberSplits.push({
            studentId: member.studentId,
            studentName: member.studentName,
            role: member.role,
            percentage: member.sharePercentage,
            amountZeni: memberAmount,
          });

          // Credit member wallet & MANA
          const profile = this.db.studentProfiles[member.studentId];
          if (profile) {
            profile.zeniBalance += memberAmount;
            profile.manaBalance += 200; // Extra MANA for corporate project completion
            profile.projectsCompleted += 1;
            profile.trustScore = Math.min(5.0, Math.round((profile.trustScore + 0.1) * 100) / 100);

            // Record transaction
            this.db.zeniTransactions.unshift({
              id: `ztx-${Date.now()}-${member.studentId}`,
              userId: member.studentId,
              type: 'EARN',
              amount: memberAmount,
              balanceAfter: profile.zeniBalance,
              reason: `Guild Project Payout (${member.sharePercentage}% as ${member.role}): ${project.title}`,
              senderId: 'ESCROW_VAULT',
              receiverId: member.studentId,
              relatedEntityType: 'PROJECT',
              relatedEntityId: project.id,
              timestamp: new Date().toISOString(),
              status: 'COMPLETED',
            });

            this.db.manaTransactions.unshift({
              id: `mtx-${Date.now()}-${member.studentId}`,
              userId: member.studentId,
              type: 'EARN',
              amount: 200,
              sourceReason: `Corporate Project Delivered: ${project.title}`,
              relatedEntityType: 'PROJECT',
              relatedEntityId: project.id,
              timestamp: new Date().toISOString(),
            });

            this.addNotification(
              member.studentId,
              'Escrow Payment Received! 💰',
              `NovaTech Labs approved "${project.title}". You received your ${member.sharePercentage}% share: +${memberAmount.toLocaleString()} ZENI and +200 MANA!`,
              'SUCCESS',
              '/student/wallet'
            );
          }
        });
      }
    } else {
      // Individual payout
      const studentProfile = this.db.studentProfiles[escrow.beneficiaryId];
      if (studentProfile) {
        studentProfile.zeniBalance += netGuildPayout;
        studentProfile.manaBalance += 300;
        studentProfile.projectsCompleted += 1;
        studentProfile.trustScore = Math.min(5.0, Math.round((studentProfile.trustScore + 0.15) * 100) / 100);

        memberSplits.push({
          studentId: escrow.beneficiaryId,
          studentName: escrow.beneficiaryName,
          role: 'Sole Contractor',
          percentage: 100,
          amountZeni: netGuildPayout,
        });

        this.db.zeniTransactions.unshift({
          id: `ztx-${Date.now()}-${escrow.beneficiaryId}`,
          userId: escrow.beneficiaryId,
          type: 'EARN',
          amount: netGuildPayout,
          balanceAfter: studentProfile.zeniBalance,
          reason: `Project Milestone Payout (85% Net): ${project.title}`,
          senderId: 'ESCROW_VAULT',
          receiverId: escrow.beneficiaryId,
          relatedEntityType: 'PROJECT',
          relatedEntityId: project.id,
          timestamp: new Date().toISOString(),
          status: 'COMPLETED',
        });
      }
    }

    // 4. Create PaymentSplit Record
    const paymentSplit: PaymentSplit = {
      id: `split-${Date.now()}`,
      projectId: project.id,
      escrowId: escrow.id,
      totalGrossZeni: totalGross,
      platformFeeZeni: platformFee,
      netGuildZeni: netGuildPayout,
      splits: memberSplits,
      processedAt: new Date().toISOString(),
    };
    this.db.paymentSplits.push(paymentSplit);

    this.addAuditLog('ESCROW_RELEASED', companyUser.id, companyUser.name, `Approved deliverable & released ${totalGross} ZENI (${netGuildPayout} net, ${platformFee} fee) for ${project.title}`);
    this.persist();
    return paymentSplit;
  }

  // Wallets & Transactions (FLOWS 1, 3, 8)
  public getManaTransactions(userId?: string): ManaTransaction[] {
    const uid = userId || this.db.currentUserId;
    return this.db.manaTransactions.filter((m) => m.userId === uid);
  }

  public getZeniTransactions(userId?: string): ZeniTransaction[] {
    const uid = userId || this.db.currentUserId;
    return this.db.zeniTransactions.filter((z) => z.userId === uid);
  }

  public getAllZeniTransactions(): ZeniTransaction[] {
    return this.db.zeniTransactions;
  }

  public getEscrows(): Escrow[] {
    return this.db.escrows;
  }

  public getPaymentSplits(): PaymentSplit[] {
    return this.db.paymentSplits;
  }

  // Notifications
  public getNotifications(userId?: string): Notification[] {
    const uid = userId || this.db.currentUserId;
    return this.db.notifications.filter((n) => n.userId === uid);
  }

  public markNotificationAsRead(id: string) {
    const n = this.db.notifications.find((notif) => notif.id === id);
    if (n) {
      n.read = true;
      this.persist();
    }
  }

  public markAllNotificationsAsRead(userId?: string) {
    const uid = userId || this.db.currentUserId;
    let changed = false;
    this.db.notifications.forEach((n) => {
      if (n.userId === uid && !n.read) {
        n.read = true;
        changed = true;
      }
    });
    if (changed) {
      this.persist();
    }
  }

  public addNotification(userId: string, title: string, message: string, type: 'SUCCESS' | 'INFO' | 'WARNING' | 'ACHIEVEMENT', link?: string) {
    this.db.notifications.unshift({
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      userId,
      title,
      message,
      type,
      link,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  // Audit Logs & Economy Config
  public getAuditLogs(): AuditLog[] {
    return this.db.auditLogs;
  }

  public addAuditLog(action: string, userId: string, userName: string, details: string) {
    this.db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      action,
      userId,
      userName,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  public updateEconomyConfig(config: Partial<EconomyConfig>) {
    this.db.economyConfig = { ...this.db.economyConfig, ...config };
    this.addAuditLog('ECONOMY_CONFIG_UPDATED', this.db.currentUserId, 'Admin', 'Updated platform commission or capacity settings');
    this.persist();
  }

  // ----------------------------------------------------------------------------
  // LEADERBOARD METHODS (STUDENTS | TEACHERS | GUILDS - STRICT SEPARATION)
  // ----------------------------------------------------------------------------

  public getLeaderboardEvents(): LeaderboardScoreEvent[] {
    return this.db.leaderboardEvents || [];
  }

  public recordLeaderboardScoreEvent(
    eventData: Omit<LeaderboardScoreEvent, 'id' | 'timestamp' | 'verificationStatus'> & {
      id?: string;
      timestamp?: string;
      verificationStatus?: 'VERIFIED' | 'REVOKED' | 'PENDING';
    }
  ): { event: LeaderboardScoreEvent; alreadyProcessed: boolean } {
    if (!this.db.leaderboardEvents) {
      this.db.leaderboardEvents = [...INITIAL_LEADERBOARD_EVENTS];
    }

    // Anti-Cheat: Idempotency duplicate check
    const existing = this.db.leaderboardEvents.find((e) => e.idempotencyKey === eventData.idempotencyKey);
    if (existing) {
      return { event: existing, alreadyProcessed: true };
    }

    const event: LeaderboardScoreEvent = {
      id: eventData.id || `lbe-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      category: eventData.category,
      userId: eventData.userId,
      guildId: eventData.guildId,
      activityType: eventData.activityType,
      referenceId: eventData.referenceId,
      points: Math.max(0, Number(eventData.points) || 0),
      description: eventData.description,
      verificationStatus: eventData.verificationStatus || 'VERIFIED',
      verifiedBy: eventData.verifiedBy || this.db.currentUserId,
      idempotencyKey: eventData.idempotencyKey,
      timestamp: eventData.timestamp || new Date().toISOString(),
    };

    this.db.leaderboardEvents.unshift(event);
    this.persist();
    return { event, alreadyProcessed: false };
  }

  public revokeLeaderboardScoreEvent(eventId: string, revokedBy?: string) {
    if (!this.db.leaderboardEvents) return;
    const event = this.db.leaderboardEvents.find((e) => e.id === eventId);
    if (!event) throw new Error(`Leaderboard event ${eventId} not found.`);

    event.verificationStatus = 'REVOKED';
    this.addAuditLog('LEADERBOARD_EVENT_REVOKED', revokedBy || this.db.currentUserId, 'Admin', `Revoked event ${eventId} (${event.points} pts)`);
    this.persist();
  }

  private getPeriodDateRange(period: LeaderboardPeriod): { start: Date; end: Date } {
    const now = new Date();
    const end = new Date(now);

    if (period === 'weekly') {
      const day = now.getUTCDay();
      const diffToMonday = (day === 0 ? -6 : 1) - day;
      const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diffToMonday, 0, 0, 0, 0));
      return { start, end };
    }

    if (period === 'monthly') {
      const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
      return { start, end };
    }

    return { start: new Date(0), end };
  }

  private getPreviousPeriodDateRange(period: LeaderboardPeriod): { start: Date; end: Date } | null {
    const now = new Date();

    if (period === 'weekly') {
      const day = now.getUTCDay();
      const diffToMonday = (day === 0 ? -6 : 1) - day;
      const currentWeekStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diffToMonday, 0, 0, 0, 0));
      const prevStart = new Date(currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000);
      const prevEnd = new Date(currentWeekStart.getTime() - 1);
      return { start: prevStart, end: prevEnd };
    }

    if (period === 'monthly') {
      const prevEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0, 23, 59, 59, 999));
      const prevStart = new Date(Date.UTC(prevEnd.getUTCFullYear(), prevEnd.getUTCMonth(), 1, 0, 0, 0, 0));
      return { start: prevStart, end: prevEnd };
    }

    return null;
  }

  public getStudentLeaderboard(
    period: LeaderboardPeriod = 'all-time',
    search: string = '',
    rankFilter: string = 'ALL',
    page: number = 1,
    limit: number = 10,
    currentUserId?: string
  ): LeaderboardResponse<StudentLeaderboardEntry> {
    const dateRange = this.getPeriodDateRange(period);
    const events = (this.db.leaderboardEvents || []).filter((e) => {
      if (e.category !== 'STUDENT' || e.verificationStatus !== 'VERIFIED') return false;
      const t = new Date(e.timestamp).getTime();
      return t >= dateRange.start.getTime() && t <= dateRange.end.getTime();
    });

    const eligibleStudents = this.db.users.filter(
      (u) => u.role === 'STUDENT' || (u.capabilities && u.capabilities.includes('STUDENT'))
    );

    // Compute previous period ranks for genuine rank movement
    const prevDateRange = this.getPreviousPeriodDateRange(period);
    const prevRankMap = new Map<string, number>();
    if (prevDateRange) {
      const prevEvents = (this.db.leaderboardEvents || []).filter((e) => {
        if (e.category !== 'STUDENT' || e.verificationStatus !== 'VERIFIED') return false;
        const t = new Date(e.timestamp).getTime();
        return t >= prevDateRange.start.getTime() && t <= prevDateRange.end.getTime();
      });

      const prevScores = eligibleStudents
        .map((s) => {
          const sEvents = prevEvents.filter((e) => e.userId === s.id);
          const score = sEvents.reduce((acc, e) => acc + (Number(e.points) || 0), 0);
          return { userId: s.id, score };
        })
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score);

      prevScores.forEach((item, index) => {
        prevRankMap.set(item.userId, index + 1);
      });
    }

    const aggregated = eligibleStudents.map((student) => {
      const sEvents = events.filter((e) => e.userId === student.id);
      const score = sEvents.reduce((acc, e) => acc + (Number(e.points) || 0), 0);

      const tasksCompleted = sEvents.filter((e) => e.activityType === 'TASK_APPROVED').length;
      const projectsCompleted = sEvents.filter((e) => e.activityType === 'PROJECT_COMPLETED').length;
      const achievementsCount = sEvents.filter((e) => e.activityType === 'ACHIEVEMENT_UNLOCKED').length;

      let guildId: string | undefined;
      let guildName: string | undefined;
      let guildRole: string | undefined;
      for (const g of this.db.guilds) {
        if (g.leaderId === student.id) {
          guildId = g.id;
          guildName = g.name;
          guildRole = 'Leader';
          break;
        }
        const m = g.members?.find((mem) => mem.studentId === student.id);
        if (m) {
          guildId = g.id;
          guildName = g.name;
          guildRole = m.role;
          break;
        }
      }

      const prevRank = prevRankMap.get(student.id);

      return {
        rank: 0,
        userId: student.id,
        name: student.name,
        avatar: student.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
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

    // Sort descending by score, tiebreak by tasksCompleted, then name
    aggregated.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.tasksCompleted !== a.tasksCompleted) return b.tasksCompleted - a.tasksCompleted;
      return a.name.localeCompare(b.name);
    });

    aggregated.forEach((item, index) => {
      item.rank = index + 1;
      if (item.prevRank !== undefined) {
        (item as any).rankMovement = item.prevRank - item.rank;
      } else {
        (item as any).rankMovement = null;
      }
      delete (item as any).prevRank;
    });

    // Compute user position before search filtering
    let userPosition: UserLeaderboardPosition | null = null;
    const targetUserId = currentUserId || this.db.currentUserId;
    if (targetUserId) {
      const idx = aggregated.findIndex((s) => s.userId === targetUserId);
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

    // Apply Filters
    let filtered = aggregated;
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.college.toLowerCase().includes(q) ||
          (s.guildName && s.guildName.toLowerCase().includes(q))
      );
    }

    if (rankFilter && rankFilter !== 'ALL') {
      filtered = filtered.filter((s) => s.studentRank === rankFilter);
    }

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

  public getTeacherLeaderboard(
    period: LeaderboardPeriod = 'all-time',
    search: string = '',
    page: number = 1,
    limit: number = 10,
    currentUserId?: string
  ): LeaderboardResponse<TeacherLeaderboardEntry> {
    const dateRange = this.getPeriodDateRange(period);
    const events = (this.db.leaderboardEvents || []).filter((e) => {
      if (e.category !== 'TEACHER' || e.verificationStatus !== 'VERIFIED') return false;
      const t = new Date(e.timestamp).getTime();
      return t >= dateRange.start.getTime() && t <= dateRange.end.getTime();
    });

    const eligibleTeachers = this.db.users.filter((u) => {
      const hasCapability = u.capabilities && u.capabilities.includes('TEACHER');
      const hasCourses = this.db.courses.some((c) => c.teacherId === u.id);
      return hasCapability || hasCourses;
    });

    const prevDateRange = this.getPreviousPeriodDateRange(period);
    const prevRankMap = new Map<string, number>();
    if (prevDateRange) {
      const prevEvents = (this.db.leaderboardEvents || []).filter((e) => {
        if (e.category !== 'TEACHER' || e.verificationStatus !== 'VERIFIED') return false;
        const t = new Date(e.timestamp).getTime();
        return t >= prevDateRange.start.getTime() && t <= prevDateRange.end.getTime();
      });

      const prevScores = eligibleTeachers
        .map((t) => {
          const tEvents = prevEvents.filter((e) => e.userId === t.id);
          const score = tEvents.reduce((acc, e) => acc + (Number(e.points) || 0), 0);
          return { teacherId: t.id, score };
        })
        .filter((t) => t.score > 0)
        .sort((a, b) => b.score - a.score);

      prevScores.forEach((item, index) => {
        prevRankMap.set(item.teacherId, index + 1);
      });
    }

    const aggregated = eligibleTeachers.map((teacher) => {
      const tEvents = events.filter((e) => e.userId === teacher.id);
      const score = tEvents.reduce((acc, e) => acc + (Number(e.points) || 0), 0);

      const batchesTaught = tEvents.filter((e) => e.activityType === 'BATCH_TAUGHT').length;
      const sessionsDelivered = tEvents.filter((e) => e.activityType === 'SESSION_DELIVERED').length;
      const studentsMentored = tEvents.filter((e) => e.activityType === 'MENTORSHIP_REVIEW').length;

      const teacherCourses = this.db.courses.filter((c) => c.teacherId === teacher.id);
      let totalRating = 0;
      let totalReviews = 0;
      teacherCourses.forEach((c) => {
        if (c.rating && c.reviewsCount) {
          totalRating += Number(c.rating) * Number(c.reviewsCount);
          totalReviews += Number(c.reviewsCount);
        }
      });
      const averageRating = totalReviews > 0 ? Number((totalRating / totalReviews).toFixed(2)) : 0;

      let guildName: string | undefined;
      for (const g of this.db.guilds) {
        if (g.leaderId === teacher.id || g.members?.some((m) => m.studentId === teacher.id)) {
          guildName = g.name;
          break;
        }
      }

      const prevRank = prevRankMap.get(teacher.id);

      return {
        rank: 0,
        teacherId: teacher.id,
        name: teacher.name,
        avatar: teacher.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
        teacherRank: teacher.rank || 'D',
        headline: teacher.headline || 'Course Instructor & Technical Mentor',
        college: teacher.college || 'Engineering Institute',
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

    aggregated.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.averageRating !== a.averageRating) return b.averageRating - a.averageRating;
      if (b.reviewsCount !== a.reviewsCount) return b.reviewsCount - a.reviewsCount;
      return a.name.localeCompare(b.name);
    });

    aggregated.forEach((item, index) => {
      item.rank = index + 1;
      if (item.prevRank !== undefined) {
        (item as any).rankMovement = item.prevRank - item.rank;
      } else {
        (item as any).rankMovement = null;
      }
      delete (item as any).prevRank;
    });

    let userPosition: UserLeaderboardPosition | null = null;
    const targetUserId = currentUserId || this.db.currentUserId;
    if (targetUserId) {
      const idx = aggregated.findIndex((t) => t.teacherId === targetUserId);
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

    let filtered = aggregated;
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.college.toLowerCase().includes(q) ||
          (t.headline && t.headline.toLowerCase().includes(q))
      );
    }

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

  public getGuildLeaderboard(
    period: LeaderboardPeriod = 'all-time',
    search: string = '',
    page: number = 1,
    limit: number = 10
  ): LeaderboardResponse<GuildLeaderboardEntry> {
    const dateRange = this.getPeriodDateRange(period);
    const periodEvents = (this.db.leaderboardEvents || []).filter((e) => {
      if (e.category !== 'GUILD' || e.verificationStatus !== 'VERIFIED') return false;
      const t = new Date(e.timestamp).getTime();
      return t >= dateRange.start.getTime() && t <= dateRange.end.getTime();
    });

    const studentEvents = (this.db.leaderboardEvents || []).filter((e) => {
      if (e.category !== 'STUDENT' || e.verificationStatus !== 'VERIFIED') return false;
      const t = new Date(e.timestamp).getTime();
      return t >= dateRange.start.getTime() && t <= dateRange.end.getTime();
    });

    const prevDateRange = this.getPreviousPeriodDateRange(period);
    const prevRankMap = new Map<string, number>();
    if (prevDateRange) {
      const prevGuildEvents = (this.db.leaderboardEvents || []).filter((e) => {
        if (e.category !== 'GUILD' || e.verificationStatus !== 'VERIFIED') return false;
        const t = new Date(e.timestamp).getTime();
        return t >= prevDateRange.start.getTime() && t <= prevDateRange.end.getTime();
      });

      const prevScores = this.db.guilds
        .map((g) => {
          const gEvents = prevGuildEvents.filter((e) => e.guildId === g.id);
          const score = gEvents.reduce((acc, e) => acc + (Number(e.points) || 0), 0);
          return { guildId: g.id, score };
        })
        .filter((g) => g.score > 0)
        .sort((a, b) => b.score - a.score);

      prevScores.forEach((item, index) => {
        prevRankMap.set(item.guildId, index + 1);
      });
    }

    const aggregated = this.db.guilds.map((guild) => {
      const directEvents = periodEvents.filter((e) => e.guildId === guild.id);
      const directScore = directEvents.reduce((acc, e) => acc + (Number(e.points) || 0), 0);

      const memberIds = new Set((guild.members || []).map((m) => m.studentId));
      if (guild.leaderId) memberIds.add(guild.leaderId);

      const contributingMemberIds = new Set<string>();
      let memberScoreSum = 0;

      directEvents.forEach((e) => {
        if (e.userId && memberIds.has(e.userId)) {
          contributingMemberIds.add(e.userId);
        }
      });

      studentEvents.forEach((se) => {
        if (se.guildId === guild.id && se.userId && memberIds.has(se.userId)) {
          contributingMemberIds.add(se.userId);
          if (!directEvents.some((de) => de.referenceId === se.referenceId && de.activityType === se.activityType)) {
            memberScoreSum += Number(se.points) || 0;
          }
        }
      });

      const totalScore = directScore + memberScoreSum;
      const completedProjectsCount =
        directEvents.filter((e) => e.activityType === 'PROJECT_COMPLETED').length || guild.completedProjects || 0;

      const prevRank = prevRankMap.get(guild.id);

      return {
        rank: 0,
        guildId: guild.id,
        name: guild.name,
        logo: guild.logo || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=150',
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

    aggregated.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.completedProjectsCount !== a.completedProjectsCount) return b.completedProjectsCount - a.completedProjectsCount;
      if (b.trustScore !== a.trustScore) return b.trustScore - a.trustScore;
      return a.name.localeCompare(b.name);
    });

    aggregated.forEach((item, index) => {
      item.rank = index + 1;
      if (item.prevRank !== undefined) {
        (item as any).rankMovement = item.prevRank - item.rank;
      } else {
        (item as any).rankMovement = null;
      }
      delete (item as any).prevRank;
    });

    let filtered = aggregated;
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.tagline.toLowerCase().includes(q) ||
          g.leaderName.toLowerCase().includes(q)
      );
    }

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

  public getUserLeaderboardPosition(
    userId: string,
    category: 'students' | 'teachers',
    period: LeaderboardPeriod = 'all-time'
  ): UserLeaderboardPosition | null {
    if (category === 'teachers') {
      const res = this.getTeacherLeaderboard(period, '', 1, 1000, userId);
      return res.userPosition || null;
    }
    const res = this.getStudentLeaderboard(period, '', 'ALL', 1, 1000, userId);
    return res.userPosition || null;
  }
}

export const store = new StoreService();
