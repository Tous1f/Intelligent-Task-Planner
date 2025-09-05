import { NextRequest, NextResponse } from 'next/server';

// This route is not needed. Google OAuth is handled by NextAuth.js at /api/auth/signin/google
// This file is a placeholder to prevent 404s. The frontend should use /api/auth/signin/google for Google Calendar connection.

export async function GET(request: NextRequest) {
  return NextResponse.json({
    error: 'Use /api/auth/signin/google for Google Calendar connection. This route is not used.'
  }, { status: 400 });
}
