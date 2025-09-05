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
        studysessions: {
          orderBy: { startedAt: 'desc' },
          take: 10
        }
      }
    })

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    return NextResponse.json({ sessions: profile.studysessions || [] })
  } catch (error) {
    console.error('Study sessions fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch study sessions' }, { status: 500 })
  }
}
