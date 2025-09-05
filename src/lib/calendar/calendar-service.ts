import { prisma } from '@/lib/prisma';
import { getCalendarClient } from './google-calendar';
import { type Prisma } from '@prisma/client';

export type EventSource = 'LOCAL' | 'GOOGLE';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string | null;
  startTime: Date;
  endTime: Date;
  location?: string | null;
  isAllDay?: boolean;
  source: EventSource;
  googleEventId?: string | null;
}

export async function getEvents(userId: string, start?: Date, end?: Date): Promise<CalendarEvent[]> {
  // First get the user's profile
  const profile = await prisma.profile.findUnique({
    where: { userId }
  });

  if (!profile) {
    throw new Error('User profile not found');
  }

  // Get local events from database

  const dbEvents = await prisma.event.findMany({
    where: {
      calendar: {
        userId: userId,
      },
      AND: [
        start ? { startTime: { gte: start } } : {},
        end ? { endTime: { lte: end } } : {},
      ],
    },
  });

  let allEvents: CalendarEvent[] = dbEvents.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location,
    isAllDay: event.isAllDay,
    source: 'LOCAL' as const,
    googleEventId: event.googleEventId,
  }));

  // Try to get Google Calendar events if connected
  try {
    const calendar = await getCalendarClient();
    if (calendar) {
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: start?.toISOString() || new Date().toISOString(),
        timeMax: end?.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const googleEvents = (response.data.items || []).map(event => ({
        id: event.id!,
        title: event.summary || 'Untitled Event',
        description: event.description || null,
        startTime: new Date(event.start?.dateTime || event.start?.date!),
        endTime: new Date(event.end?.dateTime || event.end?.date!),
        isAllDay: !event.start?.dateTime,
        location: event.location || null,
        source: 'GOOGLE' as const,
        googleEventId: event.id,
      }));

      allEvents = [...allEvents, ...googleEvents];
    }
  } catch (error) {
    console.error('Failed to fetch Google Calendar events:', error);
    // Continue with local events only
  }

  // Sort all events by start time
  return allEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
}

export async function createEvent(userId: string, eventData: Omit<CalendarEvent, 'id' | 'source'>): Promise<CalendarEvent> {
  // Get the user's calendar (local type) first
  const calendar = await prisma.calendar.findFirst({
    where: { userId, type: 'local' },
  });

  if (!calendar) {
    throw new Error('User calendar not found');
  }

  const { googleEventId, ...restData } = eventData;

  const dbEvent = await prisma.event.create({
    data: {
      ...restData,
      calendarId: calendar.id,
      source: 'LOCAL',
      googleEventId,
    },
  });

  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description,
    startTime: dbEvent.startTime,
    endTime: dbEvent.endTime,
    location: dbEvent.location,
    isAllDay: dbEvent.isAllDay,
    source: dbEvent.source as EventSource,
    googleEventId: dbEvent.googleEventId,
  };
}

export async function updateEvent(eventId: string, userId: string, eventData: Partial<Omit<CalendarEvent, 'id' | 'source'>>): Promise<CalendarEvent> {
  // Get the user's calendar (local type) first
  const calendar = await prisma.calendar.findFirst({
    where: { userId, type: 'local' },
  });

  if (!calendar) {
    throw new Error('User calendar not found');
  }

  const dbEvent = await prisma.event.update({
    where: {
      id: eventId,
      calendarId: calendar.id,
    },
    data: eventData,
  });

  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description,
    startTime: dbEvent.startTime,
    endTime: dbEvent.endTime,
    location: dbEvent.location,
    isAllDay: dbEvent.isAllDay,
    source: dbEvent.source as EventSource,
    googleEventId: dbEvent.googleEventId,
  };
}

export async function deleteEvent(eventId: string, userId: string): Promise<void> {
  // Get the user's calendar (local type) first
  const calendar = await prisma.calendar.findFirst({
    where: { userId, type: 'local' },
  });

  if (!calendar) {
    throw new Error('User calendar not found');
  }

  await prisma.event.delete({
    where: {
      id: eventId,
      calendarId: calendar.id,
    },
  });
}
