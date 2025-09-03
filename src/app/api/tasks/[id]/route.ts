// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { geminiTaskParser } from '@/lib/ai/nlp/gemini-task-parser'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    })

    if (!user?.profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const subject = searchParams.get('subject')

    const tasks = await prisma.task.findMany({
      where: {
        profileId: user.profile.id,
        ...(status && { status }),
        ...(priority && { priority: parseInt(priority) }),
        ...(subject && { subject: { contains: subject, mode: 'insensitive' } })
      },
      include: {
        schedules: true,
        studySessions: true
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' }
      ]
    })

    return NextResponse.json({ tasks })

  } catch (error) {
    console.error('Tasks fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    })

    if (!user?.profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const { naturalLanguageInput, ...taskData } = body

    let finalTaskData = taskData

    // If natural language input is provided, parse it with AI
    if (naturalLanguageInput) {
      try {
        const parsedTask = await geminiTaskParser.parseNaturalLanguage(naturalLanguageInput)
        finalTaskData = { ...parsedTask, ...taskData } // taskData overrides parsed data
      } catch (parseError) {
        console.error('AI parsing error:', parseError)
        // Continue with manual data if AI parsing fails
      }
    }

    const task = await prisma.task.create({
      data: {
        ...finalTaskData,
        profileId: user.profile.id,
        status: finalTaskData.status || 'TODO'
      },
      include: {
        schedules: true,
        studySessions: true
      }
    })

    return NextResponse.json({ task })

  } catch (error) {
    console.error('Task creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}