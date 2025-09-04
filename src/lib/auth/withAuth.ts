// src/lib/auth/withAuth.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export function withAuth(handler: (req: NextRequest, session: any) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const session = await getServerSession(authOptions)
      
      if (!session || !session.user?.email) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      return handler(req, session)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }
  }
}