import { BaseService } from '@/lib/services/base-service';
import { google } from 'googleapis';
import { CalendarEvent } from '@/types/calendar';
import { prisma } from '@/lib/prisma';

class CalendarService extends BaseService {
  async getEvents(start: Date, end: Date): Promise<CalendarEvent[]> {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        throw new Error('User not found');
      }

      const calendarAuth = await prisma.account.findFirst({
        where: {
          userId: user.id,
          provider: 'google',
        },
      });

      if (!calendarAuth) {
        throw new Error('Google Calendar not connected');
      }

      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({
        access_token: calendarAuth.access_token,
        refresh_token: calendarAuth.refresh_token,
      });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      return (response.data.items?.map((event: any) => ({
        id: event.id,
        title: event.summary || 'Untitled',
        description: event.description,
        location: event.location,
        // Normalize start/end to Date types expected by CalendarEvent
        startTime: new Date(event.start?.dateTime || event.start?.date || new Date()),
        endTime: new Date(event.end?.dateTime || event.end?.date || new Date()),
        isAllDay: !!event.start?.date && !event.start?.dateTime,
        source: 'GOOGLE' as any,
        googleEventId: event.id,
        attendees: Array.isArray(event.attendees) ? event.attendees.map((a: any) => ({ email: a.email, displayName: a.displayName })) : undefined,
        recurrence: Array.isArray(event.recurrence) ? event.recurrence : undefined,
        status: event.status || 'confirmed',
        createdAt: event.created,
        updatedAt: event.updated
      })) || []) as unknown as CalendarEvent[];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw new Error('Failed to fetch calendar events');
    }
  }

  async syncWithGoogleCalendar(): Promise<void> {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        throw new Error('User not found');
      }

      const calendarAuth = await prisma.account.findFirst({
        where: {
          userId: user.id,
          provider: 'google',
        },
      });

      if (!calendarAuth) {
        throw new Error('Google Calendar not connected');
      }

      // Perform any additional sync operations here
      // For now, we'll just verify the connection
    } catch (error) {
      console.error('Error syncing with Google Calendar:', error);
      throw new Error('Failed to sync with Google Calendar');
    }
  }
}

export const calendarService = new CalendarService();
