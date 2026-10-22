# UniParahits Database Architecture & PostgreSQL / Supabase Setup

This directory contains the production relational schema and seed data for the **UniParahits** student workforce & economic protocol for Smart India Hackathon (SIH 2026).

---

## 🗄️ Database Files

- `schema.sql`: Complete DDL schema containing 28+ relational tables, strict check constraints, foreign keys, unique indexes, and audit logs.
- `seed.sql`: Demonstration and production seed data matching SIH evaluation personas:
  - **Aarav Sharma**: Rank D Contributor & Web Dev Instructor (Teaching Full Stack Web Development)
  - **Priya Singh**: Rank C UI/UX Architect & Leader of **CyberForge Guild**
  - **Rahul Verma**: Rank B Backend Architect
  - **Rohan Mehta**: Rank E Beginner Apprentice
  - **NovaTech Labs**: Enterprise Corporate Partner (60,000 ZENI Escrow Bounty)

---

## ⚡ Key Relational Constraints & Rules

1. **Strict 5-Rank Hierarchy**:
   ```sql
   CHECK (current_rank IN ('E', 'D', 'C', 'B', 'A'))
   ```
   *Obsolete ranks (F, S, S+) are strictly forbidden.*

2. **Non-Negative Wallets & Balances**:
   ```sql
   CHECK (mana_balance >= 0)
   CHECK (zeni_balance >= 0)
   ```
   *Balances cannot become negative under any concurrent transaction.*

3. **Course Batch Capacity & Platform Sink**:
   ```sql
   batch_capacity INT NOT NULL DEFAULT 10 CHECK (batch_capacity >= 10)
   enrolled_count INT NOT NULL DEFAULT 0 CHECK (enrolled_count <= batch_capacity)
   ```
   *Every course defaults to 10 seats. Expanding capacity costs 500 ZENI burned into platform treasury.*

4. **Escrow Split & Automated Guild Payout**:
   - 85% to Guild
   - 15% to Platform
   - Guild Payout automatically distributed among active members according to verified contribution percentage (e.g. 30% Frontend, 30% Backend, 20% UI/UX, 20% QA).

---

## 🚀 One-Step Setup with Supabase or Local PostgreSQL

### Option A: Hosted Supabase (Recommended Free Tier for SIH)
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste the contents of `schema.sql` and click **Run**.
4. Paste the contents of `seed.sql` and click **Run**.
5. Copy your connection URL into `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"
   ```

### Option B: Local PostgreSQL
```bash
# Create database
psql -U postgres -c "CREATE DATABASE uniparahits;"

# Apply schema & seed
psql -U postgres -d uniparahits -f database/schema.sql
psql -U postgres -d uniparahits -f database/seed.sql
```
