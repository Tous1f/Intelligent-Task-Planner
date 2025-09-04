// src/lib/ai/nlp/gemini-task-parser.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ParsedTask {
  title: string;
  description?: string;
  dueDate?: string;
  priority: number;
  estimatedDuration?: number;
  subject?: string;
  taskType: 'ASSIGNMENT' | 'EXAM' | 'PROJECT' | 'READING' | 'OTHER';
  tags: string[];
}

class GeminiTaskParser {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    if (process.env.GOOGLE_AI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
  }

  async parseNaturalLanguage(input: string): Promise<Partial<ParsedTask>> {
    if (!this.model) {
      // Fallback parsing without AI
      return this.fallbackParsing(input);
    }

    try {
      const prompt = `
        Parse this natural language task input into structured data. Return only valid JSON with these fields:
        - title (required): Brief task title
        - description (optional): Detailed description
        - dueDate (optional): ISO date string if mentioned
        - priority (1-5): Based on urgency (1=low, 5=urgent)
        - estimatedDuration (optional): Minutes if mentioned
        - subject (optional): Subject/category
        - taskType: One of: ASSIGNMENT, EXAM, PROJECT, READING, OTHER
        - tags: Array of relevant tags

        Input: "${input}"

        Example output:
        {
          "title": "Complete math homework",
          "description": "Solve problems 1-20 from chapter 5",
          "priority": 3,
          "taskType": "ASSIGNMENT",
          "tags": ["homework", "math"]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return this.validateParsedTask(parsed);
      }
      
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Gemini parsing error:', error);
      return this.fallbackParsing(input);
    }
  }

  private fallbackParsing(input: string): Partial<ParsedTask> {
    const lowerInput = input.toLowerCase();
    
    // Extract basic information using regex and keywords
    const priority = this.extractPriority(lowerInput);
    const taskType = this.extractTaskType(lowerInput);
    const tags = this.extractTags(lowerInput);
    const estimatedDuration = this.extractDuration(input);
    const dueDate = this.extractDueDate(input);

    return {
      title: this.cleanTitle(input),
      priority,
      taskType,
      tags,
      ...(estimatedDuration && { estimatedDuration }),
      ...(dueDate && { dueDate }),
    };
  }

  private extractPriority(input: string): number {
    if (input.includes('urgent') || input.includes('asap') || input.includes('critical')) return 5;
    if (input.includes('important') || input.includes('high priority')) return 4;
    if (input.includes('medium') || input.includes('moderate')) return 3;
    if (input.includes('low priority') || input.includes('whenever')) return 2;
    return 3; // default
  }

  private extractTaskType(input: string): ParsedTask['taskType'] {
    if (input.includes('assignment') || input.includes('homework')) return 'ASSIGNMENT';
    if (input.includes('exam') || input.includes('test') || input.includes('quiz')) return 'EXAM';
    if (input.includes('project')) return 'PROJECT';
    if (input.includes('read') || input.includes('study')) return 'READING';
    return 'OTHER';
  }

  private extractTags(input: string): string[] {
    const tags: string[] = [];
    const keywords = ['homework', 'study', 'project', 'exam', 'reading', 'assignment', 'math', 'science', 'english', 'history'];
    
    keywords.forEach(keyword => {
      if (input.includes(keyword)) {
        tags.push(keyword);
      }
    });

    return tags;
  }

  private extractDuration(input: string): number | undefined {
    const matches = input.match(/(\d+)\s*(hour|hr|minute|min)/i);
    if (matches) {
      const value = parseInt(matches[1]);
      const unit = matches[2].toLowerCase();
      return unit.startsWith('hour') || unit.startsWith('hr') ? value * 60 : value;
    }
    return undefined;
  }

  private extractDueDate(input: string): string | undefined {
    // Simple date extraction - can be enhanced
    const today = new Date();
    
    if (input.includes('today')) {
      return today.toISOString();
    }
    
    if (input.includes('tomorrow')) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString();
    }

    // Look for date patterns like "March 15" or "3/15"
    const dateMatch = input.match(/(\d{1,2})[\/\-](\d{1,2})/);
    if (dateMatch) {
      const month = parseInt(dateMatch[1]) - 1; // JavaScript months are 0-indexed
      const day = parseInt(dateMatch[2]);
      const year = today.getFullYear();
      const date = new Date(year, month, day);
      
      if (date < today) {
        date.setFullYear(year + 1); // Next year if date has passed
      }
      
      return date.toISOString();
    }

    return undefined;
  }

  private cleanTitle(input: string): string {
    // Remove common prefixes and clean up
    let title = input.replace(/^(create|add|new|make)\s+/i, '');
    title = title.replace(/\s+(task|todo|item)$/i, '');
    
    // Capitalize first letter
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  private validateParsedTask(parsed: any): Partial<ParsedTask> {
    const validated: Partial<ParsedTask> = {};

    if (parsed.title && typeof parsed.title === 'string') {
      validated.title = parsed.title;
    }

    if (parsed.description && typeof parsed.description === 'string') {
      validated.description = parsed.description;
    }

    if (parsed.priority && typeof parsed.priority === 'number' && parsed.priority >= 1 && parsed.priority <= 5) {
      validated.priority = parsed.priority;
    } else {
      validated.priority = 3;
    }

    if (parsed.estimatedDuration && typeof parsed.estimatedDuration === 'number') {
      validated.estimatedDuration = parsed.estimatedDuration;
    }

    if (parsed.subject && typeof parsed.subject === 'string') {
      validated.subject = parsed.subject;
    }

    if (parsed.taskType && ['ASSIGNMENT', 'EXAM', 'PROJECT', 'READING', 'OTHER'].includes(parsed.taskType)) {
      validated.taskType = parsed.taskType;
    } else {
      validated.taskType = 'OTHER';
    }

    if (parsed.tags && Array.isArray(parsed.tags)) {
      validated.tags = parsed.tags.filter((tag: any) => typeof tag === 'string');
    } else {
      validated.tags = [];
    }

    if (parsed.dueDate && typeof parsed.dueDate === 'string') {
      try {
        const date = new Date(parsed.dueDate);
        if (!isNaN(date.getTime())) {
          validated.dueDate = date.toISOString();
        }
      } catch (error) {
        // Invalid date, skip
      }
    }

    return validated;
  }
}

export const geminiTaskParser = new GeminiTaskParser();