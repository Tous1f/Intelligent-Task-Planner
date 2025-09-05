import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CalendarEvent } from '@/types/calendar';
import { authOptions } from '../../auth/[...nextauth]/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { accounts: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const googleAccount = user.accounts.find(acc => acc.provider === 'google');
    if (!googleAccount) {
      return NextResponse.json(
        { 
          events: [],
          hasGoogleCalendar: false,
          success: true 
        }
      );
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: googleAccount.access_token,
      refresh_token: googleAccount.refresh_token,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const { start, end } = getTimeRange(request.nextUrl.searchParams);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events: CalendarEvent[] = (response.data.items || []).map((event: any) => ({
      id: event.id,
      title: event.summary || 'No title',
      description: event.description,
      location: event.location,
      startTime: event.start?.dateTime ? new Date(event.start.dateTime) : (event.start?.date ? new Date(event.start.date) : new Date()),
      endTime: event.end?.dateTime ? new Date(event.end.dateTime) : (event.end?.date ? new Date(event.end.date) : new Date()),
      isAllDay: !event.start?.dateTime && !!event.start?.date,
      source: 'GOOGLE',
      googleEventId: event.id,
      attendees: event.attendees?.map((attendee: any) => ({
        email: attendee.email,
        displayName: attendee.displayName,
        responseStatus: attendee.responseStatus,
      })),
      recurrence: event.recurrence,
      status: event.status || 'confirmed',
      createdAt: event.created ? new Date(event.created) : undefined,
      updatedAt: event.updated ? new Date(event.updated) : undefined
    } as CalendarEvent));

    return NextResponse.json({ 
      events,
      hasGoogleCalendar: true,
      success: true 
    });
  } catch (error) {
    console.error('Calendar events error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch calendar events',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function getTimeRange(params: URLSearchParams) {
  let start = new Date();
  let end = new Date();
  end.setDate(end.getDate() + 30); // Default to next 30 days

  if (params.has('start')) {
    start = new Date(params.get('start')!);
  }
  if (params.has('end')) {
    end = new Date(params.get('end')!);
  }

  return { start, end };
}