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
    { id: 'user-universal-demo', email: 'demo@uniparahits.edu', name: 'Aarav Sharma (Universal Demo)', role: 'STUDENT', rank: 'C', capabilities: ['STUDENT', 'TEACHER', 'MENTOR', 'GUILD_LEADER', 'COMPANY', 'ADMIN'] },
    { id: 'user-rohan-e', email: 'rohan.mehta@dtu.ac.in', name: 'Rohan Mehta', role: 'STUDENT', rank: 'E', capabilities: ['STUDENT'] },
    { id: 'user-aarav-d', email: 'aarav.sharma@nsut.ac.in', name: 'Aarav Sharma', role: 'STUDENT', rank: 'D', capabilities: ['STUDENT', 'TEACHER'] },
    { id: 'user-priya-c', email: 'priya.singh@iitd.ac.in', name: 'Priya Singh', role: 'STUDENT', rank: 'C', capabilities: ['STUDENT', 'TEACHER', 'MENTOR', 'GUILD_LEADER'] },
    { id: 'user-novatech', email: 'hiring@novatechlabs.ai', name: 'NovaTech Labs', role: 'COMPANY', capabilities: ['COMPANY'] },
    { id: 'user-admin', email: 'admin@uniparahits.gov.in', name: 'Director S. Roy', role: 'ADMIN', capabilities: ['ADMIN'] },
  ],
  wallets: {
    'user-universal-demo': { mana: 4500, zeni: 50000, trust: 4.85 },
    'user-rohan-e': { mana: 420, zeni: 2500, trust: 4.10 },
    'user-aarav-d': { mana: 1850, zeni: 12400, trust: 4.50 },
    'user-priya-c': { mana: 3400, zeni: 28500, trust: 4.80 },
    'company-novatech': { zeni: 150000, trust: 4.90 },
  },
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
