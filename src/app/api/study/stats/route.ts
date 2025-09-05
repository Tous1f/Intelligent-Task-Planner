import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        tasks: true,
          studysessions: {
            where: {
              startedAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
              }
            },
            include: { task: true }
          }
      }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Calculate statistics
    const totalTasks = profile.tasks.length
    const completedTasks = profile.tasks.filter(task => task.status === 'COMPLETED').length
    const overdueTasks = profile.tasks.filter(task => {
      if (!task.dueDate || task.status === 'COMPLETED') return false
      return new Date(task.dueDate) < new Date()
    }).length
    const todayTasks = profile.tasks.filter(task => {
      if (!task.dueDate) return false
      const today = new Date()
      const dueDate = new Date(task.dueDate)
      return dueDate.toDateString() === today.toDateString()
    }).length

    // Calculate study streak
    const studyDays = new Set(
      (profile.studysessions || []).map(session => 
        new Date(session.startedAt).toDateString()
      )
    )
    let streak = 0
    const today = new Date()
    let currentDate = new Date(today)

    while (studyDays.has(currentDate.toDateString())) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    }

    // Calculate weekly productivity
    const lastWeekSessions = (profile.studysessions || []).filter(session => 
      session.startedAt >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    )
    const averageDailySessionsLastWeek = lastWeekSessions.length / 7
    const weeklyProductivity = Math.min(
      Math.round((averageDailySessionsLastWeek / 2) * 100), // Assuming target is 2 sessions per day
      100
    )

    // Calculate total study time
    const totalStudyTime = (profile.studysessions || []).reduce((total, session) => {
      const duration = session.actualDuration ?? session.plannedDuration ?? (session.completedAt && session.startedAt ? (new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime()) / (1000*60) : 0)
      return total + (Number(duration) || 0)
    }, 0)

    // Calculate subject breakdown
    const subjectBreakdown = (profile.studysessions || []).reduce((acc, session) => {
      const subject = session.task?.subject || 'unknown'
      acc[subject] = (acc[subject] || 0) + (Number(session.actualDuration ?? session.plannedDuration) || 0)
      return acc
    }, {} as Record<string, number>)

    const stats = {
      totalTasks,
      completedTasks,
      overdueTasks,
      todayTasks,
      weeklyProductivity,
      studyStreak: streak,
      totalStudyTime,
      subjectBreakdown: Object.entries(subjectBreakdown).map(([subject, timeSpent]) => ({
        subject,
        timeSpent
      })).sort((a, b) => b.timeSpent - a.timeSpent)
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Study stats calculation error:', error)
    return NextResponse.json({ error: 'Failed to calculate study stats' }, { status: 500 })
  }
}
