import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

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

    // Step 1: Parse with your working AI endpoint
    const aiResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/ai/parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: naturalLanguageInput })
    });
    
    const { success, parsedTask } = await aiResponse.json();
    
    if (!success) {
      return NextResponse.json({ error: 'AI parsing failed' }, { status: 400 });
    }

    // Step 2: Get user profile
    let profile = await prisma.profile.findUnique({
      where: { email: session.user.email }
    });

    // Create profile if it doesn't exist
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          email: session.user.email,
          displayName: session.user.name || 'User'
        }
      });
    }

    // Step 3: Save to database with enhanced academic fields
    const savedTask = await prisma.task.create({
      data: {
        title: parsedTask.title,
        description: `AI-generated from: "${naturalLanguageInput}"`,
        taskType: parsedTask.taskType || 'OTHER',
        priority: parsedTask.priority || 3,
        estimatedDuration: parsedTask.estimatedDuration || 60,
        subject: parsedTask.subject,
        tags: parsedTask.tags || [],
        profileId: profile.id,
        aiSuggestions: {
          originalInput: naturalLanguageInput,
          confidence: 0.85,
          provider: 'Google Gemini',
          parsedAt: new Date().toISOString()
        },
        status: 'PENDING'
      }
    });

    return NextResponse.json({ 
      success: true, 
      task: savedTask,
      aiParsed: parsedTask 
    });

  } catch (error) {
    console.error('Task creation error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

// Get user's tasks
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
      return NextResponse.json({ tasks: [] });
    }

    const tasks = await prisma.task.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: 'desc' },
      include: {
        schedules: true,
        studySessions: true
      }
    });

    return NextResponse.json({ success: true, tasks });

  } catch (error) {
    console.error('Task fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
