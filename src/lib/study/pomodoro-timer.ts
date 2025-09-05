import { prisma } from '@/lib/prisma';

export interface PomodoroConfig {
  workDuration: number;    // minutes
  shortBreak: number;      // minutes
  longBreak: number;       // minutes
  sessionsUntilLongBreak: number;
}

export interface PomodoroSession {
  id: string;
  taskId: string;
  // Use canonical StudySessionType values from Prisma schema
  sessionType: 'POMODORO' | 'FREESTYLE' | 'BREAK';
  plannedDuration: number;
  actualDuration?: number;
  completed: boolean;
  startTime: Date;
  endTime?: Date;
  // totalPauseDuration is the canonical numeric field in the schema
  totalPauseDuration: number;
  notes?: string;
}

export class PomodoroTimer {
  private defaultConfig: PomodoroConfig = {
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4
  };

  async startSession(taskId: string, sessionType: 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK', config?: Partial<PomodoroConfig>): Promise<PomodoroSession> {
    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId }
      });

      if (!task) {
        throw new Error('Task not found');
      }

      const finalConfig = { ...this.defaultConfig, ...config };
      const duration = this.getDuration(sessionType, finalConfig);

      const canonicalSessionType = sessionType === 'WORK' ? 'POMODORO' : (sessionType === 'SHORT_BREAK' || sessionType === 'LONG_BREAK' ? 'BREAK' : sessionType as any);

      const studySession = await prisma.studySession.create({
        data: {
          taskId: taskId,
          // use scalar foreign key to avoid nested connect typing issues
          profileId: task.profileId,
          // userId is required by the StudySession model
          userId: task.userId,
          // cast to any to satisfy generated client typing for the enum
          sessionType: canonicalSessionType as any,
          plannedDuration: duration,
          startedAt: new Date(),
          totalPauseDuration: 0
        }
      });

      return {
  id: studySession.id,
  taskId,
  // return canonical session type
  sessionType: canonicalSessionType as 'POMODORO' | 'FREESTYLE' | 'BREAK',
  plannedDuration: duration,
  completed: false,
  startTime: studySession.startedAt,
  totalPauseDuration: 0
      };

    } catch (error) {
      console.error('Pomodoro session start error:', error);
      throw new Error('Failed to start pomodoro session');
    }
  }

  async completeSession(sessionId: string, actualDuration?: number, interruptions?: number, productivityRating?: number): Promise<void> {
    try {
      await prisma.studySession.update({
        where: { id: sessionId },
        data: {
          completedAt: new Date(),
          actualDuration: actualDuration,
          totalPauseDuration: interruptions || 0,
          productivityRating: productivityRating
        }
      });

      // Update task progress
      const session = await prisma.studySession.findUnique({
        where: { id: sessionId },
        include: { task: true }
      });

      if (session && session.task) {
  const totalTimeSpent = await this.getTotalTimeSpent(session.taskId);
  const progressPercentage = Math.min((totalTimeSpent / (((session as any).task)?.estimatedDuration || 60)) * 100, 100);
        
        // Update task with progress
        await prisma.task.update({
          where: { id: session.taskId },
          data: {
            actualDuration: totalTimeSpent,
            // Could add progress field to schema
          }
        });
      }

    } catch (error) {
      console.error('Pomodoro session completion error:', error);
      throw new Error('Failed to complete pomodoro session');
    }
  }

  async getSessionStats(profileId: string, period: 'today' | 'week' | 'month'): Promise<any> {
    const startDate = this.getStartDate(period);
    
      const sessions = await prisma.studySession.findMany({
      where: {
        profileId,
        startedAt: {
          gte: startDate
        }
      },
      include: {
        task: true
      }
    });

    return {
      totalSessions: sessions.length,
      totalTimeSpent: sessions.reduce((sum, s) => sum + (s.actualDuration || s.plannedDuration), 0),
      averageProductivity: this.calculateAverageProductivity(sessions),
      completionRate: sessions.filter(s => s.completedAt).length / sessions.length,
      subjects: this.groupBySubject(sessions)
    };
  }

  private getDuration(sessionType: string, config: PomodoroConfig): number {
    switch (sessionType) {
      case 'WORK': return config.workDuration;
      case 'SHORT_BREAK': return config.shortBreak;
      case 'LONG_BREAK': return config.longBreak;
      default: return config.workDuration;
    }
  }

  private async getTotalTimeSpent(taskId: string): Promise<number> {
    const sessions = await prisma.studySession.findMany({
      where: { taskId }
    });
    return sessions.reduce((sum, s) => sum + (s.actualDuration || s.plannedDuration), 0);
  }

  private getStartDate(period: string): Date {
    const now = new Date();
    switch (period) {
      case 'today':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        return weekStart;
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      default:
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
  }

  private calculateAverageProductivity(sessions: any[]): number {
    const ratedSessions = sessions.filter(s => s.productivityRating);
    if (ratedSessions.length === 0) return 0;
    return ratedSessions.reduce((sum, s) => sum + s.productivityRating, 0) / ratedSessions.length;
  }

  private groupBySubject(sessions: any[]): Record<string, number> {
    const subjects: Record<string, number> = {};
    sessions.forEach(session => {
      const subject = session.task?.subject || 'Other';
      subjects[subject] = (subjects[subject] || 0) + (session.actualDuration || session.plannedDuration);
    });
    return subjects;
  }
}
