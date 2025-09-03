import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PomodoroTimer } from '@/lib/study/pomodoro-timer';

const pomodoroTimer = new PomodoroTimer();

// Start a pomodoro session
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId, sessionType, config } = await request.json();
    
    const pomodoroSession = await pomodoroTimer.startSession(taskId, sessionType, config);

    return NextResponse.json({ success: true, session: pomodoroSession });

  } catch (error) {
    console.error('Pomodoro start error:', error);
    return NextResponse.json({ error: 'Failed to start pomodoro session' }, { status: 500 });
  }
}

// Get pomodoro statistics  
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') as 'today' | 'week' | 'month' || 'today';
    
    // Get profile
    const profile = await prisma.profile.findUnique({
      where: { email: session.user.email }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const stats = await pomodoroTimer.getSessionStats(profile.id, period);

    return NextResponse.json({ success: true, stats });

  } catch (error) {
    console.error('Pomodoro stats error:', error);
    return NextResponse.json({ error: 'Failed to get pomodoro stats' }, { status: 500 });
  }
}
