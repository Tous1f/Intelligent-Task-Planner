import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if we have a session
    if (!session?.user) {
      console.log('Connect Calendar - No session found');
      return NextResponse.redirect(new URL('/api/auth/signin?callbackUrl=/dashboard/calendar', request.url));
    }

    // If user is signed in with credentials, redirect to Google sign in
    if (!session.user.provider || session.user.provider !== 'google') {
      console.log('Connect Calendar - User needs to authenticate with Google');
      const searchParams = new URLSearchParams({
        callbackUrl: '/dashboard/calendar',
        provider: 'google'
      });
      return NextResponse.redirect(new URL(`/api/auth/signin?${searchParams}`, request.url));
    }

    // Check if we need to request calendar permissions
    if (!session.user.accessToken || !session.user.refreshToken) {
      console.log('Connect Calendar - No tokens found, requesting calendar access');
      const state = encodeURIComponent(JSON.stringify({
        callbackUrl: '/dashboard/calendar',
        provider: 'google'
      }));
      const searchParams = new URLSearchParams({
        scope: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events',
        access_type: 'offline',
        prompt: 'consent',
        state
      });
      return NextResponse.redirect(new URL(`/api/auth/signin/google?${searchParams}`, request.url));
    }

    // Verify calendar access
    try {
      // Get scope from session that was passed from token
      const sessionScope = (session as any).scope || '';
      const requiredScopes = [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events'
      ];

      // Check if we have all required scopes
      const hasAllScopes = requiredScopes.every(scope => 
        sessionScope.includes(scope)
      );

      if (!hasAllScopes) {
        console.log('Connect Calendar - Missing required scopes, requesting consent');
        const searchParams = new URLSearchParams({
          callbackUrl: '/dashboard/calendar',
          scope: requiredScopes.join(' '),
          prompt: 'consent',
          access_type: 'offline',
        });
        return NextResponse.redirect(new URL(`/api/auth/signin/google?${searchParams}`, request.url));
      }

      // All good, redirect to calendar page
      return NextResponse.redirect(new URL('/dashboard/calendar', request.url));

    } catch (verifyError) {
      console.error('Connect Calendar - Token verification failed:', verifyError);
      const searchParams = new URLSearchParams({
        callbackUrl: '/dashboard/calendar',
        scope: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events',
        prompt: 'consent',
        access_type: 'offline',
      });
      return NextResponse.redirect(new URL(`/api/auth/signin/google?${searchParams}`, request.url));
    }
    
  } catch (error) {
    console.error('Calendar connection error:', error);
    return NextResponse.redirect(new URL('/?error=calendar_connection_failed', request.url));
  }
}
