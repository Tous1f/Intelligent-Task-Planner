import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';
import { getCalendarClient } from '@/lib/calendar/google-calendar';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      console.log('Calendar status - No session found');
      return NextResponse.json({ connected: false, reason: 'no_session' });
    }

    // Test database connection first
    try {
      const dbUser = await prisma.user.findUnique({
        where: {
          email: session.user.email || '',
        },
      });
      
      console.log('Database connection test - User query successful');
      
      if (!dbUser) {
        return NextResponse.json({ 
          connected: false, 
          dbStatus: 'connected_but_no_user',
          reason: 'user_not_found' 
        });
      }

      if (!session.user.accessToken) {
        console.log('Calendar status - No access token found');
        return NextResponse.json({ 
          connected: false, 
          dbStatus: 'connected',
          reason: 'no_access_token' 
        });
      }

      // Then test Google Calendar connection
      const calendar = await getCalendarClient();
      if (!calendar) {
        return NextResponse.json({
          connected: false,
          dbStatus: 'connected',
          reason: 'calendar_client_error'
        });
      }

      // Finally try to list a single event to verify access
      try {
        await calendar.events.list({
          calendarId: 'primary',
          maxResults: 1,
        });
        
        return NextResponse.json({
          connected: true,
          dbStatus: 'connected',
          calendar: {
            provider: session.user.provider,
            hasToken: !!session.user.accessToken,
            tokenExpiresAt: session.user.expiresAt
          }
        });
      } catch (error) {
        console.error('Failed to verify calendar access:', error);
        return NextResponse.json({
          connected: false,
          dbStatus: 'connected',
          reason: 'calendar_access_error',
          error: error instanceof Error ? error.message : 'Failed to access calendar'
        });
      }
    } catch (dbError) {
      console.error('Database connection test failed:', dbError);
      return NextResponse.json({ 
        connected: false, 
        dbStatus: 'error',
        reason: 'database_error',
        error: dbError instanceof Error ? dbError.message : 'Unknown database error'
      });
    }
  } catch (error) {
    console.error('Calendar status check error:', error);
    return NextResponse.json(
      { 
        connected: false,
        reason: 'internal_error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
