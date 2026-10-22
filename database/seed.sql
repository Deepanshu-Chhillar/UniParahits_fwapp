-- ============================================================================
-- UniParahits - Production Seed Data for PostgreSQL
-- Matches SIH Demonstration Personas & Initial State
-- ============================================================================

-- 1. USERS
INSERT INTO users (id, email, name, avatar_url, role, rank, college, headline)
VALUES
('user-universal-demo', 'demo@uniparahits.edu', 'Aarav Sharma (Universal SIH Demo)', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', 'STUDENT', 'C', 'NSUT Delhi', 'Universal All-Access Evaluator Account (Student, Teacher, Mentor, Guild, Corporate, Admin)'),
('user-rohan-e', 'rohan.mehta@dtu.ac.in', 'Rohan Mehta', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', 'STUDENT', 'E', 'Delhi Technological University (DTU)', 'Frontend Apprentice | Aspiring React Developer (Rank E)'),
('user-aarav-d', 'aarav.sharma@nsut.ac.in', 'Aarav Sharma', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', 'STUDENT', 'D', 'Netaji Subhas University of Technology (NSUT)', 'Full Stack Engineer & Web Dev Instructor (Rank D)'),
('user-priya-c', 'priya.singh@iitd.ac.in', 'Priya Singh', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'STUDENT', 'C', 'IIT Delhi', 'UI/UX Architect & CyberForge Guild Leader (Rank C)'),
('user-rahul-b', 'rahul.verma@iiitd.ac.in', 'Rahul Verma', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'STUDENT', 'B', 'IIIT Delhi', 'Senior Backend Engineer & Distributed Systems Lead (Rank B)'),
('user-novatech', 'hiring@novatechlabs.ai', 'NovaTech Labs', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150', 'COMPANY', NULL, 'Corporate Partner', 'AI & SaaS Innovation Studio'),
('user-admin', 'admin@uniparahits.gov.in', 'UniParahits Admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'ADMIN', NULL, 'SIH Command Center', 'System Overseer & Economy Controller')
ON CONFLICT (id) DO NOTHING;

-- 2. STUDENT PROFILES
INSERT INTO student_profiles (user_id, current_rank, trust_score, mana_balance, zeni_balance, growth_path, bio, college, tasks_completed, projects_completed, course_batches_taught, teaching_rating, mentor_recommended, proof_approved, is_d_ready, is_c_ready)
VALUES
('user-universal-demo', 'C', 4.85, 4500, 50000, 'BOTH', 'Universal evaluation persona for SIH 2026.', 'NSUT Delhi', 24, 3, 2, 4.85, TRUE, TRUE, TRUE, TRUE),
('user-rohan-e', 'E', 4.10, 420, 2500, NULL, 'Dedicated 2nd year CS student at DTU. Completing initial peer tasks.', 'Delhi Technological University (DTU)', 7, 0, 0, 0.00, TRUE, TRUE, FALSE, FALSE),
('user-aarav-d', 'D', 4.50, 1850, 12400, 'BOTH', 'Rank D Full Stack developer. Building web apps and teaching aspiring students.', 'Netaji Subhas University of Technology (NSUT)', 18, 2, 1, 4.70, TRUE, TRUE, TRUE, FALSE),
('user-priya-c', 'C', 4.80, 3400, 28500, 'PROJECT', 'Rank C UI/UX architect and CyberForge Guild founder. Mentoring E-rank students.', 'IIT Delhi', 32, 5, 0, 0.00, TRUE, TRUE, TRUE, TRUE),
('user-rahul-b', 'B', 4.90, 5200, 64000, 'PROJECT', 'Rank B distributed systems engineer. Senior technical lead on high-budget projects.', 'IIIT Delhi', 48, 8, 0, 0.00, TRUE, TRUE, TRUE, TRUE)
ON CONFLICT (user_id) DO NOTHING;

-- 3. COMPANY PROFILES
INSERT INTO company_profiles (id, user_id, company_name, logo_url, industry, description, website, verified, trust_score, bounties_posted, total_spent_zeni)
VALUES
('company-novatech', 'user-novatech', 'NovaTech Labs', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150', 'Enterprise AI & SaaS Studio', 'Deep-tech studio sponsoring real-world student engineering bounties with simulated smart escrow settlement.', 'https://novatechlabs.ai', TRUE, 4.90, 3, 140000)
ON CONFLICT (id) DO NOTHING;

-- 4. GUILDS & MEMBERS
INSERT INTO guilds (id, name, logo_url, tagline, description, leader_id, trust_score, completed_projects, total_zeni_earned, status)
VALUES
('guild-cyberforge', 'CyberForge', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150', 'Elite Student Engineering Syndicate', 'Premier cross-functional guild built for high-scale enterprise contracts and hackathon executions.', 'user-priya-c', 4.85, 4, 185000, 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO guild_members (id, guild_id, student_id, role_title, share_percentage)
VALUES
('gm-1', 'guild-cyberforge', 'user-priya-c', 'UI/UX Designer & Leader', 20.00),
('gm-2', 'guild-cyberforge', 'user-aarav-d', 'Frontend Lead', 30.00),
('gm-3', 'guild-cyberforge', 'user-rahul-b', 'Backend Lead', 30.00),
('gm-4', 'guild-cyberforge', 'user-rohan-e', 'Apprentice / QA', 20.00)
ON CONFLICT (id) DO NOTHING;

-- 5. COURSES
INSERT INTO courses (id, title, description, teacher_id, price_zeni, batch_capacity, enrolled_count, meet_url, rating, reviews_count, status)
VALUES
('course-web-dev', 'Full Stack Web Development', 'Comprehensive practical cohort covering React 19, TypeScript, Next.js App Router, Spring Boot & PostgreSQL architecture.', 'user-aarav-d', 2000, 10, 7, 'https://meet.google.com/uni-para-web', 4.70, 6, 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- 6. BOUNTIES
INSERT INTO bounties (id, company_id, title, description, budget_zeni, deadline, min_rank, target_type, status, applications_count)
VALUES
('bounty-hiring-platform', 'company-novatech', 'Build Student Hiring Platform', 'Architect and deliver a full stack corporate dashboard with escrow management, candidate filtering, and interview rooms.', 60000, '2026-10-25', 'D', 'GUILD', 'OPEN', 3)
ON CONFLICT (id) DO NOTHING;

-- 7. ESCROW & PROJECTS
INSERT INTO escrow_vaults (id, project_id, bounty_id, company_id, recipient_type, recipient_id, amount_zeni, platform_fee_percent, platform_fee_zeni, recipient_payout_zeni, status)
VALUES
('escrow-active-1', 'proj-hiring-platform', 'bounty-hiring-platform', 'company-novatech', 'GUILD', 'guild-cyberforge', 60000, 15.00, 9000, 51000, 'LOCKED')
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (id, bounty_id, title, company_id, hired_type, hired_id, budget_zeni, deadline, status, escrow_id)
VALUES
('proj-hiring-platform', 'bounty-hiring-platform', 'Build Student Hiring Platform', 'company-novatech', 'GUILD', 'guild-cyberforge', 60000, '2026-10-25', 'IN_PROGRESS', 'escrow-active-1')
ON CONFLICT (id) DO NOTHING;

-- 8. INITIAL ECONOMY CONFIG
INSERT INTO economy_configs (id, project_platform_fee_pct, guild_payout_pct, course_platform_fee_pct, course_teacher_payout_pct, default_course_capacity, capacity_upgrade_size, capacity_upgrade_cost)
VALUES
('primary', 15.00, 85.00, 15.00, 85.00, 10, 10, 500)
ON CONFLICT (id) DO UPDATE SET updated_at = CURRENT_TIMESTAMP;
