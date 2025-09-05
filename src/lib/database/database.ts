import { prisma } from '@/lib/prisma';
import type { Account, Session, User, Profile, Task, StudySession, UserBehavior } from '@prisma/client';
import crypto from 'crypto';

// Interface definitions for custom types
interface FlashcardDeck {
  id: string;
  name: string;
  description?: string;
  course?: string;
  subject?: string;
  userId: string;
  totalCards: number;
  mastered: number;
  learning: number;
  needsReview: number;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  reviewInterval: number;
  created: Date;
  lastModified: Date;
  isPublic: boolean;
  isArchived: boolean;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  hints?: string;
  tags: string[];
  deckId: string;
  profileId: string;
  lastReviewed?: Date;
  nextReview?: Date;
  timesReviewed: number;
  correctStreak: number;
  easeFactor: number;
  interval: number;
  status: string;
  created: Date;
  updatedAt: Date;
}

interface AIInsight {
  id: string;
  profileId: string;
  type: string;
  data: any;
  confidence: number;
  status: string;
  priority: number;
  appliedAt?: Date;
  created: Date;
  updatedAt: Date;
}

// Type definitions for function parameters
type TaskCreate = Omit<Task, 'id'>;
type TaskUpdate = Partial<Task>;
type BehaviorCreate = Omit<UserBehavior, 'id' | 'userId'>;
type StudySessionCreate = Omit<StudySession, 'id' | 'userId'>;
type StudySessionUpdate = Partial<StudySession>;
// Flashcard types removed: not present in generated client

// Task Operations
export const taskOperations = {
  async createTask(profileId: string, taskData: Omit<TaskCreate, 'profileId'>) {
    const { userId, ...rest } = taskData;
    // Use scalar foreign keys to avoid nested connect typing issues
    return await prisma.task.create({
      data: {
        ...rest,
        userId: userId,
        profileId: profileId
      }
    });
  },

  async getUserTasks(profileId: string) {
    return await prisma.task.findMany({
      where: {
  profileId: profileId
      },
      include: {
        profile: true,
        studysessions: true
      },
      orderBy: {
        updatedAt: 'asc'
      }
    });
  },

  async updateTask(id: string, updates: TaskUpdate) {
    return await prisma.task.update({
      where: { id },
      data: updates
    });
  },

  async deleteTask(id: string) {
    return await prisma.task.delete({
      where: { id }
    });
  }
};

// AI & Analytics Operations
export const aiOperations = {
  async logUserBehavior(userId: string, behaviorData: Omit<BehaviorCreate, 'userId'>) {
  return await prisma.userBehavior.create({
      data: {
        id: crypto.randomUUID(),
        ...behaviorData,
        userId,
        timestamp: new Date()
      }
    });
  },

  async getAIInsights(profileId: string) {
  // AIInsight model not present in generated client
  return [];
  },

  async getUserProductivityStats(profileId: string) {
    // Remove productivity stats for models not present in client
    return {
      totalTasks: 0,
      completedTasks: 0,
      averageCompletionTime: 0,
      productivityScore: 0
    };
  }
};

// Study Session Operations
export const studyOperations = {
  async startPomodoroSession(profileId: string, taskId: string, userId: string, duration: number = 25) {
    return await prisma.studySession.create({
      data: {
        taskId,
        userId,
         profileId,
        startedAt: new Date(),
        sessionType: 'POMODORO',
        plannedDuration: duration,
        totalPauseDuration: 0
      }
    });
  },

  async completeSession(sessionId: string, duration: number, rating?: number) {
    return await prisma.studySession.update({
      where: { id: sessionId },
      data: {
        completedAt: new Date()
      }
    });
  }
};

// Flashcard operations removed: models not present in generated client
