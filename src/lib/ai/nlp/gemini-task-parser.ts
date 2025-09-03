import { genAI, AI_CONFIG } from '../gemini-client'
import { z } from 'zod'

const parsedTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.number().min(1).max(5),
  estimatedDuration: z.number().optional(),
  subject: z.string().optional(),
  taskType: z.enum(['ASSIGNMENT', 'EXAM', 'PROJECT', 'READING', 'OTHER']),
  tags: z.array(z.string()).optional()
})

export type ParsedTask = z.infer<typeof parsedTaskSchema>

export class GeminiTaskParser {
  async parseNaturalLanguage(input: string): Promise<ParsedTask> {
    const model = genAI.getGenerativeModel({ 
      model: AI_CONFIG.model,
      generationConfig: AI_CONFIG.generationConfig
    })

    const prompt = `Parse this natural language task into structured JSON data:

Input: "${input}"

Current date: ${new Date().toISOString().split('T')[0]}

Return ONLY valid JSON with these fields:
{
  "title": "clear task title",
  "description": "optional context", 
  "dueDate": "ISO date or null",
  "priority": 1-5 (5=highest),
  "estimatedDuration": minutes as number,
  "subject": "academic subject if mentioned",
  "taskType": "ASSIGNMENT|EXAM|PROJECT|READING|OTHER",
  "tags": ["relevant", "keywords"]
}

Example: "Math homework due Friday 6pm" →
{"title": "Complete Math homework", "dueDate": "2025-09-06T18:00:00.000Z", "priority": 4, "estimatedDuration": 120, "subject": "Mathematics", "taskType": "ASSIGNMENT", "tags": ["math", "homework"]}

Return only JSON:`

    try {
      const result = await model.generateContent(prompt)
      const response = result.response.text()
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found in response')
      
      const parsed = JSON.parse(jsonMatch[0])
      return parsedTaskSchema.parse(parsed)
      
    } catch (error) {
      console.error('Gemini parsing error:', error)
      return this.fallbackParse(input)
    }
  }

  private fallbackParse(input: string): ParsedTask {
    return {
      title: input.length > 50 ? input.substring(0, 47) + '...' : input,
      priority: 3,
      taskType: 'OTHER',
      estimatedDuration: 60,
      tags: []
    }
  }
}

export const geminiTaskParser = new GeminiTaskParser()
