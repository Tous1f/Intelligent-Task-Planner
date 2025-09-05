import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/auth'
import { prisma } from '@/lib/prisma'
import { geminiTaskParser } from '@/lib/ai/nlp/gemini-task-parser'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create profile
    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id },
      update: {}
    })

    const tasks = await prisma.task.findMany({
      where: { profileId: profile.id },
      include: {
        schedules: true,
  studysessions: true
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' }
      ]
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Tasks fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create profile
    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id },
      update: {}
    })

    const body = await request.json()
    const { naturalLanguageInput, ...taskData } = body

    let finalTaskData = taskData

    // Use AI parsing if natural language input provided
    if (naturalLanguageInput) {
      try {
        const parsedTask = await geminiTaskParser.parseNaturalLanguage(naturalLanguageInput)
        finalTaskData = { ...parsedTask, ...taskData }
      } catch (parseError) {
        console.error('AI parsing error:', parseError)
      }
    }

    const task = await prisma.task.create({
      data: {
        ...finalTaskData,
        profileId: profile.id,
        status: finalTaskData.status || 'TODO'
      },
      include: {
        schedules: true,
  studysessions: true
      }
    })

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error('Task creation error:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
