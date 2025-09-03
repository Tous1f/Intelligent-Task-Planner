import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getUpcomingEvents } from '@/lib/calendar/google-calendar'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const events = await getUpcomingEvents(10)
    
    return NextResponse.json({
      success: true,
      events,
      total: events.length
    })

  } catch (error) {
    console.error('Calendar events fetch error:', error)
    return NextResponse.json({
      error: 'Failed to fetch calendar events',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
