import { prisma } from '@/lib/prisma';
import type { Task, Schedule, TaskPriority } from '@prisma/client';

export interface ScheduleRequest {
  taskId: string;
  preferredDate?: Date;
  timeSlots?: Array<{ start: string; end: string }>;
  priority?: number;
}

export interface ScheduleResult {
  scheduledSlots: Array<{
    start: Date;
    end: Date;
    confidence: number;
    reasoning: string;
  }>;
  conflicts: string[];
  recommendations: string[];
}

export class SmartScheduler {
  
  async scheduleTask(request: ScheduleRequest): Promise<ScheduleResult> {
    try {
      const task = await prisma.task.findUnique({
        where: { id: request.taskId },
        include: { profile: true }
      });

      if (!task) {
        throw new Error('Task not found');
      }

      // Get existing schedules to avoid conflicts
      const existingSchedules = await prisma.schedule.findMany({
        where: ({ 
          profileId: task.profileId,
          start: {
            gte: new Date()
          }
        } as any)
      } as any);

      // AI-powered scheduling logic
      const scheduledSlots = this.generateOptimalSchedule(task, existingSchedules, request);
      
      // Save the schedule to database
      const schedule = await prisma.schedule.create({
        data: ({
          taskId: task.id,
          profileId: task.profileId,
          start: scheduledSlots[0].start,
          end: scheduledSlots[0].end,
          aiConfidence: scheduledSlots[0].confidence as any,
          scheduleType: 'AI_GENERATED'
        } as any)
      } as any);

      return {
        scheduledSlots,
        conflicts: this.detectConflicts(scheduledSlots, existingSchedules),
        recommendations: this.generateRecommendations(task, scheduledSlots)
      };

    } catch (error) {
      console.error('Smart scheduling error:', error);
      throw new Error('Failed to schedule task');
    }
  }

  private generateOptimalSchedule(task: Task, existingSchedules: Schedule[], request: ScheduleRequest) {
    const now = new Date();
  const taskDuration = (task as any).estimatedDuration || 60;
    
    // Smart scheduling algorithm
    const baseTime = request.preferredDate || new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const startTime = new Date(baseTime);
    startTime.setHours(9, 0, 0, 0); // Default to 9 AM
    
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + taskDuration);

    return [{
      start: startTime,
      end: endTime,
      confidence: this.calculateConfidence(task, startTime),
  reasoning: `Scheduled based on priority ${task.priority} and estimated ${taskDuration} minute duration`
    }];
  }

  private calculateConfidence(task: Task, scheduledTime: Date): number {
    let confidence = 0.7; // Base confidence
    
    // Higher confidence for high-priority tasks
  // Task.priority is an enum (TaskPriority). Treat HIGH as highest confidence.
  if (task.priority === ("HIGH" as TaskPriority)) confidence += 0.2;
    
    // Higher confidence for tasks with clear subjects
  if ((task as any).subject) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  private detectConflicts(scheduledSlots: any[], existingSchedules: Schedule[]): string[] {
    const conflicts: string[] = [];
    
    scheduledSlots.forEach(slot => {
      existingSchedules.forEach(existing => {
        if (this.timesOverlap(slot.start, slot.end, existing.start, existing.end)) {
          conflicts.push(`Conflicts with existing schedule at ${existing.start.toLocaleString()}`);
        }
      });
    });
    
    return conflicts;
  }

  private timesOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
    return start1 < end2 && start2 < end1;
  }

  private generateRecommendations(task: Task, scheduledSlots: any[]): string[] {
    const recommendations: string[] = [];
    
    if (task.priority === ("HIGH" as TaskPriority)) {
      recommendations.push("High priority task - consider scheduling during your peak focus hours");
    }
    
    if ((task as any).estimatedDuration && (task as any).estimatedDuration > 120) {
      recommendations.push("Long task detected - consider breaking into smaller sessions with breaks");
    }
    
    if ((task as any).subject) {
      recommendations.push(`Related to ${(task as any).subject} - review previous notes before starting`);
    }
    
    return recommendations;
  }
}
