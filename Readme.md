# UniParahits - Rank Up. Get Hired. The Elite Student Task Force

> **Smart India Hackathon (SIH 2026)**  
> Next-Generation Meritocratic Student Workforce, Dual-Token Economy & Smart Escrow Platform.  
> Theme: **UniParahits Cyber-Academic** (Support for High-Contrast Dark & Solar Light Modes).

---

## ⚡ Quick Start: How to Run the Full Project

Both frontend and backend services are ready to run out of the box.

### Prerequisites
- **Node.js** (v18.0.0 or higher, tested on Node v20+)
- **npm** (v9.0.0 or higher)

> **💡 Port Management**: If ports `3000` or `8080` are ever blocked by previous background sessions, run:
> ```bash
> npm run clean-ports
> ```
> `npm run dev` and `npm run start` also run this cleanup automatically before starting!

---

### Option 1: Run Full Stack Simultaneously (Recommended)

From the project root directory (`UniParahits_fwapp/`):

```bash
# 1. Install dependencies (if not already done)
npm install --prefix frontend
npm install --prefix backend

# 2. Start both Frontend & Backend concurrently
npm run dev:all
```

- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API Engine**: [http://localhost:8080](http://localhost:8080)
- **API Health Check**: [http://localhost:8080/health](http://localhost:8080/health)

---

### Option 2: Run in Separate Terminals (Standard Development)

#### Terminal 1 — Backend Core Engine (Port 8080)
```bash
cd backend
npm install
npm run dev
```
> Express REST API server will start on `http://localhost:8080`.

#### Terminal 2 — Frontend Application (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
> Next.js App Router application will start on `http://localhost:3000`.

---

### Option 3: Production Build & Run

To test the production build with optimized static routes and server-side rendering:

```bash
# Build the production bundle
npm run build

# Start the production frontend server
npm run start:frontend

# (In another terminal) Start the backend service
npm run start:backend
```

---

## 🔑 SIH Juror & Evaluator Accounts (1-Click Login)

The platform includes isolated demo accounts with pre-seeded balances (4,500 MANA & 50,000 ZENI) to test all role features immediately:

| Role | Email | Password | Rank / Status | Features Available |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | `aarav.sharma@parahits.edu` | `sih2026demo` | **E-Rank** (Novice) | Quests, Skill Tree, Apply to Guilds, Browse Courses |
| **Teacher** | `priya.singh@parahits.edu` | `sih2026demo` | **C-Rank** (Eligible) | Course Creation, 10-seat Cap, 500 ZENI Capacity Sinks |
| **Mentor** | `rahul.verma@parahits.edu` | `sih2026demo` | **B-Rank** (Master) | 1-on-1 Mentorship Sessions, Verification Reviews |
| **Guild Leader**| `rohan.mehta@parahits.edu` | `sih2026demo` | **A-Rank** (Grandmaster)| CyberForge Guild Management, Corporate Contract Escrows |
| **Corporate**| `hr@techcorp.io` | `sih2026demo` | **Verified Partner** | Post Bounties, Fund Milestone Escrows, Hire Guilds |
| **Admin** | `admin@uniparahits.gov.in` | `sih2026demo` | **System Overseer** | Verification Queue, Economy Controls, Audit Logs |

> **Quick Access**: Visit [http://localhost:3000/login](http://localhost:3000/login) and click on any **"1-Click Evaluator Login"** button to load the session with pre-filled credentials.

---

## 🏛️ Platform Architecture

```
UniParahits_fwapp/
├── frontend/                  # Next.js 15.5.18 App Router + React 19 + TypeScript
│   ├── src/
│   │   ├── app/               # 58 Full-Stack Routes (Student, Teacher, Guild, Admin, etc.)
│   │   ├── components/        # Cyber-Academic UI components & Theme Toggle
│   │   ├── lib/               # Auth, DB adapters, Demo Accounts & State
│   │   └── types/             # Shared TypeScript schemas and interfaces
│   ├── package.json
│   └── tailwind.config.ts     # Cyber-Academic theme tokens (Neon cyan, emerald, purple)
│
├── backend/                   # Node.js + Express.js API Service
│   ├── src/
│   │   ├── middleware/        # JWT Authentication, Rate Limiting & Helmet
│   │   ├── routes/            # Auth, Escrow, Economy & Guild Endpoints
│   │   ├── services/          # Escrow Engine (85/15 split, Member payouts)
│   │   └── server.js          # REST API Server entry point (Port 8080)
│   └── package.json
│
├── database/                  # PostgreSQL Database Schemas
│   ├── schema.sql             # 28+ Production tables with strict check constraints
│   ├── seed.sql               # Seed data for SIH personas, guilds & bounties
│   └── README.md              # Database setup & Supabase migration guide
│
├── package.json               # Root orchestrator scripts
└── Readme.md                  # System Documentation & Run Guide
```

---

## 💎 Core Economic Invariants (SIH 2026 Specs)

1. **Strict 5-Rank Hierarchy**:
   - `E → D → C → B → A`
   - *Rule*: Rank is earned exclusively through verified MANA XP. No ranks F, S, or S+ exist in the system.
2. **Dual-Token Mechanics**:
   - **MANA**: Non-purchasable, non-transferable Merit XP earned through verified tasks, exams, and milestones.
   - **ZENI**: Liquid transactional token strictly pegged at `1 ZENI = ₹1 INR`.
3. **Automated Escrow Split**:
   - Corporate Bounties: **85%** automatically distributed to Guild members according to contribution stakes; **15%** retained as platform maintenance fee.
   - Course Tuition: **85%** paid to Teacher / Instructor; **15%** platform fee.
4. **Teaching & Mentorship Gating**:
   - Minimum Rank **D** required to create and monetize courses.
   - Default course capacity: **10 students**. Expandable in blocks of 10 for **500 ZENI** (token sink).
   - Minimum Rank **C** required to open 1-on-1 mentorship bookings.

---

## 🔌 API Endpoints Reference (`http://localhost:8080`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Service health status, protocol version & rank check |
| `POST`| `/api/auth/login` | JWT Authentication returning session token & role profile |
| `POST`| `/api/auth/register` | Multi-role registration with student verification flow |
| `GET` | `/api/economy/balances/:id` | Fetch real-time MANA & ZENI wallet balances |
| `POST`| `/api/escrow/calculate-split` | Compute 85/15 escrow payout and guild member shares |
| `POST`| `/api/courses/expand-capacity` | Deduct 500 ZENI to unlock +10 student seats |

---

## 🗄️ Database Setup (PostgreSQL / Supabase)

If connecting a live PostgreSQL instance or Supabase database:

1. Create a PostgreSQL 15+ database.
2. Apply the schema:
   ```bash
   psql -h <HOST> -U <USER> -d <DATABASE> -f database/schema.sql
   ```
3. Load the initial SIH seed dataset:
   ```bash
   psql -h <HOST> -U <USER> -d <DATABASE> -f database/seed.sql
   ```
4. Copy `backend/.env.example` to `backend/.env` and update `DATABASE_URL`.

---

## 🧪 Testing & Verification

```bash
# Verify TypeScript typing across the entire frontend
npm run type-check

# Verify frontend production build
npm run build

# Verify backend health endpoint
curl -i http://localhost:8080/health
```

---

## 👥 Authors
- **Coded by ME(The Best) and AI ofcourse
- **Team UniParahits** — Smart India Hackathon (SIH 2026)
  
