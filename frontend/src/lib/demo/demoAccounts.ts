/**
 * UniParahits - Isolated Example & SIH Demo Account Module
 * 
 * NOTE TO MAINTAINER:
 * This module is completely self-contained in this folder.
 * If you wish to disable or remove demo presets for pure production deployment:
 * 1. Set DEMO_MODE_ENABLED = false, or
 * 2. Delete this file/folder.
 */

import { User, StudentProfile, CompanyProfile } from '@/lib/types';

export const DEMO_MODE_ENABLED = true;

/**
 * Universal Demo Account for SIH Judges & Evaluators:
 * Has unlocked Student + Teacher + Mentor + Guild Leader + Company + Admin capabilities,
 * pre-seeded with 4,500 MANA and 50,000 ZENI.
 */
export const UNIVERSAL_DEMO_USER: User = {
  id: 'user-universal-demo',
  email: 'demo@uniparahits.edu',
  name: 'Aarav Sharma (Universal SIH Demo)',
  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  role: 'STUDENT',
  rank: 'C',
  capabilities: ['STUDENT', 'TEACHER', 'MENTOR', 'GUILD_CREATOR', 'GUILD_LEADER', 'COMPANY', 'ADMIN'],
  college: 'Netaji Subhas University of Technology (NSUT)',
  headline: 'Universal All-Access Evaluator Account (Student, Teacher, Mentor, Guild, Corporate, Admin)',
  createdAt: '2026-01-01T00:00:00Z',
};

export const UNIVERSAL_DEMO_STUDENT_PROFILE: StudentProfile = {
  userId: 'user-universal-demo',
  currentRank: 'C',
  trustScore: 4.8,
  manaBalance: 4500,
  zeniBalance: 50000,
  growthPath: 'BOTH',
  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'System Architecture', 'Smart Escrow'],
  bio: 'Universal evaluation persona for SIH 2026. Fully unlocked to inspect Student Tasks, Teaching Portal, Mentorship Dashboard, Guild Operations, Corporate Bounties, Escrow Release, and Wallets.',
  college: 'NSUT Delhi',
  tasksCompleted: 24,
  projectsCompleted: 3,
  courseBatchesTaught: 2,
  teachingRating: 4.85,
  mentorRecommended: true,
  proofApproved: true,
  isDReady: true,
  isCReady: true,
};

export const UNIVERSAL_DEMO_COMPANY_PROFILE: CompanyProfile = {
  id: 'company-universal-demo',
  userId: 'user-universal-demo',
  companyName: 'NovaTech Labs (Simulated Org)',
  logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  industry: 'Enterprise AI & Distributed Systems',
  description: 'Enterprise partner account verified to post bounties, hire student guilds, and lock escrow funds.',
  website: 'https://novatechlabs.ai',
  verified: true,
  trustScore: 4.9,
  bountiesPosted: 4,
  totalSpentZeni: 120000,
};

export interface DemoPreset {
  id: string;
  label: string;
  role: 'STUDENT' | 'COMPANY' | 'ADMIN';
  email: string;
  badge: string;
  description: string;
  targetPath: string;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'user-universal-demo',
    label: '⚡ Universal Master Account',
    role: 'STUDENT',
    email: 'demo@uniparahits.edu',
    badge: 'Rank C • 50,000 ZENI • All Hubs Unlocked',
    description: 'Recommended for SIH Evaluators: test student tasks, teaching, mentorship, guild creation, corporate escrow, and admin console in one account.',
    targetPath: '/student/dashboard',
  },
  {
    id: 'user-rohan-e',
    label: 'Rohan Mehta (Beginner Student)',
    role: 'STUDENT',
    email: 'rohan.mehta@dtu.ac.in',
    badge: 'Rank E • Apprentice',
    description: 'Entry-level student performing peer tasks, earning first MANA/ZENI, advancing toward Rank D eligibility.',
    targetPath: '/student/dashboard',
  },
  {
    id: 'user-aarav-d',
    label: 'Aarav Sharma (Teacher Contributor)',
    role: 'STUDENT',
    email: 'aarav.sharma@nsut.ac.in',
    badge: 'Rank D • Teacher Unlocked',
    description: 'D-rank student eligible to teach courses, manage student batch capacity, and earn course royalties.',
    targetPath: '/teacher/dashboard',
  },
  {
    id: 'user-priya-c',
    label: 'Priya Singh (Mentor & Guild Leader)',
    role: 'STUDENT',
    email: 'priya.singh@iitd.ac.in',
    badge: 'Rank C • CyberForge Leader',
    description: 'Senior C-rank mentor reviewing E-rank submissions and leading the CyberForge corporate guild.',
    targetPath: '/mentor/dashboard',
  },
  {
    id: 'user-novatech',
    label: 'NovaTech Labs (Corporate Partner)',
    role: 'COMPANY',
    email: 'hiring@novatechlabs.ai',
    badge: 'Enterprise Partner',
    description: 'Post 60,000 ZENI bounties, review applications, hire student guilds, lock escrow, and release payments.',
    targetPath: '/company/dashboard',
  },
  {
    id: 'user-admin',
    label: 'Director S. Roy (System Admin)',
    role: 'ADMIN',
    email: 'admin@uniparahits.gov.in',
    badge: 'Platform Controller',
    description: 'Admin command center: circulation telemetry, platform fee configuration, user audits, and economy control.',
    targetPath: '/admin/dashboard',
  },
];
