import { NextResponse } from 'next/server';

const DEFAULT_PROJECT = {
  id: 'proj-cyberforge-1',
  bountyId: 'bounty-novatech-1',
  title: 'Build Student Hiring Platform & Escrow Workspace',
  description: 'NovaTech Labs requires an end-to-end multi-role web platform allowing verified student talent to collaborate in Guilds, receive escrow-protected corporate contracts, and complete milestones.',
  companyId: 'company-novatech',
  companyName: 'NovaTech Labs',
  assignedGuildId: 'guild-cyberforge',
  assignedGuildName: 'CyberForge Guild',
  budgetZeni: 60000,
  escrowId: 'escrow-novatech-1',
  status: 'IN_PROGRESS',
  milestones: [
    { id: 'm-1', title: 'Phase 1: Architecture & UI Prototype', description: 'Design specs and DB constraints approved', amountZeni: 24000, status: 'APPROVED' },
    { id: 'm-2', title: 'Phase 2: Functional Core & API Endpoints', description: 'Working full stack MVP and unit tests', amountZeni: 24000, status: 'SUBMITTED' },
    { id: 'm-3', title: 'Phase 3: Production QA & Release', description: 'Complete documentation and deployment ready', amountZeni: 12000, status: 'PENDING' }
  ],
  tasks: [
    { id: 'pt-1', title: 'Setup PostgreSQL Prisma / Spring Boot JPA Schema', assigneeName: 'Priya Patel (Backend)', status: 'DONE' },
    { id: 'pt-2', title: 'Implement Escrow Contract Logic with 85/15 split', assigneeName: 'Rahul Mehta (Lead)', status: 'IN_PROGRESS' },
    { id: 'pt-3', title: 'Design Glassmorphism Dashboard & Workspaces', assigneeName: 'Aarav Sharma (Frontend)', status: 'DONE' },
    { id: 'pt-4', title: 'Automated QA End-to-End Escrow Testing', assigneeName: 'Rohan Verma (QA Apprentice)', status: 'TODO' }
  ],
  progress: 68,
  createdAt: '2026-09-08T10:00:00Z',
  deadline: '2026-10-15T23:59:59Z'
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    success: true,
    data: {
      ...DEFAULT_PROJECT,
      id
    }
  });
}
