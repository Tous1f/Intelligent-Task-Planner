import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

const calendar = google.calendar('v3');

export async function GET() {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get user's Google token from database
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'google',
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Google account not connected' },
        { status: 404 }
      );
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token,
      expiry_date: account.expires_at ? account.expires_at * 1000 : null,
    });

    // Get events from the next 7 days
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    const response = await calendar.events.list({
      auth: oauth2Client,
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: sevenDaysFromNow.toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items?.map(event => ({
      id: event.id,
      summary: event.summary,
      description: event.description,
      start: event.start,
      end: event.end,
      colorId: event.colorId,
      location: event.location,
    })) || [];

    // If token was refreshed, update it in the database
    const tokens = oauth2Client.credentials;
    if (tokens.access_token !== account.access_token) {
      await prisma.account.update({
        where: { id: account.id },
        data: {
          access_token: tokens.access_token,
          expires_at: Math.floor(Date.now() / 1000 + 3600), // 1 hour from now
        },
      });
    }

    return NextResponse.json({ events });
  } catch (error: any) {
    console.error('Error fetching Google Calendar events:', error);
    
    // Handle token expiration
    if (error.code === 401) {
      return NextResponse.json(
        { error: 'Google Calendar token expired' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch Google Calendar events' },
      { status: 500 }
    );
  }
}
