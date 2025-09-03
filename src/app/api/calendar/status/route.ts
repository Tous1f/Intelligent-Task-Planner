// src/app/api/calendar/status/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({ 
      connected: !!session?.accessToken,
      user: session?.user || null
    });

  } catch (error) {
    console.error('Calendar status check error:', error);
    return NextResponse.json({ connected: false });
  }
}