import { google } from 'googleapis'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth'

export async function getCalendarClient() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.accessToken) {
    console.error('No access token available');
    return null;
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!
    );

    oauth2Client.setCredentials({
      access_token: session.user.accessToken,
      refresh_token: session.user.refreshToken,
      expiry_date: session.user.expiresAt,
      scope: session.user.scope,
    });

    return google.calendar({ version: 'v3', auth: oauth2Client });
  } catch (error) {
    console.error('Error creating calendar client:', error);
    return null;
  }
}

export async function getUpcomingEvents(maxResults: number = 10) {
  try {
    const calendar = await getCalendarClient();
    if (!calendar) {
      return [];
    }
    
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
}

export async function testCalendarAccess() {
  try {
    const calendar = await getCalendarClient();
    if (!calendar) {
      return { success: false, error: 'No calendar client available' };
    }

    const response = await calendar.events.list({
      calendarId: 'primary',
      maxResults: 1,
    });

    return {
      success: true,
      calendarId: response.data.summary || 'primary'
    };
  } catch (error) {
    console.error('Error testing calendar access:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
