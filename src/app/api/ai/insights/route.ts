import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { AIService } from '@/lib/ai/ai-service';
import { SmartScheduler } from '@/lib/ai/planner/smart-scheduler';
import { PomodoroTimer } from '@/lib/study/pomodoro-timer';
import { prisma } from '@/lib/prisma';

const aiService = new AIService();
const smartScheduler = new SmartScheduler();
const pomodoroTimer = new PomodoroTimer();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { email: session.user.email }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Generate AI insights
    const insights = await aiService.generatePersonalizedInsights(profile.id);
    
    // Get pomodoro stats
    const pomodoroStats = await pomodoroTimer.getSessionStats(profile.id, 'week');

    return NextResponse.json({ 
      success: true, 
      insights,
      pomodoroStats,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('AI insights error:', error);
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
}
