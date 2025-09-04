// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { geminiTaskParser } from '@/lib/ai/nlp/gemini-task-parser'
import { z } from 'zod'

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.number().min(1).max(5).default(3),
  estimatedDuration: z.number().optional(),
  subject: z.string().optional(),
  taskType: z.enum(['ASSIGNMENT', 'EXAM', 'PROJECT', 'READING', 'OTHER']).default('OTHER'),
  tags: z.array(z.string()).default([]),
  naturalLanguageInput: z.string().optional(),
})

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
    const limit = searchParams.get('limit')

    const tasks = await prisma.task.findMany({
      where: {
        profileId: user.profile.id,
        ...(status && { status: status as any }),
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
      ],
      ...(limit && { take: parseInt(limit) })
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

    const rawBody = await request.json()
    const validatedData = createTaskSchema.parse(rawBody)
    
    const { naturalLanguageInput, ...taskData } = validatedData
    let processedTaskData = { ...taskData }

    // If natural language input is provided, parse it with AI
    if (naturalLanguageInput) {
      try {
        const parsedTask = await geminiTaskParser.parseNaturalLanguage(naturalLanguageInput)
        // Merge AI parsed data with manual input, manual input takes precedence
        processedTaskData = { ...parsedTask, ...taskData }
      } catch (parseError) {
        console.error('AI parsing error:', parseError)
        // Continue with manual data if AI parsing fails
      }
    }

    const task = await prisma.task.create({
      data: {
        ...processedTaskData,
        profileId: user.profile.id,
        dueDate: processedTaskData.dueDate ? new Date(processedTaskData.dueDate) : null,
        status: 'TODO'
      },
      include: {
        schedules: true,
        studySessions: true
      }
    })

    return NextResponse.json({ task }, { status: 201 })

  } catch (error) {
    console.error('Task creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}