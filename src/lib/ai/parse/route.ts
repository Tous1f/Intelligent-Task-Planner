import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth'
import { geminiTaskParser } from '@/lib/ai/nlp/gemini-task-parser'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { text } = await request.json()
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text input required' }, { status: 400 })
    }

    const parsedTask = await geminiTaskParser.parseNaturalLanguage(text)
    
    return NextResponse.json({ 
      success: true, 
      parsedTask,
      originalInput: text,
      provider: 'Claude'
    })
    
  } catch (error) {
    console.error('Claude parsing error:', error)
    return NextResponse.json({ 
      error: 'Parsing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
