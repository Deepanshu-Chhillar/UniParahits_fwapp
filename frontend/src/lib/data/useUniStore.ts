'use client';

import { useState, useEffect, useCallback } from 'react';
import { store } from './store';
import {
  User,
  StudentProfile,
  CompanyProfile,
  Task,
  TaskSubmission,
  Guild,
  Course,
  CourseMessage,
  CourseEnrollment,
  Bounty,
  Application,
  Project,
  Escrow,
  PaymentSplit,
  ManaTransaction,
  ZeniTransaction,
  Notification,
  EconomyConfig,
  AuditLog,
  MentorRelationship,
  SubmissionType,
  GrowthPath,
  RankCode,
} from '../types';

export function useUniStore() {
  const [currentUser, setCurrentUser] = useState<User>(() => store.getCurrentUser());
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(() => store.getStudentProfile());
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(() => store.getCompanyProfile());
  const [tasks, setTasks] = useState<Task[]>(() => store.getTasks());
  const [submissions, setSubmissions] = useState<TaskSubmission[]>(() => store.getSubmissions());
  const [guilds, setGuilds] = useState<Guild[]>(() => store.getGuilds());
  const [courses, setCourses] = useState<Course[]>(() => store.getCourses());
  const [bounties, setBounties] = useState<Bounty[]>(() => store.getBounties());
  const [applications, setApplications] = useState<Application[]>(() => store.getApplications());
  const [projects, setProjects] = useState<Project[]>(() => store.getProjects());
  const [escrows, setEscrows] = useState<Escrow[]>(() => store.getEscrows());
  const [paymentSplits, setPaymentSplits] = useState<PaymentSplit[]>(() => store.getPaymentSplits());
  const [manaTransactions, setManaTransactions] = useState<ManaTransaction[]>(() => store.getManaTransactions());
  const [zeniTransactions, setZeniTransactions] = useState<ZeniTransaction[]>(() => store.getZeniTransactions());
  const [notifications, setNotifications] = useState<Notification[]>(() => store.getNotifications());
  const [economyConfig, setEconomyConfig] = useState<EconomyConfig>(() => store.getEconomyConfig());
  const [mentorRelationships, setMentorRelationships] = useState<MentorRelationship[]>(() => store.getMentorRelationships());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => store.getAuditLogs());
  const [allUsers, setAllUsers] = useState<User[]>(() => store.getAllUsers());

  const syncState = useCallback(() => {
    const user = store.getCurrentUser();
    setCurrentUser(user);
    setStudentProfile(store.getStudentProfile(user.id));
    setCompanyProfile(store.getCompanyProfile(user.id));
    setTasks([...store.getTasks()]);
    setSubmissions([...store.getSubmissions()]);
    setGuilds([...store.getGuilds()]);
    setCourses([...store.getCourses()]);
    setBounties([...store.getBounties()]);
    setApplications([...store.getApplications()]);
    setProjects([...store.getProjects()]);
    setEscrows([...store.getEscrows()]);
    setPaymentSplits([...store.getPaymentSplits()]);
    setManaTransactions([...store.getManaTransactions(user.id)]);
    setZeniTransactions([...store.getZeniTransactions(user.id)]);
    setNotifications([...store.getNotifications(user.id)]);
    setEconomyConfig({ ...store.getEconomyConfig() });
    setMentorRelationships([...store.getMentorRelationships()]);
    setAuditLogs([...store.getAuditLogs()]);
    setAllUsers([...store.getAllUsers()]);
  }, []);

  useEffect(() => {
    syncState();
    const unsubscribe = store.subscribe(syncState);
    return () => unsubscribe();
  }, [syncState]);

  return {
    currentUser,
    studentProfile,
    companyProfile,
    tasks,
    submissions,
    guilds,
    courses,
    bounties,
    applications,
    projects,
    escrows,
    paymentSplits,
    manaTransactions,
    zeniTransactions,
    notifications,
    economyConfig,
    mentorRelationships,
    auditLogs,
    allUsers,
    users: allUsers,

    // Store Actions
    switchUser: (userId: string) => store.setCurrentUserId(userId),
    setCurrentUser: (userOrId: string | User) =>
      store.setCurrentUserId(typeof userOrId === 'string' ? userOrId : userOrId.id),
    registerUser: (userData: { name: string; email: string; role: 'STUDENT' | 'COMPANY'; college?: string; skills?: string[] }) =>
      store.registerUser(userData),
    resetDatabase: () => store.resetToDefaults(),

    // Task Actions
    submitTask: (taskId: string, type: SubmissionType, url: string, notes: string) =>
      store.submitTaskProof(taskId, type, url, notes),
    reviewTask: (subId: string, status: 'APPROVED' | 'REJECTED' | 'REVISION_REQUIRED', feedback: string) =>
      store.reviewTaskSubmission(subId, status, feedback),
    promoteToRankD: (studentId: string, path: GrowthPath) =>
      store.promoteStudentToRankD(studentId, path),

    // Course Actions
    createCourse: (data: { title: string; description: string; skills: string[]; curriculum: string[]; priceZeni: number; meetUrl: string }) =>
      store.createCourse(data),
    enrollInCourse: (courseId: string, studentId?: string) =>
      store.enrollInCourse(courseId, studentId),
    upgradeCourseCapacity: (courseId: string) =>
      store.upgradeCourseCapacity(courseId),
    postCourseMessage: (courseId: string, message: string) =>
      store.postCourseMessage(courseId, message),
    addCourseReview: (courseId: string, rating: number, comment: string) =>
      store.addCourseReview(courseId, rating, comment),
    getCourseMessages: (courseId: string) => store.getCourseMessages(courseId),
    isStudentEnrolled: (courseId: string, studentId: string) => store.isStudentEnrolled(courseId, studentId),

    // Guild Actions
    createGuild: (name: string, tagline: string, description: string, skills: string[]) =>
      store.createGuild(name, tagline, description, skills),
    joinGuild: (guildId: string) => store.joinGuild(guildId),

    // Bounty & Escrow Actions
    postBounty: (data: { title: string; description: string; skills: string[]; budgetZeni: number; deadline: string; minRank: RankCode; targetType: 'INDIVIDUAL' | 'GUILD'; deliverables: string[] }) =>
      store.postBounty(data),
    applyToBounty: (bountyId: string, applicantType: 'STUDENT' | 'GUILD', days: number, proposal: string, guildId?: string) =>
      store.applyToBounty(bountyId, applicantType, days, proposal, guildId),
    hireApplicant: (bountyId: string, applicationId: string) =>
      store.hireApplicantAndLockEscrow(bountyId, applicationId),
    submitDeliverable: (projectId: string, url: string, notes: string) =>
      store.submitProjectDeliverable(projectId, url, notes),
    approveProjectAndReleaseEscrow: (projectId: string) =>
      store.approveProjectAndReleaseEscrow(projectId),

    // Notifications & Admin
    markNotificationAsRead: (id: string) => store.markNotificationAsRead(id),
    markAllNotificationsAsRead: () => store.markAllNotificationsAsRead(),
    updateEconomyConfig: (config: Partial<EconomyConfig>) => store.updateEconomyConfig(config),
  };
}
