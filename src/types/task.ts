import { Task as PrismaTask, Prisma } from '@prisma/client';

// Import Task Priority and Status from Prisma
import { TaskPriority as PrismaTaskPriority, TaskStatus as PrismaTaskStatus } from '@prisma/client';
import type { StudySession } from './study';

export type TaskPriority = PrismaTaskPriority;
export type TaskStatus = PrismaTaskStatus;

// Base Task interface matching Prisma schema
export interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: TaskPriority;
  status: TaskStatus;
  tags: string; // Comma-separated tags
  estimatedDuration: number | null; // Estimated duration in minutes
  actualTime: number | null;
  actualDuration: number | null;
  complexity: number | null;
  recurring: boolean;
  recurrenceRule: string | null;
  reminderBefore: number | null;
  userId: string;
  profileId: string;
  parentTaskId: string | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  calendarId: string | null;
  source: string;
  color: string | null;
  user: User;
  userBehaviors?: UserBehavior[];
  studysessions?: StudySession[];
  schedules?: Schedule[];
}

export interface User {
  id: string;
  name: string | null;
  email: string | null;
}

export interface UserBehavior {
  id: string;
  userId: string;
  taskId: string;
  action: string;
  timestamp: Date;
}

export interface Schedule {
  id: string;
  taskId: string;
  start: Date;
  end: Date;
  isFlexible: boolean;
  bufferBefore: number | null;
  bufferAfter: number | null;
  priority: number;
  status: string;
}

// Extended interface for UI components with computed properties
export interface TaskUI extends Task {
  subject?: string; // Derived from tags
  // UI-only computed fields
  // Avoid redeclaring properties already present on the base Task
  subtasks?: TaskUI[];
  dependencies?: TaskUI[];
  dependentOn?: TaskUI[];
  schedules?: Schedule[];
}

// Type for creating a new task
export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>;

// Type for updating an existing task
export type UpdateTaskInput = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>;

// Type for filtering tasks
export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  dueDate?: {
    start?: Date;
    end?: Date;
  };
  tags?: string[];
  search?: string;
  parentTaskId?: string | null;
  profileId?: string;
}
