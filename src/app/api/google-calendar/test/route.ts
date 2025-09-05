import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth';
import { getCalendarClient } from '@/lib/calendar/google-calendar';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Make sure we have an access token
    if (!session.user.accessToken) {
      return NextResponse.json({ error: 'Not connected to Google Calendar' }, { status: 401 });
    }

    // Verify we have the right scopes
    const requiredScopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    const userScopes = (session.user.scope || '').split(' ');
    const missingScopes = requiredScopes.filter(scope => !userScopes.includes(scope));

    if (missingScopes.length > 0) {
      // User needs to re-authenticate with additional scopes
      return NextResponse.json({
        error: 'Insufficient permissions',
        missingScopes
      }, { status: 403 });
    }

    // Try to get calendar client
    const calendar = await getCalendarClient();

    if (!calendar) {
      return NextResponse.json({ error: 'Failed to initialize calendar client' }, { status: 500 });
    }

    // Test the connection with a simple request
    const testResponse = await calendar.events.list({
      calendarId: 'primary',
      maxResults: 1,
    });

    return NextResponse.json({
      connected: true,
      calendarId: testResponse.data.summary || 'primary',
      scopes: userScopes,
      provider: session.user.provider,
      hasValidToken: true,
    });

  } catch (error) {
    console.error('Google Calendar connection test error:', error);
    return NextResponse.json({
      error: 'Failed to connect to Google Calendar',
      message: error instanceof Error ? error.message : 'Unknown error',
      connected: false,
    }, { status: 500 });
  }
}
