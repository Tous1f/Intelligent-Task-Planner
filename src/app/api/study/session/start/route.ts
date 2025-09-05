import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    const startSession = await prisma.studySession.create({
      // cast as any to avoid strict generated types for now
      data: {
        startedAt: new Date(),
        profileId: profile.id,
        userId: session.user.id,
        taskId: '',
        plannedDuration: 25,
        sessionType: 'FREESTYLE'
      } as any
    })

    return NextResponse.json(startSession)
  } catch (error) {
    console.error('Study session start error:', error)
    return NextResponse.json({ error: 'Failed to start study session' }, { status: 500 })
  }
}
