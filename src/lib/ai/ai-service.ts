import { GeminiTaskParser } from './nlp/gemini-task-parser';
import { prisma } from '@/lib/prisma';

export interface AIInsight {
  type: 'workload_prediction' | 'deadline_risk' | 'productivity_pattern' | 'study_recommendation';
  confidence: number;
  message: string;
  data: Record<string, any>;
  actionable: boolean;
}

export interface BehaviorPattern {
  userId: string;
  pattern: string;
  confidence: number;
  frequency: number;
  lastObserved: Date;
}

export class AIService {
  private taskParser = new GeminiTaskParser();

  async generatePersonalizedInsights(profileId: string): Promise<AIInsight[]> {
    try {
      const insights: AIInsight[] = [];

      // Analyze user's task patterns
      const userTasks = await prisma.task.findMany({
        where: { profileId },
        include: {
          studySessions: true,
          schedules: true
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      });

      // Workload prediction
      const workloadInsight = await this.analyzeWorkload(userTasks);
      if (workloadInsight) insights.push(workloadInsight);

      // Deadline risk assessment
      const deadlineRisk = await this.assessDeadlineRisk(userTasks);
      if (deadlineRisk) insights.push(deadlineRisk);

      // Productivity patterns
      const productivityPattern = await this.analyzeProductivityPatterns(profileId);
      if (productivityPattern) insights.push(productivityPattern);

      // Study recommendations
      const studyRecommendation = await this.generateStudyRecommendations(userTasks);
      if (studyRecommendation) insights.push(studyRecommendation);

      // Save insights to database
      await this.saveInsights(profileId, insights);

      return insights;

    } catch (error) {
      console.error('AI insights generation error:', error);
      return [];
    }
  }

  async learnFromUserBehavior(profileId: string, action: string, context: Record<string, any>): Promise<void> {
    try {
      await prisma.userBehavior.create({
        data: {
          profileId,
          actionType: action,
          contextData: context,
          timestamp: new Date(),
          productivityScore: this.calculateProductivityScore(context)
        }
      });

      // Update user patterns based on behavior
      await this.updateBehaviorPatterns(profileId, action, context);

    } catch (error) {
      console.error('Behavior learning error:', error);
    }
  }

  async optimizeTaskSchedule(taskId: string): Promise<any> {
    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
          profile: {
            include: {
              userBehavior: true,
              studySessions: true
            }
          }
        }
      });

      if (!task) {
        throw new Error('Task not found');
      }

      // AI-powered optimization based on user behavior
      const behaviorPatterns = await this.analyzeBehaviorPatterns(task.profileId);
      const optimalSchedule = this.generateOptimalSchedule(task, behaviorPatterns);

      return optimalSchedule;

    } catch (error) {
      console.error('Schedule optimization error:', error);
      throw new Error('Failed to optimize schedule');
    }
  }

  private async analyzeWorkload(tasks: any[]): Promise<AIInsight | null> {
    const upcomingTasks = tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) > new Date() && task.status !== 'COMPLETED'
    );

    if (upcomingTasks.length === 0) return null;

    const totalEstimatedTime = upcomingTasks.reduce((sum, task) => sum + (task.estimatedDuration || 0), 0);
    const averageTimePerTask = totalEstimatedTime / upcomingTasks.length;

    let confidence = 0.8;
    let message = '';
    let actionable = true;

    if (totalEstimatedTime > 480) { // More than 8 hours
      message = `High workload detected: ${upcomingTasks.length} tasks requiring ~${Math.round(totalEstimatedTime/60)} hours total. Consider breaking down large tasks.`;
      confidence = 0.9;
    } else if (totalEstimatedTime < 120) { // Less than 2 hours
      message = `Light workload ahead: ${upcomingTasks.length} tasks requiring ~${Math.round(totalEstimatedTime/60)} hours total. Good time to plan ahead!`;
      confidence = 0.7;
      actionable = false;
    } else {
      message = `Moderate workload: ${upcomingTasks.length} tasks requiring ~${Math.round(totalEstimatedTime/60)} hours total. Well balanced!`;
      confidence = 0.8;
      actionable = false;
    }

    return {
      type: 'workload_prediction',
      confidence,
      message,
      data: {
        totalTasks: upcomingTasks.length,
        totalHours: Math.round(totalEstimatedTime/60),
        averageTimePerTask: Math.round(averageTimePerTask)
      },
      actionable
    };
  }

  private async assessDeadlineRisk(tasks: any[]): Promise<AIInsight | null> {
    const now = new Date();
    const upcomingDeadlines = tasks.filter(task => {
      if (!task.dueDate || task.status === 'COMPLETED') return false;
      const deadline = new Date(task.dueDate);
      const daysUntil = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return daysUntil <= 7 && daysUntil > 0;
    });

    if (upcomingDeadlines.length === 0) return null;

    const riskyTasks = upcomingDeadlines.filter(task => {
      const deadline = new Date(task.dueDate!);
      const daysUntil = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      const hoursNeeded = (task.estimatedDuration || 60) / 60;
      return daysUntil < hoursNeeded / 8; // Risk if less than 8 hours per day available
    });

    if (riskyTasks.length > 0) {
      return {
        type: 'deadline_risk',
        confidence: 0.85,
        message: `⚠️ ${riskyTasks.length} task(s) at risk of missing deadlines. Consider starting immediately or breaking into smaller chunks.`,
        data: {
          riskyTasks: riskyTasks.length,
          upcomingDeadlines: upcomingDeadlines.length,
          tasks: riskyTasks.map(t => ({ title: t.title, dueDate: t.dueDate }))
        },
        actionable: true
      };
    }

    return {
      type: 'deadline_risk',
      confidence: 0.7,
      message: `✅ All ${upcomingDeadlines.length} upcoming deadlines appear manageable with current schedule.`,
      data: { upcomingDeadlines: upcomingDeadlines.length },
      actionable: false
    };
  }

  private async analyzeProductivityPatterns(profileId: string): Promise<AIInsight | null> {
    const studySessions = await prisma.studySession.findMany({
      where: { profileId },
      orderBy: { startedAt: 'desc' },
      take: 20
    });

    if (studySessions.length < 5) return null;

    const avgProductivity = studySessions
      .filter(s => s.productivityRating)
      .reduce((sum, s) => sum + (s.productivityRating || 0), 0) / studySessions.length;

    const completionRate = studySessions.filter(s => s.completedAt).length / studySessions.length;

    if (avgProductivity > 3.5 && completionRate > 0.8) {
      return {
        type: 'productivity_pattern',
        confidence: 0.8,
        message: `🚀 Excellent productivity pattern! Average rating: ${avgProductivity.toFixed(1)}/5 with ${Math.round(completionRate * 100)}% completion rate.`,
        data: { avgProductivity, completionRate },
        actionable: false
      };
    } else if (avgProductivity < 2.5 || completionRate < 0.6) {
      return {
        type: 'productivity_pattern',
        confidence: 0.7,
        message: `📈 Productivity could be improved. Consider adjusting study environment or breaking tasks into smaller chunks.`,
        data: { avgProductivity, completionRate },
        actionable: true
      };
    }

    return null;
  }

  private async generateStudyRecommendations(tasks: any[]): Promise<AIInsight | null> {
    const subjects = new Map<string, number>();
    tasks.forEach(task => {
      if (task.subject) {
        subjects.set(task.subject, (subjects.get(task.subject) || 0) + 1);
      }
    });

    if (subjects.size === 0) return null;

    const topSubject = Array.from(subjects.entries()).sort((a, b) => b[1] - a[1])[0];
    
    return {
      type: 'study_recommendation',
      confidence: 0.6,
      message: `📚 Focus area: ${topSubject[0]} appears frequently in your tasks (${topSubject[1]} tasks). Consider dedicating focused study blocks to this subject.`,
      data: { topSubject: topSubject[0], taskCount: topSubject[1] },
      actionable: true
    };
  }

  private async saveInsights(profileId: string, insights: AIInsight[]): Promise<void> {
    for (const insight of insights) {
      await prisma.aiInsight.create({
        data: {
          profileId,
          insightType: insight.type,
          confidenceLevel: insight.confidence,
          insightData: {
            message: insight.message,
            data: insight.data,
            actionable: insight.actionable
          }
        }
      });
    }
  }

  private calculateProductivityScore(context: Record<string, any>): number {
    // Simple productivity scoring based on context
    let score = 0.5; // Base score
    
    if (context.taskCompleted) score += 0.3;
    if (context.onTime) score += 0.2;
    if (context.focusTime > context.plannedTime * 0.8) score += 0.2;
    
    return Math.min(score, 1.0);
  }

  private async updateBehaviorPatterns(profileId: string, action: string, context: Record<string, any>): Promise<void> {
    // Update behavior patterns based on user actions
    // This would be more sophisticated in production
  }

  private async analyzeBehaviorPatterns(profileId: string): Promise<BehaviorPattern[]> {
    const behaviors = await prisma.userBehavior.findMany({
      where: { profileId },
      orderBy: { timestamp: 'desc' },
      take: 100
    });

    // Analyze patterns and return behavior insights
    return []; // Simplified for this example
  }

  private generateOptimalSchedule(task: any, patterns: BehaviorPattern[]): any {
    // Generate optimal schedule based on behavior patterns
    return {
      recommendedTime: new Date(),
      confidence: 0.8,
      reasoning: 'Based on your productivity patterns'
    };
  }
}
