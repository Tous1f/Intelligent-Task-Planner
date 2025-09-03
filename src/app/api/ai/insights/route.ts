import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

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

    // Get user's tasks for analysis
    const tasks = await prisma.task.findMany({
      where: { profileId: profile.id },
      include: {
        studySessions: {
          orderBy: { startedAt: 'desc' },
          take: 10
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // Get study sessions for productivity analysis
    const recentSessions = await prisma.studySession.findMany({
      where: { profileId: profile.id },
      include: { task: true },
      orderBy: { startedAt: 'desc' },
      take: 20
    });

    // Generate insights
    const insights = generateInsights(tasks, recentSessions);
    
    // Get existing AI insights from database
    const existingInsights = await prisma.aIInsight.findMany({
      where: {
        profileId: profile.id,
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Save new insights if significant
    if (insights.length > 0) {
      await Promise.all(insights.map(insight => 
        prisma.aIInsight.create({
          data: {
            profileId: profile.id,
            insightType: insight.type,
            confidenceLevel: insight.confidence,
            insightData: insight,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          }
        })
      ));
    }

    // Calculate pomodoro stats
    const pomodoroStats = calculatePomodoroStats(recentSessions);

    return NextResponse.json({ 
      success: true, 
      insights: [...insights, ...existingInsights.map(i => i.insightData)],
      pomodoroStats,
      taskSummary: {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'COMPLETED').length,
        pending: tasks.filter(t => t.status === 'PENDING').length,
        overdue: tasks.filter(t => t.dueDate && new Date() > t.dueDate && t.status !== 'COMPLETED').length
      },
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('AI insights error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate insights',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// Helper functions
function generateInsights(tasks: any[], sessions: any[]) {
  const insights = [];

  // Workload analysis
  const upcomingTasks = tasks.filter(t => 
    t.dueDate && new Date(t.dueDate) > new Date() && t.status !== 'COMPLETED'
  );

  if (upcomingTasks.length > 5) {
    insights.push({
      type: 'workload_prediction',
      confidence: 0.8,
      message: `High workload detected: ${upcomingTasks.length} tasks due soon. Consider prioritizing and breaking down large tasks.`,
      actionable: true,
      data: { taskCount: upcomingTasks.length }
    });
  }

  // Productivity patterns
  if (sessions.length >= 5) {
    const avgRating = sessions
      .filter(s => s.productivityRating)
      .reduce((sum, s) => sum + s.productivityRating, 0) / sessions.length;

    if (avgRating > 3.5) {
      insights.push({
        type: 'productivity_pattern',
        confidence: 0.9,
        message: `Excellent productivity! Your average session rating is ${avgRating.toFixed(1)}/5. Keep up the great work!`,
        actionable: false,
        data: { avgRating }
      });
    } else if (avgRating < 2.5) {
      insights.push({
        type: 'productivity_pattern',
        confidence: 0.7,
        message: `Productivity could improve. Average rating is ${avgRating.toFixed(1)}/5. Try shorter sessions or better environment.`,
        actionable: true,
        data: { avgRating }
      });
    }
  }

  // Subject focus analysis
  const subjectCount = new Map();
  tasks.forEach(task => {
    if (task.subject) {
      subjectCount.set(task.subject, (subjectCount.get(task.subject) || 0) + 1);
    }
  });

  if (subjectCount.size > 0) {
    const topSubject = Array.from(subjectCount.entries()).sort((a, b) => b[1] - a[1])[0];
    insights.push({
      type: 'study_recommendation',
      confidence: 0.6,
      message: `${topSubject[0]} is your most active subject (${topSubject[1]} tasks). Consider creating a dedicated study schedule.`,
      actionable: true,
      data: { subject: topSubject[0], taskCount: topSubject[1] }
    });
  }

  return insights;
}

function calculatePomodoroStats(sessions: any[]) {
  const completedSessions = sessions.filter(s => s.completedAt);
  const totalTime = sessions.reduce((sum, s) => sum + (s.actualDuration || s.plannedDuration), 0);
  
  return {
    totalSessions: sessions.length,
    completedSessions: completedSessions.length,
    completionRate: sessions.length > 0 ? (completedSessions.length / sessions.length) * 100 : 0,
    totalMinutes: totalTime,
    averageSessionLength: sessions.length > 0 ? totalTime / sessions.length : 0,
    weeklyGoalProgress: Math.min((totalTime / 300) * 100, 100) // 5 hours weekly goal
  };
}