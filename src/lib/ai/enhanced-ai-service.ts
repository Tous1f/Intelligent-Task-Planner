import { prisma } from '@/lib/prisma';
import { LearningPattern, CognitiveLoad, StudySession } from '@/types/ai-insights';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export class EnhancedAIService {
  async analyzeLearningPatterns(profileId: string): Promise<LearningPattern[]> {
    const studySessions = await prisma.studySession.findMany({
      where: { profileId },
      include: {
        task: true
      },
      orderBy: { startedAt: 'desc' },
      take: 50
    });

    return this.extractLearningPatterns(studySessions);
  }

  async predictOptimalStudyTime(
    profileId: string,
    taskType: string,
    complexity: number
  ): Promise<Date[]> {
    const patterns = await this.analyzeLearningPatterns(profileId);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Based on the following learning patterns:
      ${JSON.stringify(patterns, null, 2)}
      
      Recommend the best study times for a ${taskType} task with complexity ${complexity}/10.
      Consider factors like:
      - Historical productivity patterns
      - Cognitive load patterns
      - Break patterns
      - Environmental factors
      
      Return exactly 3 recommended time slots in ISO string format.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const timeSlots = JSON.parse(response.text());
    
    return timeSlots.map((slot: string) => new Date(slot));
  }

  async generatePersonalizedStrategy(
    profileId: string,
    taskId: string
  ): Promise<{
    strategy: string[];
    schedule: Array<{ start: Date; end: Date }>;
    recommendations: string[];
  }> {
    const [task, patterns, cognitiveLoad] = await Promise.all([
      prisma.task.findUnique({
        where: { id: taskId },
        include: { studysessions: true }
      }),
      this.analyzeLearningPatterns(profileId),
      this.analyzeCognitiveLoad(profileId)
    ]);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Create a personalized study strategy based on:
      Task: ${JSON.stringify(task)}
      Learning Patterns: ${JSON.stringify(patterns)}
      Cognitive Load: ${JSON.stringify(cognitiveLoad)}
      
      Provide:
      1. A list of specific study strategies
      2. A recommended schedule (max 3 time slots)
      3. Environment and break recommendations
      
      Format the response as a JSON object with properties:
      - strategy (string array)
      - schedule (array of {start, end} ISO strings)
      - recommendations (string array)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const strategy = JSON.parse(response.text());
    
    return {
      ...strategy,
      schedule: strategy.schedule.map((slot: any) => ({
        start: new Date(slot.start),
        end: new Date(slot.end)
      }))
    };
  }

  async analyzeProductivityTrends(
    profileId: string,
    days: number = 30
  ): Promise<{
    trends: Array<{ date: Date; productivity: number }>;
    insights: string[];
    suggestions: string[];
  }> {
    const sessions = await prisma.studySession.findMany({
      where: {
        profileId,
        startedAt: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        }
      },
      include: { task: true },
      orderBy: { startedAt: 'asc' }
    });

    const dailyProductivity = this.calculateDailyProductivity(sessions);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze these productivity trends:
      ${JSON.stringify(dailyProductivity, null, 2)}
      
      Provide:
      1. Key insights about productivity patterns
      2. Specific suggestions for improvement
      
      Format as JSON with properties:
      - insights (string array)
      - suggestions (string array)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = JSON.parse(response.text());

    return {
      trends: dailyProductivity,
      insights: analysis.insights,
      suggestions: analysis.suggestions
    };
  }

  async predictBurnoutRisk(profileId: string): Promise<{
    riskLevel: number;
    factors: string[];
    preventiveActions: string[];
  }> {
    const recentActivity = await prisma.studySession.findMany({
      where: { profileId },
      include: { task: true },
      orderBy: { startedAt: 'desc' },
      take: 20
    });

    const patterns = await this.analyzeLearningPatterns(profileId);
    const cognitiveLoad = await this.analyzeCognitiveLoad(profileId);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Assess burnout risk based on:
      Recent Activity: ${JSON.stringify(recentActivity)}
      Learning Patterns: ${JSON.stringify(patterns)}
      Cognitive Load: ${JSON.stringify(cognitiveLoad)}
      
      Consider:
      - Work intensity
      - Break patterns
      - Cognitive load
      - Session duration
      - Task complexity
      
      Return JSON with:
      - riskLevel (0-1)
      - factors (string array)
      - preventiveActions (string array)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  }

  private async analyzeCognitiveLoad(profileId: string): Promise<CognitiveLoad> {
    const sessions = await prisma.studySession.findMany({
      where: { profileId },
      include: {
        task: true
      },
      orderBy: { startedAt: 'desc' },
      take: 10
    });

    // Calculate average cognitive load metrics
    const fatigueLevel = Math.round(Math.max(1, Math.min(5, 3 - (this.calculateAverageComplexity(sessions) - 3))));
    return {
      taskComplexity: this.calculateAverageComplexity(sessions),
      mentalEffort: this.calculateMentalEffort(sessions),
      timeSpent: this.calculateAverageTime(sessions),
      comprehension: this.calculateComprehension(sessions),
      retentionRate: this.calculateRetention(sessions),
      fatigueLevel
    };
  }

  private extractLearningPatterns(sessions: any[]): LearningPattern[] {
    return sessions.map(session => ({
  timeOfDay: new Date(session.startedAt).getHours().toString(),
  // scale productivityRating (1-5) to 0-100
  productivity: (session.productivityRating ? Number(session.productivityRating) * 20 : 0),
  subjectArea: session.task?.subject || 'unknown',
  duration: this.calculateDuration(session),
  breaks: Array.isArray(session.breaks) ? session.breaks.length : 0,
  environment: session.environment?.type || (session.environment || 'unknown'),
  focusLevel: session.focusScore || session.focusRating || 0,
  energyLevel: session.energy ?? session.energyLevel ?? 0,
  completion: !!session.completedAt,
  distractions: Array.isArray(session.distractions) ? session.distractions : (session.distractions ? [session.distractions] : [])
    }));
  }

  private calculateDailyProductivity(sessions: any[]): Array<{ date: Date; productivity: number }> {
    const dailyMap = new Map<string, number[]>();

    sessions.forEach(session => {
      const date = new Date(session.startedAt).toISOString().split('T')[0];
      const productivity = session.productivityRating || 0;
      
      if (!dailyMap.has(date)) {
        dailyMap.set(date, []);
      }
      dailyMap.get(date)?.push(productivity);
    });

    return Array.from(dailyMap.entries()).map(([date, ratings]) => ({
      date: new Date(date),
      productivity: ratings.reduce((a, b) => a + b, 0) / ratings.length
    }));
  }

  private calculateDuration(session: any): number {
    if (!session.startedAt || !session.completedAt) return 0;
    return (new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime()) / (1000 * 60);
  }

  private calculateAverageComplexity(sessions: any[]): number {
    const complexities = sessions.map(s => s.task?.complexity || 0);
    return complexities.reduce((a, b) => a + b, 0) / sessions.length;
  }

  private calculateMentalEffort(sessions: any[]): number {
    const efforts = sessions.map(s => s.mentalEffortRating || 0);
    return efforts.reduce((a, b) => a + b, 0) / sessions.length;
  }

  private calculateAverageTime(sessions: any[]): number {
    return sessions.reduce((sum, s) => sum + this.calculateDuration(s), 0) / sessions.length;
  }

  private calculateComprehension(sessions: any[]): number {
    const comprehension = sessions.map(s => s.comprehensionRating || 0);
    return comprehension.reduce((a, b) => a + b, 0) / sessions.length;
  }

  private calculateRetention(sessions: any[]): number {
    const retention = sessions.map(s => s.retentionRating || 0);
    return retention.reduce((a, b) => a + b, 0) / sessions.length;
  }
}
