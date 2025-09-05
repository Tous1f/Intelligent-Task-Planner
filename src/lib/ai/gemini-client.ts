import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error('GOOGLE_AI_API_KEY environment variable is not set')
}

export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)

export const AI_CONFIG = {
  model: process.env.AI_MODEL_NAME || 'gemini-pro',
  generationConfig: {
    temperature: process.env.AI_TEMPERATURE ? parseFloat(process.env.AI_TEMPERATURE) : 0.7,
    maxOutputTokens: process.env.AI_MAX_TOKENS ? parseInt(process.env.AI_MAX_TOKENS) : 1000,
  }
} as const

export class GeminiClient {
  private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>

  constructor() {
    this.model = genAI.getGenerativeModel(AI_CONFIG)
  }

  async getCompletion(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Error getting completion from Gemini:', error)
      throw error
    }
  }
}
