import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';

// Start a pomodoro session
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId, sessionType = 'POMODORO', plannedDuration = 25 } = await request.json();
    
    if (!taskId) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }

    // Get user profile through user record
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    });

    const profile = user?.profile;

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Verify task exists and belongs to user
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        profileId: profile.id
      }
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found or access denied' }, { status: 404 });
    }

    // Create study session
  const studySession = await prisma.studySession.create({
      data: {
        taskId: taskId,
        userId: user.id,
        profileId: profile.id,
        sessionType: sessionType,
        plannedDuration: plannedDuration,
        startedAt: new Date(),
        totalPauseDuration: 0
      }
    });

    return NextResponse.json({ 
      success: true, 
      session: studySession,
      message: 'Pomodoro session started!'
    });

  } catch (error) {
    console.error('Pomodoro start error:', error);
    return NextResponse.json({ 
      error: 'Failed to start pomodoro session',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}

// Get pomodoro statistics and complete session
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') as 'today' | 'week' | 'month' || 'today';
    const sessionId = searchParams.get('sessionId');
    
    // Get user profile through user record
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    });

    const profile = user?.profile;

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // If sessionId provided, return specific session
    if (sessionId) {
  const studySession = await prisma.studySession.findFirst({
        where: {
          id: sessionId,
          profileId: profile.id
        },
        include: { task: true }
      });

      if (!studySession) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, session: studySession });
    }

    // Get statistics for the period
    const startDate = getStartDate(period);
    
    const sessions = await prisma.studySession.findMany({
      where: {
        profileId: profile.id,
        startedAt: { gte: startDate }
      },
      include: { task: true },
      orderBy: { startedAt: 'desc' }
    });

    const stats = {
      totalSessions: sessions.length,
      completedSessions: sessions.filter(s => s.completedAt).length,
      totalTimeSpent: sessions.reduce((sum, s) => sum + (s.actualDuration || s.plannedDuration), 0),
      averageProductivity: sessions.filter(s => s.productivityRating).length > 0
        ? sessions.reduce((sum, s) => sum + (s.productivityRating || 0), 0) / sessions.filter(s => s.productivityRating).length
        : 0,
      completionRate: sessions.length > 0 
        ? (sessions.filter(s => s.completedAt).length / sessions.length) * 100
        : 0,
      subjects: groupSessionsBySubject(sessions),
      recentSessions: sessions.slice(0, 5)
    };

    return NextResponse.json({ success: true, stats });

  } catch (error) {
    console.error('Pomodoro stats error:', error);
    return NextResponse.json({ 
      error: 'Failed to get pomodoro stats',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}

// Complete a pomodoro session
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      sessionId, 
      actualDuration, 
      interruptions = 0, 
      productivityRating,
      notes
    } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Get user profile through user record
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    });

    const profile = user?.profile;

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Verify session ownership
    const existingSession = await prisma.studySession.findFirst({
      where: {
        id: sessionId,
        profileId: profile.id
      }
    });

    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found or access denied' }, { status: 404 });
    }

    // Update session
    const updatedSession = await prisma.studySession.update({
      where: { id: sessionId },
        data: {
        completedAt: new Date(),
        actualDuration: actualDuration || existingSession.plannedDuration,
        totalPauseDuration: interruptions,
        productivityRating: productivityRating ? Math.min(Math.max(productivityRating, 1), 5) : null
      },
      include: { task: true }
    });

    // Update task progress
    if (actualDuration) {
      const totalTimeSpent = await getTotalTimeSpent(existingSession.taskId);
      await prisma.task.update({
        where: { id: existingSession.taskId },
        data: { actualDuration: totalTimeSpent }
      });
    }

    return NextResponse.json({
      success: true,
      session: updatedSession,
      message: 'Pomodoro session completed!'
    });

  } catch (error) {
    console.error('Pomodoro completion error:', error);
    return NextResponse.json({ 
      error: 'Failed to complete pomodoro session',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}

// Helper functions
function getStartDate(period: 'today' | 'week' | 'month'): Date {
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

function groupSessionsBySubject(sessions: any[]): Record<string, number> {
  const subjects: Record<string, number> = {};
  sessions.forEach(session => {
    const subject = session.task?.subject || 'Other';
    subjects[subject] = (subjects[subject] || 0) + (session.actualDuration || session.plannedDuration);
  });
  return subjects;
}

async function getTotalTimeSpent(taskId: string): Promise<number> {
  const sessions = await prisma.studySession.findMany({
    where: { taskId },
    select: {
      plannedDuration: true
    }
  });
  return sessions.reduce((sum, s) => sum + (s.plannedDuration || 0), 0);
}