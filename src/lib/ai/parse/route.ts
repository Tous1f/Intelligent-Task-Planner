import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/supabase'
import { claudeTaskParser } from '@/lib/ai/nlp/claude-task-parser'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { text } = await request.json()
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text input required' }, { status: 400 })
    }

    const parsedTask = await claudeTaskParser.parseNaturalLanguage(text)
    
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
