import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/supabase'
import { geminiTaskParser } from '@/lib/ai/nlp/gemini-task-parser'

export async function POST(request: NextRequest) {
  try {
    // Skip auth for testing - uncomment when ready
    // const supabase = createClient()
    // const { data: { user }, error: authError } = await supabase.auth.getUser()
    // if (authError || !user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { text } = await request.json()
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text input required' }, { status: 400 })
    }

    const parsedTask = await geminiTaskParser.parseNaturalLanguage(text)
    
    return NextResponse.json({ 
      success: true, 
      parsedTask,
      originalInput: text,
      provider: 'Google Gemini (FREE)'
    })
    
  } catch (error) {
    console.error('Gemini parsing error:', error)
    return NextResponse.json({ 
      error: 'Parsing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
