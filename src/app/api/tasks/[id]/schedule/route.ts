import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { preferredDate, timeSlots, priority } = await request.json();
    const taskId = params.id;

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { email: session.user.email }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Verify task ownership
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        profileId: profile.id
      }
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found or access denied' }, { status: 404 });
    }

    // Get existing schedules to avoid conflicts
    const existingSchedules = await prisma.schedule.findMany({
      where: {
        profileId: profile.id,
        scheduledStart: { gte: new Date() }
      }
    });

    // Generate optimal schedule
    const scheduleResult = await generateSmartSchedule(task, {
      preferredDate,
      timeSlots,
      priority,
      existingSchedules
    });

    // Create the schedule
    const schedule = await prisma.schedule.create({
      data: {
        taskId: task.id,
        profileId: profile.id,
        scheduledStart: scheduleResult.scheduledStart,
        scheduledEnd: scheduleResult.scheduledEnd,
        aiConfidence: scheduleResult.confidence,
        scheduleType: 'ai_generated'
      },
      include: {
        task: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      schedule: {
        ...schedule,
        conflicts: scheduleResult.conflicts,
        recommendations: scheduleResult.recommendations
      },
      message: 'Task scheduled successfully!'
    });

  } catch (error) {
    console.error('Schedule creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to schedule task',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// GET - Fetch schedules for a task
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const taskId = params.id;
    
    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { email: session.user.email }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get task schedules
    const schedules = await prisma.schedule.findMany({
      where: {
        taskId: taskId,
        profileId: profile.id
      },
      include: {
        task: true
      },
      orderBy: {
        scheduledStart: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      schedules,
      total: schedules.length
    });

  } catch (error) {
    console.error('Schedule fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch schedules',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// Helper function for smart scheduling
async function generateSmartSchedule(task: any, options: any) {
  const now = new Date();
  const taskDuration = task.estimatedDuration || 60; // minutes
  
  // Default to next available time if no preference
  let preferredStart = options.preferredDate 
    ? new Date(options.preferredDate)
    : new Date(now.getTime() + 24 * 60 * 60 * 1000); // tomorrow
    
  // Ensure preferred time is in the future
  if (preferredStart <= now) {
    preferredStart = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
  }

  // Set default time if no time specified (9 AM)
  if (options.preferredDate && !options.preferredDate.includes('T')) {
    preferredStart.setHours(9, 0, 0, 0);
  }

  const scheduledEnd = new Date(preferredStart.getTime() + taskDuration * 60 * 1000);

  // Check for conflicts
  const conflicts = [];
  for (const existing of options.existingSchedules || []) {
    if (timesOverlap(preferredStart, scheduledEnd, existing.scheduledStart, existing.scheduledEnd)) {
      conflicts.push(`Conflicts with existing schedule at ${existing.scheduledStart.toLocaleString()}`);
    }
  }

  // Generate recommendations
  const recommendations = [];
  
  if (task.priority >= 4) {
    recommendations.push("High priority task - consider scheduling during your peak focus hours");
  }
  
  if (taskDuration > 90) {
    recommendations.push("Long task - consider breaking into multiple sessions with breaks");
  }
  
  if (conflicts.length > 0) {
    recommendations.push("Schedule conflicts detected - consider adjusting time or splitting task");
  }

  // Calculate confidence based on various factors
  let confidence = 0.7;
  if (conflicts.length === 0) confidence += 0.2;
  if (task.priority >= 4) confidence += 0.1;
  if (task.subject) confidence += 0.1;

  return {
    scheduledStart: preferredStart,
    scheduledEnd: scheduledEnd,
    confidence: Math.min(confidence, 1.0),
    conflicts,
    recommendations
  };
}

function timesOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
  return start1 < end2 && start2 < end1;
}
