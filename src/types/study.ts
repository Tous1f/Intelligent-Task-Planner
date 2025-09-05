import { StudySessionType, Task, Profile, User } from '@prisma/client';
import { TaskUI } from './task';

export interface StudySession {
  id: string;
  taskId: string;
  userId: string;
  profileId: string;
  startedAt: Date;
  completedAt: Date | null;
  endedAt: Date | null;
  interruptions: string[] | null;
  totalPauseDuration: number;
  plannedDuration: number;
  actualDuration: number | null;
  productivityRating: number | null;
  focusScore: number | null;
  sessionType: StudySessionType;
  environment: string | null;
  distractions: string[] | null;
  breaks: {
    startTime: Date;
    duration: number;
    reason?: string;
  }[];
  goals: string | null;
  achievements: string | null;
  notes: string | null;
  mood: number | null;
  energy: number | null;
  comprehension: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// Extended interface for frontend/API use
export interface StudySessionUI extends StudySession {
  task?: TaskUI; // Use the TaskUI interface for extended task info
  user?: Pick<User, 'id' | 'name' | 'email'>; // Only include necessary user fields
  profile?: Pick<Profile, 'id' | 'timezone' | 'studyPreferences'>; // Only include necessary profile fields
}

// Type for creating a new study session
export type CreateStudySessionInput = Omit<StudySession, 'id' | 'createdAt' | 'updatedAt'>;

// Type for updating an existing study session
export type UpdateStudySessionInput = Partial<Omit<StudySession, 'id' | 'createdAt' | 'updatedAt'>>;

// Type for filtering study sessions
export interface StudySessionFilter {
  taskId?: string;
  userId?: string;
  profileId?: string;
  sessionType?: StudySessionType;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  productivityRange?: {
    min?: number;
    max?: number;
  };
}
