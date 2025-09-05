import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { duration } = await request.json()

    const updatedSession = await prisma.studySession.update({
      where: { id: params.id },
      data: {
        completedAt: new Date(),
        actualDuration: duration
      } as any
    })

    return NextResponse.json(updatedSession)
  } catch (error) {
    console.error('Study session end error:', error)
    return NextResponse.json({ error: 'Failed to end study session' }, { status: 500 })
  }
}
