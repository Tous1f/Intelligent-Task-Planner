import { Prisma } from '@prisma/client';

export type EventSource = 'LOCAL' | 'GOOGLE' | 'TASK';

export interface CalendarDateTime {
  dateTime?: string;
  date?: string;
  timeZone?: string;
}

export interface CalendarAttendee {
  email: string;
  displayName?: string;
  responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  source: EventSource;
  googleEventId?: string;
  attendees?: CalendarAttendee[];
  recurrence?: string[];
  status: 'confirmed' | 'tentative' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Calendar {
  id: string;
  name: string;
  type: 'google' | 'local';
  googleCalendarId?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  syncToken?: string;
  userId: string;
}

export interface CalendarSettings {
  defaultView: 'month' | 'week' | 'day' | 'agenda';
  showWeekends: boolean;
  workingHours: {
    start: number;
    end: number;
  };
  timeZone: string;
  defaultCalendarId?: string;
  autoSync: boolean;
  reminderDefault: number; // minutes
  defaultEventDuration: number; // minutes
}

export interface CalendarSyncStatus {
  lastSynced?: Date;
  nextSync?: Date;
  status: 'SYNCED' | 'PENDING' | 'ERROR';
  error?: string;
}
