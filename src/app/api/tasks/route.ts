import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { TaskType, TaskStatus } from '@prisma/client';

// POST - Create new task
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { naturalLanguageInput } = await request.json();

    if (!naturalLanguageInput?.trim()) {
      return NextResponse.json({ error: 'Task description required' }, { status: 400 });
    }

    // Step 1: Parse with AI endpoint
    const aiResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/ai/parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: naturalLanguageInput })
    });
    
    if (!aiResponse.ok) {
      return NextResponse.json({ error: 'AI parsing service unavailable' }, { status: 500 });
    }

    const { success, parsedTask } = await aiResponse.json();
    
    if (!success) {
      return NextResponse.json({ error: 'AI parsing failed' }, { status: 400 });
    }

    // Step 2: Get or create user profile
    let profile = await prisma.profile.findUnique({
      where: { email: session.user.email }
    });

    // Create profile if it doesn't exist
    if (!profile) {
      // First find the user
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          email: session.user.email,
          displayName: session.user.name || 'User'
        }
      });
    }

    // Step 3: Validate and map task type and status using enums
    const validTaskType = Object.values(TaskType).includes(parsedTask.taskType as TaskType) 
      ? (parsedTask.taskType as TaskType) 
      : TaskType.OTHER;

    const validStatus = TaskStatus.PENDING; // Default for new tasks

    // Step 4: Save to database with proper enum handling
    const savedTask = await prisma.task.create({
      data: {
        title: parsedTask.title || 'Untitled Task',
        description: parsedTask.description || `AI-generated from: "${naturalLanguageInput}"`,
        taskType: validTaskType,
        priority: Math.min(Math.max(parsedTask.priority || 3, 1), 5), // Ensure 1-5 range
        estimatedDuration: parsedTask.estimatedDuration || 60,
        subject: parsedTask.subject || null,
        tags: Array.isArray(parsedTask.tags) ? parsedTask.tags : [],
        status: validStatus,
        dueDate: parsedTask.dueDate ? new Date(parsedTask.dueDate) : null,
        profileId: profile.id,
        aiSuggestions: {
          originalInput: naturalLanguageInput,
          confidence: 0.85,
          provider: 'Google Gemini',
          parsedAt: new Date().toISOString(),
          rawParsedData: parsedTask
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      task: {
        ...savedTask,
        // Convert enums to string for frontend
        taskType: savedTask.taskType.toString(),
        status: savedTask.status.toString()
      },
      aiParsed: parsedTask,
      message: 'Task created successfully!'
    });

  } catch (error) {
    console.error('Task creation error:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Duplicate task detected' }, { status: 409 });
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json({ error: 'Invalid profile reference' }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Failed to create task',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// GET - Fetch user's tasks
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as TaskStatus | null;
    const priority = searchParams.get('priority');
    const subject = searchParams.get('subject');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { email: session.user.email }
    });

    if (!profile) {
      return NextResponse.json({ 
        success: true, 
        tasks: [], 
        total: 0,
        message: 'No profile found - please create a task first' 
      });
    }

    // Build query filters
    const whereClause: any = { 
      profileId: profile.id 
    };

    if (status && Object.values(TaskStatus).includes(status)) {
      whereClause.status = status;
    }

    if (priority) {
      const priorityNum = parseInt(priority);
      if (priorityNum >= 1 && priorityNum <= 5) {
        whereClause.priority = priorityNum;
      }
    }

    if (subject) {
      whereClause.subject = {
        contains: subject,
        mode: 'insensitive'
      };
    }

    // Fetch tasks with related data
    const [tasks, totalCount] = await Promise.all([
      prisma.task.findMany({
        where: whereClause,
        include: {
          schedules: {
            orderBy: { scheduledStart: 'asc' },
            take: 5 // Limit schedules per task
          },
          studySessions: {
            orderBy: { startedAt: 'desc' },
            take: 10 // Limit sessions per task
          }
        },
        orderBy: [
          { priority: 'desc' }, // High priority first
          { dueDate: 'asc' },   // Earliest due date first
          { createdAt: 'desc' } // Newest first as tiebreaker
        ],
        take: limit,
        skip: offset
      }),
      prisma.task.count({ where: whereClause })
    ]);

    // Transform tasks for frontend consumption
    const transformedTasks = tasks.map(task => ({
      ...task,
      taskType: task.taskType.toString(),
      status: task.status.toString(),
      // Add computed fields
      isOverdue: task.dueDate ? new Date() > task.dueDate : false,
      completionRate: task.actualDuration && task.estimatedDuration 
        ? Math.min((task.actualDuration / task.estimatedDuration) * 100, 100)
        : 0,
      totalStudyTime: task.studySessions.reduce((sum, session) => 
        sum + (session.actualDuration || session.plannedDuration), 0),
      nextSchedule: task.schedules.length > 0 ? task.schedules[0] : null
    }));

    // Calculate summary statistics
    const stats = {
      total: totalCount,
      pending: tasks.filter(t => t.status === TaskStatus.PENDING).length,
      inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      completed: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
      overdue: tasks.filter(t => t.dueDate && new Date() > t.dueDate && t.status !== TaskStatus.COMPLETED).length,
      averagePriority: tasks.length > 0 
        ? Math.round(tasks.reduce((sum, t) => sum + t.priority, 0) / tasks.length * 10) / 10
        : 0
    };

    return NextResponse.json({ 
      success: true, 
      tasks: transformedTasks,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      stats,
      message: `Found ${tasks.length} tasks`
    });

  } catch (error) {
    console.error('Task fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch tasks',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// PUT - Update task status or details
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId, updates } = await request.json();

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
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        profileId: profile.id
      }
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found or access denied' }, { status: 404 });
    }

    // Validate enum values if provided
    const validatedUpdates: any = { ...updates };

    if (updates.taskType && !Object.values(TaskType).includes(updates.taskType)) {
      validatedUpdates.taskType = TaskType.OTHER;
    }

    if (updates.status && !Object.values(TaskStatus).includes(updates.status)) {
      delete validatedUpdates.status; // Skip invalid status
    }

    if (updates.priority) {
      validatedUpdates.priority = Math.min(Math.max(parseInt(updates.priority), 1), 5);
    }

    if (updates.dueDate) {
      validatedUpdates.dueDate = new Date(updates.dueDate);
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...validatedUpdates,
        updatedAt: new Date()
      },
      include: {
        schedules: true,
        studySessions: true
      }
    });

    return NextResponse.json({
      success: true,
      task: {
        ...updatedTask,
        taskType: updatedTask.taskType.toString(),
        status: updatedTask.status.toString()
      },
      message: 'Task updated successfully!'
    });

  } catch (error) {
    console.error('Task update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update task',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// DELETE - Delete a task
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');

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
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        profileId: profile.id
      }
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found or access denied' }, { status: 404 });
    }

    // Delete task (cascading delete will handle related records)
    await prisma.task.delete({
      where: { id: taskId }
    });

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully!',
      deletedTaskId: taskId
    });

  } catch (error) {
    console.error('Task deletion error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete task',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}