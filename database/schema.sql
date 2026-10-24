-- ============================================================================
-- UniParahits - Production Relational PostgreSQL Database Schema
-- SIH 2026 Core Workforce & Student Economy Architecture
--
-- Strict Rank Hierarchy: E -> D -> C -> B -> A (No F, S, S+)
-- Dual-Token System: MANA (Contribution/XP) & ZENI (1 ZENI = ₹1 pegged currency)
-- Simulated Smart Escrow with 85/15 splits & Guild multi-role distribution
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. USERS & PROFILES
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(32) NOT NULL CHECK (role IN ('STUDENT', 'COMPANY', 'ADMIN')),
    rank VARCHAR(8) CHECK (rank IN ('E', 'D', 'C', 'B', 'A')),
    college VARCHAR(255),
    headline TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_profiles (
    user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_rank VARCHAR(8) NOT NULL DEFAULT 'E' CHECK (current_rank IN ('E', 'D', 'C', 'B', 'A')),
    trust_score NUMERIC(3, 2) NOT NULL DEFAULT 4.00 CHECK (trust_score >= 0.00 AND trust_score <= 5.00),
    mana_balance BIGINT NOT NULL DEFAULT 0 CHECK (mana_balance >= 0),
    zeni_balance BIGINT NOT NULL DEFAULT 0 CHECK (zeni_balance >= 0),
    growth_path VARCHAR(32) CHECK (growth_path IN ('PROJECT', 'TEACHING', 'BOTH')),
    bio TEXT,
    github_url TEXT,
    figma_url TEXT,
    portfolio_url TEXT,
    college VARCHAR(255) NOT NULL,
    tasks_completed INT NOT NULL DEFAULT 0 CHECK (tasks_completed >= 0),
    projects_completed INT NOT NULL DEFAULT 0 CHECK (projects_completed >= 0),
    course_batches_taught INT NOT NULL DEFAULT 0 CHECK (course_batches_taught >= 0),
    teaching_rating NUMERIC(3, 2) NOT NULL DEFAULT 0.00 CHECK (teaching_rating >= 0.00 AND teaching_rating <= 5.00),
    mentor_recommended BOOLEAN NOT NULL DEFAULT FALSE,
    proof_approved BOOLEAN NOT NULL DEFAULT FALSE,
    is_d_ready BOOLEAN NOT NULL DEFAULT FALSE,
    is_c_ready BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_profiles (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id VARCHAR(64) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    industry VARCHAR(128) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    verified BOOLEAN NOT NULL DEFAULT TRUE,
    trust_score NUMERIC(3, 2) NOT NULL DEFAULT 4.50 CHECK (trust_score >= 0.00 AND trust_score <= 5.00),
    bounties_posted INT NOT NULL DEFAULT 0 CHECK (bounties_posted >= 0),
    total_spent_zeni BIGINT NOT NULL DEFAULT 0 CHECK (total_spent_zeni >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. SKILLS & CAPABILITIES
-- ----------------------------------------------------------------------------
CREATE TABLE skills (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name VARCHAR(128) NOT NULL UNIQUE,
    category VARCHAR(64) NOT NULL
);

CREATE TABLE student_skills (
    student_id VARCHAR(64) REFERENCES student_profiles(user_id) ON DELETE CASCADE,
    skill_id VARCHAR(64) REFERENCES skills(id) ON DELETE CASCADE,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (student_id, skill_id)
);

-- ----------------------------------------------------------------------------
-- 3. TASKS & PROOFS (FLOW 1 & PEER WORK)
-- ----------------------------------------------------------------------------
CREATE TABLE tasks (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    difficulty VARCHAR(32) NOT NULL CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    required_rank VARCHAR(8) NOT NULL CHECK (required_rank IN ('E', 'D', 'C', 'B', 'A')),
    mana_reward INT NOT NULL CHECK (mana_reward >= 0),
    zeni_reward INT NOT NULL DEFAULT 0 CHECK (zeni_reward >= 0),
    deadline_days INT NOT NULL DEFAULT 7,
    submission_requirements TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    submissions_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_submissions (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    task_id VARCHAR(64) NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES student_profiles(user_id) ON DELETE CASCADE,
    submission_type VARCHAR(32) NOT NULL CHECK (submission_type IN ('GITHUB', 'FIGMA', 'FILE', 'WEBSITE', 'TEXT', 'VIDEO')),
    submission_url TEXT NOT NULL,
    notes TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'REVISION_REQUIRED')),
    feedback TEXT,
    reviewed_by VARCHAR(64) REFERENCES users(id),
    mana_awarded INT DEFAULT 0,
    zeni_awarded INT DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Constraint: Prevent duplicate reward approval for same submission
CREATE UNIQUE INDEX idx_unique_approved_submission ON task_submissions(task_id, student_id) WHERE (status = 'APPROVED');

-- ----------------------------------------------------------------------------
-- 4. COURSES, SESSIONS & BATCH CAPACITY SINK (FLOW 2, 3, 4)
-- ----------------------------------------------------------------------------
CREATE TABLE courses (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    teacher_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    price_zeni INT NOT NULL CHECK (price_zeni >= 0),
    batch_capacity INT NOT NULL DEFAULT 10 CHECK (batch_capacity >= 10),
    enrolled_count INT NOT NULL DEFAULT 0 CHECK (enrolled_count <= batch_capacity),
    meet_url TEXT NOT NULL,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating >= 0.00 AND rating <= 5.00),
    reviews_count INT NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DRAFT', 'COMPLETED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE course_sessions (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    meet_url TEXT NOT NULL,
    lesson_number INT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING', 'LIVE', 'COMPLETED'))
);

CREATE TABLE course_enrollments (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES student_profiles(user_id) ON DELETE CASCADE,
    zeni_paid INT NOT NULL CHECK (zeni_paid >= 0),
    teacher_revenue INT NOT NULL CHECK (teacher_revenue >= 0),
    platform_fee INT NOT NULL CHECK (platform_fee >= 0),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (course_id, student_id) -- Prevent double enrollment charges
);

CREATE TABLE course_capacity_upgrades (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    previous_capacity INT NOT NULL,
    new_capacity INT NOT NULL,
    zeni_cost INT NOT NULL CHECK (zeni_cost > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE course_messages (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    sender_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_teacher BOOLEAN NOT NULL DEFAULT FALSE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE course_reviews (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES student_profiles(user_id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (course_id, student_id)
);

-- ----------------------------------------------------------------------------
-- 5. GUILDS & MENTORSHIP (FLOW 6 & 7)
-- ----------------------------------------------------------------------------
CREATE TABLE guilds (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name VARCHAR(255) NOT NULL UNIQUE,
    logo_url TEXT,
    tagline VARCHAR(255),
    description TEXT,
    leader_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trust_score NUMERIC(3, 2) NOT NULL DEFAULT 4.80 CHECK (trust_score >= 0.00 AND trust_score <= 5.00),
    completed_projects INT NOT NULL DEFAULT 0,
    total_zeni_earned BIGINT NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'RECRUITING', 'FULL')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE guild_members (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    guild_id VARCHAR(64) NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES student_profiles(user_id) ON DELETE CASCADE,
    role_title VARCHAR(128) NOT NULL,
    share_percentage NUMERIC(5, 2) NOT NULL CHECK (share_percentage > 0.00 AND share_percentage <= 100.00),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (guild_id, student_id)
);

CREATE TABLE mentor_relationships (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    mentor_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES student_profiles(user_id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED')),
    tasks_reviewed INT NOT NULL DEFAULT 0,
    mentor_notes TEXT,
    recommended_for_promotion BOOLEAN NOT NULL DEFAULT FALSE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (mentor_id, student_id)
);

-- ----------------------------------------------------------------------------
-- 6. CORPORATE BOUNTIES, APPLICATIONS, PROJECTS & ESCROW (FLOW 8)
-- ----------------------------------------------------------------------------
CREATE TABLE bounties (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    company_id VARCHAR(64) NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    budget_zeni BIGINT NOT NULL CHECK (budget_zeni > 0),
    deadline DATE NOT NULL,
    min_rank VARCHAR(8) NOT NULL DEFAULT 'E' CHECK (min_rank IN ('E', 'D', 'C', 'B', 'A')),
    target_type VARCHAR(32) NOT NULL CHECK (target_type IN ('INDIVIDUAL', 'GUILD')),
    status VARCHAR(32) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED', 'CANCELLED')),
    applications_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bounty_applications (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    bounty_id VARCHAR(64) NOT NULL REFERENCES bounties(id) ON DELETE CASCADE,
    applicant_type VARCHAR(32) NOT NULL CHECK (applicant_type IN ('STUDENT', 'GUILD')),
    applicant_id VARCHAR(64) NOT NULL,
    proposed_delivery_days INT NOT NULL CHECK (proposed_delivery_days > 0),
    proposal TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'APPLIED' CHECK (status IN ('APPLIED', 'SHORTLISTED', 'REJECTED', 'ACCEPTED')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE escrow_vaults (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id VARCHAR(64) NOT NULL,
    bounty_id VARCHAR(64) NOT NULL REFERENCES bounties(id) ON DELETE CASCADE,
    company_id VARCHAR(64) NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
    recipient_type VARCHAR(32) NOT NULL CHECK (recipient_type IN ('INDIVIDUAL', 'GUILD')),
    recipient_id VARCHAR(64) NOT NULL,
    amount_zeni BIGINT NOT NULL CHECK (amount_zeni > 0),
    platform_fee_percent NUMERIC(5, 2) NOT NULL DEFAULT 15.00,
    platform_fee_zeni BIGINT NOT NULL CHECK (platform_fee_zeni >= 0),
    recipient_payout_zeni BIGINT NOT NULL CHECK (recipient_payout_zeni >= 0),
    status VARCHAR(32) NOT NULL DEFAULT 'LOCKED' CHECK (status IN ('LOCKED', 'RELEASED', 'REFUNDED')),
    locked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    released_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE projects (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    bounty_id VARCHAR(64) NOT NULL REFERENCES bounties(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    company_id VARCHAR(64) NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
    hired_type VARCHAR(32) NOT NULL CHECK (hired_type IN ('INDIVIDUAL', 'GUILD', 'STUDENT')),
    hired_id VARCHAR(64) NOT NULL,
    budget_zeni BIGINT NOT NULL,
    deadline DATE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'SUBMITTED_FOR_REVIEW', 'APPROVED_AND_PAID', 'DISPUTED')),
    escrow_id VARCHAR(64) NOT NULL REFERENCES escrow_vaults(id),
    deliverable_url TEXT,
    deliverable_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE payment_splits (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    escrow_id VARCHAR(64) NOT NULL REFERENCES escrow_vaults(id) ON DELETE CASCADE,
    recipient_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_name VARCHAR(128) NOT NULL,
    percentage NUMERIC(5, 2) NOT NULL CHECK (percentage > 0.00 AND percentage <= 100.00),
    amount_zeni BIGINT NOT NULL CHECK (amount_zeni >= 0),
    status VARCHAR(32) NOT NULL DEFAULT 'PAID' CHECK (status IN ('PENDING', 'PAID')),
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 7. WALLET & AUDIT LEDGER TRANSACTIONS
-- ----------------------------------------------------------------------------
CREATE TABLE mana_transactions (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(32) NOT NULL CHECK (type IN ('EARN', 'SPEND', 'BONUS')),
    amount BIGINT NOT NULL CHECK (amount > 0),
    source_reason TEXT NOT NULL,
    related_entity_type VARCHAR(32) CHECK (related_entity_type IN ('TASK', 'COURSE', 'MENTORSHIP', 'ACHIEVEMENT', 'PROJECT')),
    related_entity_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE zeni_transactions (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(64) NOT NULL CHECK (type IN ('EARN', 'SPEND', 'ESCROW_LOCK', 'ESCROW_RELEASE', 'PLATFORM_FEE', 'CAPACITY_UPGRADE', 'COURSE_PURCHASE')),
    amount BIGINT NOT NULL, -- can be positive (credit) or negative (debit)
    source_reason TEXT NOT NULL,
    counterparty_name VARCHAR(255),
    status VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'PENDING', 'FAILED')),
    related_entity_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    action VARCHAR(128) NOT NULL,
    actor_id VARCHAR(64) NOT NULL,
    actor_name VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE economy_configs (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'primary',
    project_platform_fee_pct NUMERIC(5, 2) NOT NULL DEFAULT 15.00,
    guild_payout_pct NUMERIC(5, 2) NOT NULL DEFAULT 85.00,
    course_platform_fee_pct NUMERIC(5, 2) NOT NULL DEFAULT 15.00,
    course_teacher_payout_pct NUMERIC(5, 2) NOT NULL DEFAULT 85.00,
    default_course_capacity INT NOT NULL DEFAULT 10,
    capacity_upgrade_size INT NOT NULL DEFAULT 10,
    capacity_upgrade_cost INT NOT NULL DEFAULT 500,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_student_profiles_rank ON student_profiles(current_rank);
CREATE INDEX idx_tasks_required_rank ON tasks(required_rank);
CREATE INDEX idx_task_submissions_student ON task_submissions(student_id);
CREATE INDEX idx_courses_teacher ON courses(teacher_id);
CREATE INDEX idx_bounties_status ON bounties(status);
CREATE INDEX idx_escrow_status ON escrow_vaults(status);
CREATE INDEX idx_zeni_transactions_user ON zeni_transactions(user_id);
CREATE INDEX idx_mana_transactions_user ON mana_transactions(user_id);

-- ----------------------------------------------------------------------------
-- 8. VERIFIED LEADERBOARD SCORE EVENTS & AUDIT LEDGER (FLOW 9)
-- ----------------------------------------------------------------------------
CREATE TABLE leaderboard_score_events (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    category VARCHAR(32) NOT NULL CHECK (category IN ('STUDENT', 'TEACHER', 'GUILD')),
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    guild_id VARCHAR(64) REFERENCES guilds(id) ON DELETE SET NULL,
    activity_type VARCHAR(64) NOT NULL,
    reference_id VARCHAR(64) NOT NULL,
    points INT NOT NULL CHECK (points >= 0),
    description TEXT NOT NULL,
    verification_status VARCHAR(32) NOT NULL DEFAULT 'VERIFIED' CHECK (verification_status IN ('VERIFIED', 'REVOKED', 'PENDING')),
    verified_by VARCHAR(64) REFERENCES users(id),
    idempotency_key VARCHAR(128) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leaderboard_events_cat_date ON leaderboard_score_events(category, created_at);
CREATE INDEX idx_leaderboard_events_user ON leaderboard_score_events(user_id);
CREATE INDEX idx_leaderboard_events_guild ON leaderboard_score_events(guild_id);
CREATE INDEX idx_leaderboard_events_idempotency ON leaderboard_score_events(idempotency_key);

