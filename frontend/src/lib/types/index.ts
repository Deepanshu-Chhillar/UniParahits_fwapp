// UniParahits - Core Relational Types & Enums
// Strictly 5 Ranks: E -> D -> C -> B -> A

export type UserRole = 'STUDENT' | 'COMPANY' | 'ADMIN';

export type RankCode = 'E' | 'D' | 'C' | 'B' | 'A';

export type GrowthPath = 'PROJECT' | 'TEACHING' | 'BOTH';

export type TaskDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type TaskSubmissionStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUIRED';

export type SubmissionType = 'GITHUB' | 'FIGMA' | 'FILE' | 'WEBSITE' | 'TEXT' | 'VIDEO';

export type BountyStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'SUBMITTED' | 'COMPLETED' | 'CANCELLED';

export type ApplicationStatus = 'APPLIED' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED';

export type ProjectStatus = 'IN_PROGRESS' | 'SUBMITTED_FOR_REVIEW' | 'APPROVED_AND_PAID' | 'DISPUTED';

export type EscrowStatus = 'LOCKED' | 'RELEASED' | 'REFUNDED';

export type SessionStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED';

export type TransactionType = 'EARN' | 'SPEND' | 'ESCROW_LOCK' | 'ESCROW_RELEASE' | 'PLATFORM_FEE' | 'CAPACITY_UPGRADE' | 'COURSE_PURCHASE';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: UserRole;
  rank?: RankCode;
  capabilities: string[]; // 'STUDENT', 'TEACHER', 'MENTOR', 'GUILD_CREATOR', 'GUILD_LEADER'
  college?: string;
  headline?: string;
  createdAt: string;
}

export interface StudentProfile {
  userId: string;
  currentRank: RankCode;
  trustScore: number; // 0.0 - 5.0
  manaBalance: number;
  zeniBalance: number;
  growthPath?: GrowthPath;
  skills: string[];
  bio: string;
  githubUrl?: string;
  figmaUrl?: string;
  portfolioUrl?: string;
  college: string;
  tasksCompleted: number;
  projectsCompleted: number;
  courseBatchesTaught: number;
  teachingRating: number;
  mentorRecommended: boolean;
  proofApproved: boolean;
  isDReady: boolean;
  isCReady: boolean;
}

export interface CompanyProfile {
  id: string;
  userId: string;
  companyName: string;
  logo: string;
  industry: string;
  description: string;
  website: string;
  verified: boolean;
  trustScore: number;
  bountiesPosted: number;
  totalSpentZeni: number;
}

export interface RankDefinition {
  code: RankCode;
  title: string;
  level: number;
  color: string;
  minTasks: number;
  minTrustScore: number;
  minZeniEarned: number;
  minMana: number;
  description: string;
  unlocks: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'Frontend' | 'Backend' | 'UI/UX' | 'DevOps' | 'QA' | 'Full Stack';
  difficulty: TaskDifficulty;
  requiredSkills: string[];
  requiredRank: RankCode; // Minimum rank required
  minRank?: RankCode;
  manaReward: number;
  zeniReward: number; // 0 for free peer learning tasks, >0 for paid tasks
  deadline: string;
  submissionRequirements: string;
  active: boolean;
  submissionsCount: number;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  studentId: string;
  studentName: string;
  studentRank: RankCode;
  submissionType: SubmissionType;
  submissionUrl: string;
  notes: string;
  status: TaskSubmissionStatus;
  feedback?: string;
  reviewedByMentorId?: string;
  reviewedByMentorName?: string;
  manaAwarded?: number;
  zeniAwarded?: number;
  submittedAt: string;
  reviewedAt?: string;
}

export interface GuildMember {
  id: string;
  guildId: string;
  studentId: string;
  studentName: string;
  studentRank: RankCode;
  studentAvatar: string;
  role: 'Frontend Lead' | 'Backend Lead' | 'UI/UX Designer' | 'QA Engineer' | 'Full Stack' | 'Apprentice';
  sharePercentage: number; // e.g. 30 for 30%
  joinedAt: string;
}

export interface Guild {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  description: string;
  leaderId: string;
  leaderName: string;
  leaderRank: RankCode;
  skills: string[];
  trustScore: number;
  completedProjects: number;
  totalZeniEarned: number;
  members: GuildMember[];
  status: 'ACTIVE' | 'RECRUITING' | 'FULL';
  createdAt: string;
}

export interface MentorRelationship {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorRank: RankCode;
  studentId: string;
  studentName: string;
  studentRank: RankCode;
  status: 'ACTIVE' | 'COMPLETED';
  tasksReviewed: number;
  mentorNotes: string;
  recommendedForPromotion: boolean;
  startedAt: string;
}

export interface Bounty {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  description: string;
  skills: string[];
  budgetZeni: number;
  deadline: string;
  minRank: RankCode;
  targetType: 'INDIVIDUAL' | 'GUILD';
  deliverables: string[];
  status: BountyStatus;
  applicationsCount: number;
  createdAt: string;
}

export interface Application {
  id: string;
  bountyId: string;
  bountyTitle: string;
  applicantType: 'STUDENT' | 'GUILD';
  applicantId: string;
  applicantName: string;
  applicantRank: RankCode;
  applicantAvatar: string;
  trustScore: number;
  skills: string[];
  portfolioUrl?: string;
  proposedDeliveryDays: number;
  proposal: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  assigneeName: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amountZeni: number;
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED';
}

export interface Project {
  id: string;
  bountyId: string;
  title: string;
  companyId: string;
  companyName: string;
  hiredType: 'INDIVIDUAL' | 'GUILD' | 'STUDENT';
  hiredId: string;
  hiredName: string;
  budgetZeni: number;
  deadline: string;
  status: ProjectStatus;
  escrowId: string;
  deliverableUrl?: string;
  deliverableNotes?: string;
  submittedAt?: string;
  completedAt?: string;
  tasks: ProjectTask[];
  milestones: Milestone[];
}

export interface CourseSession {
  id: string;
  courseId: string;
  topic: string;
  date: string;
  startTime: string;
  endTime: string;
  meetUrl: string;
  lessonNumber: number;
  status: SessionStatus;
}

export interface CourseLesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  durationMinutes: number;
  orderIndex: number;
}

export interface CourseReview {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  studentRank: RankCode;
  studentAvatar: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface CourseMessage {
  id: string;
  courseId: string;
  senderId: string;
  senderName: string;
  senderRank: RankCode;
  senderAvatar: string;
  isTeacher: boolean;
  message: string;
  timestamp: string;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  studentRank: RankCode;
  enrolledAt: string;
  zeniPaid: number;
  completedLessons: number;
}

export interface CourseCapacityUpgrade {
  id: string;
  courseId: string;
  courseTitle: string;
  teacherId: string;
  previousCapacity: number;
  newCapacity: number;
  zeniCost: number;
  timestamp: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacherName: string;
  teacherRank: RankCode;
  teacherTrustScore: number;
  teacherAvatar: string;
  skills: string[];
  curriculum: string[];
  priceZeni: number;
  batchCapacity: number; // starts at 10
  maxCapacity?: number;
  level?: string;
  enrolledCount: number;
  rating: number;
  reviewsCount: number;
  sessions: CourseSession[];
  lessons: CourseLesson[];
  reviews: CourseReview[];
  meetUrl: string;
  status: 'ACTIVE' | 'DRAFT';
  createdAt: string;
}

export interface ManaTransaction {
  id: string;
  userId: string;
  type: 'EARN' | 'SPEND' | 'BONUS';
  amount: number;
  sourceReason: string;
  relatedEntityType?: 'TASK' | 'COURSE' | 'MENTORSHIP' | 'ACHIEVEMENT' | 'PROJECT';
  relatedEntityId?: string;
  timestamp: string;
}

export interface ZeniTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number; // positive or negative
  balanceAfter: number;
  reason: string;
  senderId?: string;
  receiverId?: string;
  relatedEntityType?: 'BOUNTY' | 'PROJECT' | 'COURSE' | 'CAPACITY_UPGRADE' | 'ESCROW';
  relatedEntityId?: string;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING';
}

export interface Escrow {
  id: string;
  projectId: string;
  bountyId: string;
  companyId: string;
  companyName: string;
  beneficiaryType: 'STUDENT' | 'GUILD';
  beneficiaryId: string;
  beneficiaryName: string;
  totalAmountZeni: number;
  platformFeeZeni: number; // 15%
  netPayoutZeni: number; // 85%
  status: EscrowStatus;
  fundedAt: string;
  releasedAt?: string;
}

export interface MemberPayoutSplit {
  studentId: string;
  studentName: string;
  role: string;
  percentage: number;
  amountZeni: number;
}

export interface PaymentSplit {
  id: string;
  projectId: string;
  escrowId: string;
  totalGrossZeni: number;
  platformFeeZeni: number;
  netGuildZeni: number;
  splits: MemberPayoutSplit[];
  processedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'SUCCESS' | 'INFO' | 'WARNING' | 'ACHIEVEMENT';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  manaReward: number;
  unlockedAt?: string;
}

export interface EconomyConfig {
  projectPlatformFeePct: number; // 15%
  guildPayoutPct: number; // 85%
  coursePlatformFeePct: number; // 15%
  courseTeacherPayoutPct: number; // 85%
  defaultCourseCapacity: number; // 10
  capacityUpgradeSize: number; // 10
  capacityUpgradeCost: number; // 500 ZENI
  minTrustScoreRankD: number; // 4.2
  minTasksRankD: number; // 10
  minManaRankD: number; // 1000
  minTrustScoreRankC: number; // 4.4
  minZeniEarnedRankC: number; // 5000
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  details: string;
  timestamp: string;
}

// ----------------------------------------------------------------------------
// STRICT LEADERBOARD TYPES (STUDENTS, TEACHERS, GUILDS - NO CROSS-ROLE RANKINGS)
// ----------------------------------------------------------------------------

export type LeaderboardPeriod = 'weekly' | 'monthly' | 'all-time';

export type LeaderboardCategory = 'students' | 'teachers' | 'guilds';

export type ScoreActivityType =
  | 'TASK_APPROVED'
  | 'PROJECT_COMPLETED'
  | 'ACHIEVEMENT_UNLOCKED'
  | 'BATCH_TAUGHT'
  | 'SESSION_DELIVERED'
  | 'MENTORSHIP_REVIEW'
  | 'COURSE_RATING';

export interface LeaderboardScoreEvent {
  id: string;
  category: 'STUDENT' | 'TEACHER' | 'GUILD';
  userId?: string;
  guildId?: string;
  activityType: ScoreActivityType;
  referenceId: string;
  points: number;
  description: string;
  verificationStatus: 'VERIFIED' | 'REVOKED' | 'PENDING';
  verifiedBy?: string;
  idempotencyKey: string;
  timestamp: string;
}

export interface StudentLeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  studentRank: RankCode;
  college: string;
  guildId?: string;
  guildName?: string;
  guildRole?: string;
  score: number;
  tasksCompleted: number;
  projectsCompleted: number;
  achievementsCount: number;
  rankMovement?: number | null; // +1, -1, 0, or null if no historical comparison
}

export interface TeacherLeaderboardEntry {
  rank: number;
  teacherId: string;
  name: string;
  avatar: string;
  teacherRank: RankCode;
  headline?: string;
  college: string;
  guildName?: string;
  score: number;
  batchesTaught: number;
  sessionsDelivered: number;
  studentsMentored: number;
  averageRating: number;
  reviewsCount: number;
  rankMovement?: number | null;
}

export interface GuildLeaderboardEntry {
  rank: number;
  guildId: string;
  name: string;
  logo: string;
  tagline: string;
  leaderName: string;
  leaderRank: RankCode;
  trustScore: number;
  score: number;
  contributingMembersCount: number;
  totalMembersCount: number;
  completedProjectsCount: number;
  rankMovement?: number | null;
}

export interface UserLeaderboardPosition {
  rank: number;
  totalParticipants: number;
  score: number;
  period: LeaderboardPeriod;
  category: LeaderboardCategory;
  scoreToNextRank?: number;
  aheadOfPercentage?: number;
}

export interface LeaderboardResponse<T> {
  success: boolean;
  category: LeaderboardCategory;
  period: LeaderboardPeriod;
  dateRange: {
    start: string;
    end: string;
  };
  totalCount: number;
  page: number;
  limit: number;
  data: T[];
  userPosition?: UserLeaderboardPosition | null;
}

