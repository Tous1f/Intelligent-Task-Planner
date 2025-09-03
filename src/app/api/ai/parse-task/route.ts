// src/app/api/ai/parse-task/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { geminiTaskParser } from '@/lib/ai/nlp/gemini-task-parser'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { text } = await request.json()
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text input required' },
        { status: 400 }
      )
    }

    const parsedTask = await geminiTaskParser.parseNaturalLanguage(text)
    
    return NextResponse.json({
      success: true,
      parsedTask,
      originalInput: text,
      provider: 'Gemini'
    })
    
  } catch (error) {
    console.error('AI parsing error:', error)
    return NextResponse.json(
      { error: 'Failed to parse task' },
      { status: 500 }
    )
  }
}