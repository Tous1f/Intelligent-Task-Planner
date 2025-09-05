import { prisma } from '@/lib/prisma';

export interface ScenarioParams {
  adjustedDeadlines?: Date[];
  timeBlocks?: Array<{ start: Date; end: Date }>;
  studyPreferences?: {
    preferredTimes: string[];
    breakDuration: number;
    sessionLength: number;
  };
  workloadDistribution?: 'even' | 'frontend-heavy' | 'backend-heavy';
}

export interface ScenarioImpact {
  completionProbability: number;
  stressLevel: number;
  productivityScore: number;
  recommendations: string[];
  risks: string[];
  timelineAdjustments: Array<{
    taskId: string;
    originalDate: Date;
    suggestedDate: Date;
    reason: string;
  }>;
}

export class WhatIfAnalyzer {
  async analyzeScenario(profileId: string, params: ScenarioParams): Promise<ScenarioImpact> {
    const userTasks = await prisma.task.findMany({
      where: { profileId },
      include: {
  studysessions: true,
        schedules: true
      }
    });

    const studyPatterns = await this.analyzeStudyPatterns(profileId);
    
    const impact = this.calculateScenarioImpact(userTasks, studyPatterns, params);
    
    return impact;
  }

  private async analyzeStudyPatterns(profileId: string) {
    const recentSessions = await prisma.studySession.findMany({
      where: { profileId },
      orderBy: { startedAt: 'desc' },
      take: 20,
      include: { task: true }
    });

    return {
      avgProductivity: this.calculateAverageProductivity(recentSessions),
      preferredTimes: this.findPreferredStudyTimes(recentSessions),
      successPatterns: this.identifySuccessPatterns(recentSessions)
    };
  }

  private calculateScenarioImpact(
    tasks: any[],
    patterns: any,
    params: ScenarioParams
  ): ScenarioImpact {
    const completionProbability = this.estimateCompletionProbability(tasks, patterns, params);
    const stressLevel = this.calculateStressLevel(tasks, params);
    const productivityScore = this.predictProductivityScore(patterns, params);
    
    const timelineAdjustments = this.generateTimelineAdjustments(tasks, patterns, params);
    const recommendations = this.generateRecommendations(tasks, patterns, params);
    const risks = this.identifyRisks(tasks, patterns, params);

    return {
      completionProbability,
      stressLevel,
      productivityScore,
      recommendations,
      risks,
      timelineAdjustments
    };
  }

  private calculateAverageProductivity(sessions: any[]): number {
    if (sessions.length === 0) return 0;
    return sessions.reduce((sum, s) => sum + (s.productivityRating || 0), 0) / sessions.length;
  }

  private findPreferredStudyTimes(sessions: any[]): string[] {
    const timeSlots = sessions.map(s => {
      const hour = new Date(s.startedAt).getHours();
      return {
        hour,
        productivity: s.productivityRating || 0
      };
    });

    const productivityByHour = new Map<number, { total: number; count: number }>();
    timeSlots.forEach(slot => {
      const current = productivityByHour.get(slot.hour) || { total: 0, count: 0 };
      productivityByHour.set(slot.hour, {
        total: current.total + slot.productivity,
        count: current.count + 1
      });
    });

    return Array.from(productivityByHour.entries())
      .map(([hour, stats]) => ({
        hour,
        avgProductivity: stats.total / stats.count
      }))
      .sort((a, b) => b.avgProductivity - a.avgProductivity)
      .slice(0, 3)
      .map(slot => `${slot.hour}:00`);
  }

  private identifySuccessPatterns(sessions: any[]): any {
    const successfulSessions = sessions.filter(s => s.productivityRating && s.productivityRating > 3.5);
    
    return {
      avgDuration: this.calculateAverageDuration(successfulSessions),
      commonBreakPatterns: this.analyzeBreakPatterns(successfulSessions),
      environmentFactors: this.analyzeEnvironmentFactors(successfulSessions)
    };
  }

  private estimateCompletionProbability(tasks: any[], patterns: any, params: ScenarioParams): number {
    const baselineProbability = 0.7;
    let adjustments = 0;

    // Adjust based on historical completion rate
    const completionRate = this.calculateHistoricalCompletionRate(tasks);
    adjustments += (completionRate - 0.7) * 0.3;

    // Adjust based on alignment with preferred times
    if (params.studyPreferences?.preferredTimes) {
      const timeAlignment = this.calculateTimeAlignment(params.studyPreferences.preferredTimes, patterns.preferredTimes);
      adjustments += timeAlignment * 0.2;
    }

    // Adjust based on workload distribution
    if (params.workloadDistribution) {
      const workloadImpact = this.assessWorkloadDistribution(params.workloadDistribution, patterns);
      adjustments += workloadImpact * 0.1;
    }

    return Math.min(Math.max(baselineProbability + adjustments, 0), 1);
  }

  private calculateHistoricalCompletionRate(tasks: any[]): number {
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED');
    return tasks.length > 0 ? completedTasks.length / tasks.length : 0;
  }

  private calculateTimeAlignment(proposed: string[], preferred: string[]): number {
    const overlap = proposed.filter(time => preferred.includes(time));
    return overlap.length / Math.max(proposed.length, 1);
  }

  private assessWorkloadDistribution(distribution: string, patterns: any): number {
    // Implementation based on historical success with similar distributions
    return 0.1; // Simplified version
  }

  private calculateStressLevel(tasks: any[], params: ScenarioParams): number {
    // 0-100 scale where 100 is highest stress
    let baseStress = 50;
    
    // Adjust based on deadline density
    const deadlineDensity = this.calculateDeadlineDensity(tasks, params.adjustedDeadlines);
    baseStress += deadlineDensity * 20;

    // Adjust based on workload vs available time
    const workloadPressure = this.calculateWorkloadPressure(tasks, params.timeBlocks);
    baseStress += workloadPressure * 30;

    return Math.min(Math.max(baseStress, 0), 100);
  }

  private calculateDeadlineDensity(tasks: any[], adjustedDeadlines?: Date[]): number {
    // Implementation for deadline density calculation
    return 0.5; // Simplified version
  }

  private calculateWorkloadPressure(tasks: any[], timeBlocks?: Array<{ start: Date; end: Date }>): number {
    // Implementation for workload pressure calculation
    return 0.3; // Simplified version
  }

  private predictProductivityScore(patterns: any, params: ScenarioParams): number {
    // 0-100 scale where 100 is highest productivity
    let baseScore = patterns.avgProductivity * 20; // Convert 0-5 scale to 0-100

    if (params.studyPreferences) {
      const alignmentScore = this.calculatePreferenceAlignment(patterns, params.studyPreferences);
      baseScore += alignmentScore * 30;
    }

    return Math.min(Math.max(baseScore, 0), 100);
  }

  private calculatePreferenceAlignment(patterns: any, preferences: any): number {
    // Implementation for preference alignment calculation
    return 0.7; // Simplified version
  }

  private generateTimelineAdjustments(tasks: any[], patterns: any, params: ScenarioParams) {
    return tasks
      .filter(task => task.status !== 'COMPLETED')
      .map(task => {
        const originalDate = new Date(task.dueDate);
        const suggestedDate = this.calculateOptimalDate(task, patterns, params);
        
        return {
          taskId: task.id,
          originalDate,
          suggestedDate,
          reason: this.generateAdjustmentReason(originalDate, suggestedDate, patterns)
        };
      })
      .filter(adj => adj.originalDate.getTime() !== adj.suggestedDate.getTime());
  }

  private calculateOptimalDate(task: any, patterns: any, params: ScenarioParams): Date {
    // Implementation for optimal date calculation
    return new Date(task.dueDate); // Simplified version
  }

  private generateAdjustmentReason(original: Date, suggested: Date, patterns: any): string {
    const diff = Math.round((suggested.getTime() - original.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff > 0) {
      return `Suggesting a ${diff} day delay based on your productivity patterns and current workload`;
    } else if (diff < 0) {
      return `Recommending to complete ${Math.abs(diff)} days earlier based on upcoming workload and your peak productivity times`;
    }
    
    return 'Current deadline aligns well with your study patterns';
  }

  private generateRecommendations(tasks: any[], patterns: any, params: ScenarioParams): string[] {
    const recommendations: string[] = [];

    // Time-based recommendations
    if (patterns.preferredTimes && patterns.preferredTimes.length > 0) {
      recommendations.push(`Schedule important tasks during your peak productivity hours: ${patterns.preferredTimes.join(', ')}`);
    }

    // Workload distribution recommendations
    if (this.calculateWorkloadPressure(tasks, params.timeBlocks) > 0.7) {
      recommendations.push('Consider redistributing tasks to reduce pressure during high-intensity periods');
    }

    // Break pattern recommendations
    if (patterns.successPatterns?.commonBreakPatterns) {
      recommendations.push('Maintain your successful break pattern: 25 minutes of focus followed by 5-minute breaks');
    }

    return recommendations;
  }

  private identifyRisks(tasks: any[], patterns: any, params: ScenarioParams): string[] {
    const risks: string[] = [];

    // Deadline risks
    const deadlinePressure = this.calculateDeadlineDensity(tasks, params.adjustedDeadlines);
    if (deadlinePressure > 0.8) {
      risks.push('High risk of deadline conflicts due to dense scheduling');
    }

    // Workload risks
    if (this.calculateWorkloadPressure(tasks, params.timeBlocks) > 0.9) {
      risks.push('Potential burnout risk due to high workload intensity');
    }

    // Pattern deviation risks
    if (params.studyPreferences && this.calculatePreferenceAlignment(patterns, params.studyPreferences) < 0.3) {
      risks.push('Significant deviation from your successful study patterns');
    }

    return risks;
  }

  private calculateAverageDuration(sessions: any[]): number {
    if (sessions.length === 0) return 0;
    return sessions.reduce((sum, s) => {
      const duration = s.completedAt 
        ? (new Date(s.completedAt).getTime() - new Date(s.startedAt).getTime()) / (1000 * 60)
        : 0;
      return sum + duration;
    }, 0) / sessions.length;
  }

  private analyzeBreakPatterns(sessions: any[]): any {
    // Implementation for break pattern analysis
    return {
      optimalBreakInterval: 25, // minutes
      optimalBreakDuration: 5 // minutes
    };
  }

  private analyzeEnvironmentFactors(sessions: any[]): any {
    // Implementation for environment factor analysis
    return {
      noiseLevel: 'low',
      timeOfDay: 'morning',
      location: 'home'
    };
  }
}
