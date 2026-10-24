/**
 * UniParahits - Express REST API & Economic Settlement Server
 * SIH 2026 Core Workforce Protocol Engine
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const { economyEngine, DEFAULT_CONFIG } = require('./services/economyService');
const { leaderboardEngine, getPeriodDateRange } = require('./services/leaderboardService');
const { authenticateToken, JWT_SECRET } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 8080;

// Security & Parsing Middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Global Rate Limiting: 200 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, error: 'Too many requests. Please try again later.' },
});
app.use(limiter);

// ----------------------------------------------------------------------------
// IN-MEMORY ACTIVE STATE (PostgreSQL mirror for real-time demonstration)
// ----------------------------------------------------------------------------
const DB = {
  users: [
    { id: 'user-universal-demo', email: 'demo@uniparahits.edu', name: 'Aarav Sharma (Universal Demo)', role: 'STUDENT', rank: 'C', college: 'NSUT Delhi', capabilities: ['STUDENT', 'TEACHER', 'MENTOR', 'GUILD_LEADER', 'COMPANY', 'ADMIN'], avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150' },
    { id: 'user-rohan-e', email: 'rohan.mehta@dtu.ac.in', name: 'Rohan Mehta', role: 'STUDENT', rank: 'E', college: 'Delhi Technological University (DTU)', capabilities: ['STUDENT'], avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' },
    { id: 'user-aarav-d', email: 'aarav.sharma@nsut.ac.in', name: 'Aarav Sharma', role: 'STUDENT', rank: 'D', college: 'Netaji Subhas University of Technology (NSUT)', capabilities: ['STUDENT', 'TEACHER'], avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150' },
    { id: 'user-priya-c', email: 'priya.singh@iitd.ac.in', name: 'Priya Singh', role: 'STUDENT', rank: 'C', college: 'IIT Delhi', capabilities: ['STUDENT', 'TEACHER', 'MENTOR', 'GUILD_LEADER'], avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { id: 'user-rahul-b', email: 'rahul.verma@iiitd.ac.in', name: 'Rahul Verma', role: 'STUDENT', rank: 'B', college: 'IIIT Delhi', capabilities: ['STUDENT', 'TEACHER', 'MENTOR', 'GUILD_LEADER'], avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { id: 'user-novatech', email: 'hiring@novatechlabs.ai', name: 'NovaTech Labs', role: 'COMPANY', capabilities: ['COMPANY'], avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150' },
    { id: 'user-admin', email: 'admin@uniparahits.gov.in', name: 'Director S. Roy', role: 'ADMIN', capabilities: ['ADMIN'], avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  ],
  wallets: {
    'user-universal-demo': { mana: 4500, zeni: 50000, trust: 4.85 },
    'user-rohan-e': { mana: 420, zeni: 2500, trust: 4.10 },
    'user-aarav-d': { mana: 1850, zeni: 12400, trust: 4.50 },
    'user-priya-c': { mana: 3400, zeni: 28500, trust: 4.80 },
    'user-rahul-b': { mana: 4900, zeni: 45000, trust: 4.70 },
    'company-novatech': { zeni: 150000, trust: 4.90 },
  },
  guilds: [
    {
      id: 'guild-cyberforge',
      name: 'CyberForge',
      logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=150&auto=format&fit=crop&q=80',
      tagline: 'Full-Stack Rapid Deployment & High-Scale Cloud Squad',
      leaderId: 'user-priya-c',
      leaderName: 'Priya Singh',
      leaderRank: 'C',
      trustScore: 4.85,
      completedProjects: 6,
      members: [
        { studentId: 'user-priya-c', studentName: 'Priya Singh', role: 'UI/UX Designer', sharePercentage: 20 },
        { studentId: 'user-aarav-d', studentName: 'Aarav Sharma', role: 'Frontend Lead', sharePercentage: 30 },
        { studentId: 'user-rahul-b', studentName: 'Rahul Verma', role: 'Backend Lead', sharePercentage: 30 },
        { studentId: 'user-rohan-e', studentName: 'Rohan Mehta', role: 'Apprentice', sharePercentage: 20 },
      ],
    },
  ],
  courses: [
    {
      id: 'course-web-dev',
      title: 'Full Stack Web Development',
      teacherId: 'user-aarav-d',
      teacherName: 'Aarav Sharma',
      teacherRank: 'D',
      priceZeni: 2000,
      batchCapacity: 10,
      enrolledCount: 7,
      meetUrl: 'https://meet.google.com/uni-para-web',
      rating: 4.7,
      status: 'ACTIVE',
    },
    {
      id: 'course-applied-ai',
      title: 'Applied AI & LLM Systems Engineering (AI Course)',
      teacherId: 'user-priya-c',
      teacherName: 'Priya Singh',
      teacherRank: 'C',
      priceZeni: 2500,
      batchCapacity: 10,
      enrolledCount: 5,
      meetUrl: 'https://meet.google.com/uni-para-ai',
      rating: 4.9,
      status: 'ACTIVE',
    },
  ],
  tasks: [
    {
      id: 'task-auth-middleware',
      title: 'Build Secure JWT Role Middleware',
      category: 'Backend',
      difficulty: 'BEGINNER',
      requiredRank: 'E',
      manaReward: 150,
      zeniReward: 0,
      deadline: '2026-10-20',
      active: true,
    },
    {
      id: 'task-figma-tokens',
      title: 'Design Cybernetic Design Token System',
      category: 'UI/UX',
      difficulty: 'INTERMEDIATE',
      requiredRank: 'E',
      manaReward: 250,
      zeniReward: 500,
      deadline: '2026-10-22',
      active: true,
    },
  ],
  bounties: [
    {
      id: 'bounty-hiring-platform',
      companyId: 'company-novatech',
      companyName: 'NovaTech Labs',
      title: 'Build Student Hiring Platform',
      budgetZeni: 60000,
      deadline: '2026-10-25',
      minRank: 'D',
      targetType: 'GUILD',
      status: 'OPEN',
    },
  ],
  escrows: [],
  transactions: [],
  economyConfig: { ...DEFAULT_CONFIG },
  leaderboardEvents: [
    // Students Events
    { id: 'lbe-std-1', category: 'STUDENT', userId: 'user-priya-c', guildId: 'guild-cyberforge', activityType: 'TASK_APPROVED', referenceId: 'task-5', points: 350, description: 'Verified QA Automation & Escrow Test Suite', verificationStatus: 'VERIFIED', verifiedBy: 'user-admin', idempotencyKey: 'evt_task_task-5_user-priya-c', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lbe-std-2', category: 'STUDENT', userId: 'user-rahul-b', guildId: 'guild-cyberforge', activityType: 'TASK_APPROVED', referenceId: 'task-3', points: 180, description: 'Verified Spring Boot JWT Rate Limiter Middleware', verificationStatus: 'VERIFIED', verifiedBy: 'user-admin', idempotencyKey: 'evt_task_task-3_user-rahul-b', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lbe-std-3', category: 'STUDENT', userId: 'user-aarav-d', guildId: 'guild-cyberforge', activityType: 'TASK_APPROVED', referenceId: 'task-4', points: 200, description: 'Verified PostgreSQL Course Schema with Constraints', verificationStatus: 'VERIFIED', verifiedBy: 'user-priya-c', idempotencyKey: 'evt_task_task-4_user-aarav-d', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lbe-std-4', category: 'STUDENT', userId: 'user-rohan-e', guildId: 'guild-cyberforge', activityType: 'TASK_APPROVED', referenceId: 'task-2', points: 100, description: 'Verified Interactive Payment Split Breakdown Mockup', verificationStatus: 'VERIFIED', verifiedBy: 'user-priya-c', idempotencyKey: 'evt_task_sub-2_user-rohan-e', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lbe-std-5', category: 'STUDENT', userId: 'user-rohan-e', guildId: 'guild-cyberforge', activityType: 'ACHIEVEMENT_UNLOCKED', referenceId: 'ach-1', points: 50, description: 'Verified First Proof of Work Badge', verificationStatus: 'VERIFIED', verifiedBy: 'user-admin', idempotencyKey: 'evt_ach_ach-1_user-rohan-e', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lbe-std-6', category: 'STUDENT', userId: 'user-priya-c', guildId: 'guild-cyberforge', activityType: 'PROJECT_COMPLETED', referenceId: 'proj-hiring-platform', points: 250, description: 'Delivered Milestone 1 Figma Tokens for NovaTech Platform', verificationStatus: 'VERIFIED', verifiedBy: 'user-admin', idempotencyKey: 'evt_proj_m1_user-priya-c', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lbe-std-7', category: 'STUDENT', userId: 'user-rahul-b', guildId: 'guild-cyberforge', activityType: 'PROJECT_COMPLETED', referenceId: 'proj-hiring-platform', points: 250, description: 'Delivered Microservices Architecture Specification', verificationStatus: 'VERIFIED', verifiedBy: 'user-admin', idempotencyKey: 'evt_proj_m2_user-rahul-b', timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lbe-std-8', category: 'STUDENT', userId: 'user-universal-demo', guildId: 'guild-cyberforge', activityType: 'TASK_APPROVED', referenceId: 'task-3', points: 180, description: 'Universal Demo Task Completion Verification', verificationStatus: 'VERIFIED', verifiedBy: 'user-admin', idempotencyKey: 'evt_task_task-3_demo', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },

    // Teachers Events
    { id: 'lbe-tch-1', category: 'TEACHER', userId: 'user-aarav-d', guildId: null, activityType: 'BATCH_TAUGHT', referenceId: 'course-web-dev', points: 150, description: 'Delivered Full Stack Web Development cohort sessions', verificationStatus: 'VERIFIED', verifiedBy: 'user-admin', idempotencyKey: 'evt_batch_course-web-dev_1', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lbe-tch-2', category: 'TEACHER', userId: 'user-aarav-d', guildId: null, activityType: 'COURSE_RATING', referenceId: 'course-web-dev', points: 95, description: 'Verified Course Reviews (Rating 4.70/5.0 with 6 verified reviews)', verificationStatus: 'VERIFIED', verifiedBy: 'user-admin', idempotencyKey: 'evt_rating_course-web-dev', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lbe-tch-3', category: 'TEACHER', userId: 'user-priya-c', guildId: null, activityType: 'BATCH_TAUGHT', referenceId: 'course-applied-ai', points: 150, description: 'Conducted Applied AI & LLM Systems cohort sessions', verificationStatus: 'VERIFIED', verifiedBy: 'user-admin', idempotencyKey: 'evt_batch_course-applied-ai_1', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lbe-tch-4', category: 'TEACHER', userId: 'user-priya-c', guildId: null, activityType: 'MENTORSHIP_REVIEW', referenceId: 'mentor-rel-1', points: 120, description: 'Verified Active Mentorship & Evaluation for Rohan Mehta', verificationStatus: 'VERIFIED', verifiedBy: 'user-admin', idempotencyKey: 'evt_mentor_eval_user-rohan-e', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lbe-tch-5', category: 'TEACHER', userId: 'user-priya-c', guildId: null, activityType: 'COURSE_RATING', referenceId: 'course-applied-ai', points: 98, description: 'Verified Course Reviews (Rating 4.90/5.0 with 8 verified reviews)', verificationStatus: 'VERIFIED', verifiedBy: 'user-admin', idempotencyKey: 'evt_rating_course-applied-ai', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },

    // Guilds Events
    { id: 'lbe-gld-1', category: 'GUILD', userId: null, guildId: 'guild-cyberforge', activityType: 'PROJECT_COMPLETED', referenceId: 'proj-hiring-platform', points: 300, description: 'Escrow milestone verified and delivered for NovaTech Labs', verificationStatus: 'VERIFIED', verifiedBy: 'user-admin', idempotencyKey: 'evt_gld_proj_hiring-platform', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lbe-gld-2', category: 'GUILD', userId: 'user-priya-c', guildId: 'guild-cyberforge', activityType: 'TASK_APPROVED', referenceId: 'task-5', points: 350, description: 'Collective verified member contribution by Priya Singh', verificationStatus: 'VERIFIED', verifiedBy: 'user-admin', idempotencyKey: 'evt_gld_contrib_priya_t5', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lbe-gld-3', category: 'GUILD', userId: 'user-rahul-b', guildId: 'guild-cyberforge', activityType: 'TASK_APPROVED', referenceId: 'task-3', points: 180, description: 'Collective verified member contribution by Rahul Verma', verificationStatus: 'VERIFIED', verifiedBy: 'user-admin', idempotencyKey: 'evt_gld_contrib_rahul_t3', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lbe-gld-4', category: 'GUILD', userId: 'user-aarav-d', guildId: 'guild-cyberforge', activityType: 'TASK_APPROVED', referenceId: 'task-4', points: 200, description: 'Collective verified member contribution by Aarav Sharma', verificationStatus: 'VERIFIED', verifiedBy: 'user-admin', idempotencyKey: 'evt_gld_contrib_aarav_t4', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lbe-gld-5', category: 'GUILD', userId: 'user-rohan-e', guildId: 'guild-cyberforge', activityType: 'TASK_APPROVED', referenceId: 'task-2', points: 100, description: 'Collective verified member contribution by Rohan Mehta', verificationStatus: 'VERIFIED', verifiedBy: 'user-admin', idempotencyKey: 'evt_gld_contrib_rohan_t2', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  ],
};

// ----------------------------------------------------------------------------
// HEALTH CHECK
// ----------------------------------------------------------------------------
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    protocol: 'UniParahits Core Engine v2.4',
    timestamp: new Date().toISOString(),
    ranks: ['E', 'D', 'C', 'B', 'A'],
    economy: 'Dual-Token (MANA XP + ZENI ₹1)',
  });
});

// ----------------------------------------------------------------------------
// 1. AUTHENTICATION (JWT & Register)
// ----------------------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = DB.users.find((u) => u.email.toLowerCase() === email?.toLowerCase());

  if (!user) {
    return res.status(401).json({ success: false, error: 'User not found with provided email' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, rank: user.rank },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    token,
    user,
    wallet: DB.wallets[user.id] || null,
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, role, college } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }

  const newId = `user-${Date.now()}`;
  const newUser = {
    id: newId,
    email,
    name,
    role: role || 'STUDENT',
    rank: role === 'COMPANY' ? null : 'E',
    college: college || 'Engineering Institute',
    capabilities: [role || 'STUDENT'],
  };

  DB.users.push(newUser);
  DB.wallets[newId] = { mana: 0, zeni: 100, trust: 4.0 };

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role, rank: newUser.rank },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({ success: true, user: newUser, token });
});

// ----------------------------------------------------------------------------
// 2. TASKS & PROOFS (FLOW 1)
// ----------------------------------------------------------------------------
app.get('/api/tasks', (req, res) => {
  res.json({ success: true, data: DB.tasks });
});

app.post('/api/tasks/:id/submit', (req, res) => {
  const taskId = req.params.id;
  const { studentId, submissionType, submissionUrl } = req.body;

  const task = DB.tasks.find((t) => t.id === taskId);
  if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

  const submission = {
    id: `sub-${Date.now()}`,
    taskId,
    studentId: studentId || 'user-rohan-e',
    submissionType: submissionType || 'GITHUB',
    submissionUrl,
    status: 'PENDING',
    submittedAt: new Date().toISOString(),
  };

  res.status(201).json({ success: true, data: submission });
});

app.post('/api/tasks/:id/review', (req, res) => {
  const { studentId, status, feedback } = req.body;
  const task = DB.tasks.find((t) => t.id === req.params.id);

  if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

  if (status === 'APPROVED') {
    const studentWallet = DB.wallets[studentId] || { mana: 0, zeni: 0, trust: 4.0 };
    studentWallet.mana += task.manaReward;
    studentWallet.zeni += task.zeniReward;
    DB.wallets[studentId] = studentWallet;

    DB.transactions.push({
      id: `tx-${Date.now()}`,
      userId: studentId,
      type: 'EARN',
      manaAmount: task.manaReward,
      zeniAmount: task.zeniReward,
      reason: `Approved task: ${task.title}`,
      timestamp: new Date().toISOString(),
    });

    // Record verified student leaderboard event (Idempotent: prevents duplicate points)
    const taskDifficultyPoints = task.difficulty === 'ADVANCED' ? 350 : task.difficulty === 'INTERMEDIATE' ? 180 : 100;
    const eligiblePoints = taskDifficultyPoints + (task.manaReward || 0);

    leaderboardEngine.recordEvent(DB.leaderboardEvents, {
      category: 'STUDENT',
      userId: studentId,
      guildId: 'guild-cyberforge',
      activityType: 'TASK_APPROVED',
      referenceId: task.id,
      points: eligiblePoints,
      description: `Verified task approval: ${task.title}`,
      verificationStatus: 'VERIFIED',
      verifiedBy: req.user?.id || 'user-admin',
      idempotencyKey: `evt_task_${task.id}_${studentId}`,
    });

    // Attribute collective verified contribution to Guild
    leaderboardEngine.recordEvent(DB.leaderboardEvents, {
      category: 'GUILD',
      userId: studentId,
      guildId: 'guild-cyberforge',
      activityType: 'TASK_APPROVED',
      referenceId: task.id,
      points: taskDifficultyPoints,
      description: `Collective verified member contribution for task: ${task.title}`,
      verificationStatus: 'VERIFIED',
      verifiedBy: req.user?.id || 'user-admin',
      idempotencyKey: `evt_gld_task_${task.id}_${studentId}`,
    });
  }

  res.json({
    success: true,
    status,
    feedback,
    awardedMana: status === 'APPROVED' ? task.manaReward : 0,
    awardedZeni: status === 'APPROVED' ? task.zeniReward : 0,
    updatedWallet: DB.wallets[studentId],
  });
});

// ----------------------------------------------------------------------------
// 3. COURSES & CAPACITY SINK (FLOW 2, 3, 4)
// ----------------------------------------------------------------------------
app.get('/api/courses', (req, res) => {
  res.json({ success: true, data: DB.courses });
});

app.post('/api/courses', (req, res) => {
  const { title, teacherId, priceZeni, meetUrl } = req.body;
  const teacher = DB.users.find((u) => u.id === teacherId);

  if (teacher && teacher.rank === 'E') {
    return res.status(403).json({
      success: false,
      error: 'Rank D or higher is required to teach and create courses.',
    });
  }

  const newCourse = {
    id: `course-${Date.now()}`,
    title,
    teacherId: teacherId || 'user-aarav-d',
    teacherName: teacher?.name || 'Aarav Sharma',
    teacherRank: teacher?.rank || 'D',
    priceZeni: Number(priceZeni) || 2000,
    batchCapacity: 10,
    enrolledCount: 0,
    meetUrl: meetUrl || 'https://meet.google.com/uni-para-live',
    rating: 5.0,
    status: 'ACTIVE',
  };

  DB.courses.push(newCourse);
  res.status(201).json({ success: true, data: newCourse });
});

// Student purchases course with 85/15 revenue split
app.post('/api/courses/:id/enroll', (req, res) => {
  const course = DB.courses.find((c) => c.id === req.params.id);
  if (!course) return res.status(404).json({ success: false, error: 'Course not found' });

  if (course.enrolledCount >= course.batchCapacity) {
    return res.status(400).json({
      success: false,
      error: `BATCH FULL (${course.enrolledCount}/${course.batchCapacity}). Instructor must upgrade capacity.`,
    });
  }

  const studentId = req.body.studentId || 'user-rohan-e';
  const studentWallet = DB.wallets[studentId] || { zeni: 0 };

  if (studentWallet.zeni < course.priceZeni) {
    return res.status(400).json({
      success: false,
      error: `Insufficient ZENI balance. Price is ${course.priceZeni} ZENI, available: ${studentWallet.zeni} ZENI.`,
    });
  }

  // Deduct student
  studentWallet.zeni -= course.priceZeni;

  // Split: 85% to Teacher, 15% to Platform
  const split = economyEngine.calculateCourseSplit(course.priceZeni);
  const teacherWallet = DB.wallets[course.teacherId] || { zeni: 0 };
  teacherWallet.zeni += split.teacherPayout;

  course.enrolledCount += 1;

  res.json({
    success: true,
    message: 'Course purchase successful',
    split,
    enrolledCount: course.enrolledCount,
    remainingCapacity: course.batchCapacity - course.enrolledCount,
    studentZeniRemaining: studentWallet.zeni,
  });
});

// Teacher upgrades capacity (+10 seats for 500 ZENI)
app.post('/api/courses/:id/upgrade-capacity', (req, res) => {
  const course = DB.courses.find((c) => c.id === req.params.id);
  if (!course) return res.status(404).json({ success: false, error: 'Course not found' });

  const teacherId = req.body.teacherId || course.teacherId;
  const user = DB.users.find((u) => u.id === teacherId);

  // Authorization check: Only authorized teachers (Rank D+, role TEACHER or capabilities including TEACHER) can execute
  const isAuthorizedTeacher = user && (
    user.role === 'TEACHER' ||
    (user.rank && user.rank !== 'E') ||
    user.capabilities?.includes('TEACHER') ||
    user.capabilities?.includes('ADMIN')
  );

  if (!isAuthorizedTeacher) {
    return res.status(403).json({
      success: false,
      error: 'Unauthorized: Only teachers with Rank D or higher can burn ZENI for capacity upgrades.',
    });
  }

  const teacherWallet = DB.wallets[teacherId] || { zeni: 0 };

  try {
    const upgrade = economyEngine.validateCapacityUpgrade(course.batchCapacity, teacherWallet.zeni);
    teacherWallet.zeni -= upgrade.cost;
    course.batchCapacity = upgrade.newCapacity;

    res.json({
      success: true,
      message: `Course capacity upgraded to ${upgrade.newCapacity} seats! 500 ZENI platform fee debited.`,
      newCapacity: course.batchCapacity,
      costZeni: upgrade.cost,
      teacherZeniBalance: teacherWallet.zeni,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------------------------------
// 4. BOUNTIES & ESCROW SETTLEMENT (FLOW 8)
// ----------------------------------------------------------------------------
app.get('/api/bounties', (req, res) => {
  res.json({ success: true, data: DB.bounties });
});

// Release Escrow: 85% Guild / 15% Platform Split + Member Distribution
app.post('/api/projects/:id/release-escrow', (req, res) => {
  const budget = 60000;
  const split = economyEngine.calculateProjectSplit(budget);

  // Guild Members contribution breakdown
  const guildMembers = [
    { studentId: 'user-priya-c', studentName: 'Priya Singh', role: 'UI/UX Lead', sharePercentage: 20 },
    { studentId: 'user-aarav-d', studentName: 'Aarav Sharma', role: 'Frontend Lead', sharePercentage: 30 },
    { studentId: 'user-rahul-b', studentName: 'Rahul Verma', role: 'Backend Lead', sharePercentage: 30 },
    { studentId: 'user-rohan-e', studentName: 'Rohan Mehta', role: 'QA & Apprentice', sharePercentage: 20 },
  ];

  const memberPayouts = economyEngine.calculateGuildMemberPayouts(split.guildPayout, guildMembers);

  // Credit each member's wallet atomically
  memberPayouts.forEach((mp) => {
    const wallet = DB.wallets[mp.studentId] || { zeni: 0 };
    wallet.zeni += mp.amountZeni;
    DB.wallets[mp.studentId] = wallet;
  });

  res.json({
    success: true,
    escrowStatus: 'RELEASED',
    projectBudgetZeni: budget,
    platformFeeZeni: split.platformFee,
    platformFeePct: '15%',
    guildTotalPayoutZeni: split.guildPayout,
    guildPayoutPct: '85%',
    distributedMembers: memberPayouts,
  });
});

// ----------------------------------------------------------------------------
// 5. WALLET & ADMIN
// ----------------------------------------------------------------------------
app.get('/api/wallets/:userId', (req, res) => {
  const wallet = DB.wallets[req.params.userId] || { mana: 0, zeni: 0, trust: 4.0 };
  res.json({ success: true, userId: req.params.userId, data: wallet });
});

app.get('/api/admin/metrics', (req, res) => {
  const totalUsers = DB.users.length;
  const totalZeniCirculation = Object.values(DB.wallets).reduce((s, w) => s + (w.zeni || 0), 0);
  const totalManaCirculation = Object.values(DB.wallets).reduce((s, w) => s + (w.mana || 0), 0);

  res.json({
    success: true,
    totalUsers,
    totalZeniCirculation,
    totalManaCirculation,
    activeCourses: DB.courses.length,
    activeTasks: DB.tasks.length,
    activeBounties: DB.bounties.length,
    activeEscrow: 60000,
    platformFeePct: DB.economyConfig.projectPlatformFeePct,
  });
});

// ----------------------------------------------------------------------------
// 6. LEADERBOARD API (STUDENTS | TEACHERS | GUILDS - STRICT SEPARATION)
// ----------------------------------------------------------------------------

// 6.1 Students Leaderboard
app.get('/api/leaderboard/students', (req, res) => {
  const { period = 'all-time', search = '', rank = 'ALL', page = 1, limit = 10, userId } = req.query;

  const currentUserId = userId || (req.headers['x-user-id'] || null);

  const result = leaderboardEngine.getStudentLeaderboard({
    users: DB.users,
    events: DB.leaderboardEvents,
    guilds: DB.guilds,
    period,
    search,
    rankFilter: rank,
    page,
    limit,
    currentUserId,
  });

  res.json(result);
});

// 6.2 Teachers Leaderboard
app.get('/api/leaderboard/teachers', (req, res) => {
  const { period = 'all-time', search = '', page = 1, limit = 10, userId } = req.query;

  const currentUserId = userId || (req.headers['x-user-id'] || null);

  const result = leaderboardEngine.getTeacherLeaderboard({
    users: DB.users,
    events: DB.leaderboardEvents,
    courses: DB.courses,
    guilds: DB.guilds,
    period,
    search,
    page,
    limit,
    currentUserId,
  });

  res.json(result);
});

// 6.3 Guilds Leaderboard
app.get('/api/leaderboard/guilds', (req, res) => {
  const { period = 'all-time', search = '', page = 1, limit = 10 } = req.query;

  const result = leaderboardEngine.getGuildLeaderboard({
    guilds: DB.guilds,
    events: DB.leaderboardEvents,
    period,
    search,
    page,
    limit,
  });

  res.json(result);
});

// 6.4 Current User Position
app.get('/api/leaderboard/user-rank', (req, res) => {
  const { userId, category = 'students', period = 'all-time' } = req.query;
  const targetUserId = userId || req.headers['x-user-id'];

  if (!targetUserId) {
    return res.status(400).json({ success: false, error: 'userId parameter required' });
  }

  if (category === 'teachers') {
    const teacherResult = leaderboardEngine.getTeacherLeaderboard({
      users: DB.users,
      events: DB.leaderboardEvents,
      courses: DB.courses,
      guilds: DB.guilds,
      period,
      page: 1,
      limit: 1000,
      currentUserId: targetUserId,
    });
    return res.json({ success: true, userPosition: teacherResult.userPosition || null });
  }

  const studentResult = leaderboardEngine.getStudentLeaderboard({
    users: DB.users,
    events: DB.leaderboardEvents,
    guilds: DB.guilds,
    period,
    page: 1,
    limit: 1000,
    currentUserId: targetUserId,
  });

  res.json({ success: true, userPosition: studentResult.userPosition || null });
});

// 6.5 Record Score Event (Authorized System / Admin Operation)
app.post('/api/leaderboard/events', (req, res) => {
  const { category, userId, guildId, activityType, referenceId, points, description, idempotencyKey } = req.body;

  if (!category || !activityType || !referenceId || !idempotencyKey) {
    return res.status(400).json({ success: false, error: 'category, activityType, referenceId, and idempotencyKey are required.' });
  }

  try {
    const outcome = leaderboardEngine.recordEvent(DB.leaderboardEvents, {
      category,
      userId,
      guildId,
      activityType,
      referenceId,
      points,
      description,
      idempotencyKey,
      verifiedBy: req.headers['x-user-id'] || 'system',
    });

    res.status(outcome.alreadyProcessed ? 200 : 201).json({
      success: true,
      alreadyProcessed: outcome.alreadyProcessed,
      event: outcome.event,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 6.6 Revoke Score Event (Admin Audit & Correction)
app.post('/api/leaderboard/events/:id/revoke', (req, res) => {
  const eventId = req.params.id;
  const revokedBy = req.headers['x-user-id'] || 'admin';

  try {
    const revoked = leaderboardEngine.revokeEvent(DB.leaderboardEvents, eventId, revokedBy);
    res.json({ success: true, message: `Event ${eventId} revoked.`, event: revoked });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

// 6.7 Admin Audit Event Log
app.get('/api/leaderboard/admin/events', (req, res) => {
  const { category, status, limit = 50 } = req.query;
  let events = [...DB.leaderboardEvents];

  if (category) {
    events = events.filter((e) => e.category === category.toUpperCase());
  }
  if (status) {
    events = events.filter((e) => e.verificationStatus === status.toUpperCase());
  }

  res.json({
    success: true,
    count: events.length,
    events: events.slice(0, Number(limit) || 50),
  });
});


// Start Server
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`[UniParahits] Backend Core Engine running on port ${PORT}`);
    console.log(`[UniParahits] Health check: http://localhost:${PORT}/health`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[UniParahits Error] Port ${PORT} is already in use. Run "npm run clean-ports" to free it.`);
      process.exit(1);
    } else {
      console.error('[UniParahits Error]', err);
    }
  });

  const gracefulShutdown = (signal) => {
    console.log(`[UniParahits] Received ${signal}. Shutting down backend gracefully...`);
    server.close(() => {
      console.log('[UniParahits] Backend closed successfully.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

module.exports = app;
