import { GoogleGenerativeAI } from '@google/generative-ai'

export const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_AI_API_KEY!
)

export const AI_CONFIG = {
  model: 'gemini-1.5-flash', // Fast, free model
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 1000,
  }
} as const
