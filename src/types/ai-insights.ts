import { z } from 'zod';

export const AIInsightTypeSchema = z.enum([
  'PRODUCTIVITY_PATTERN',
  'STUDY_OPTIMIZATION',
  'TASK_SCHEDULING',
  'LEARNING_STYLE',
  'FOCUS_TIME',
  'BREAK_PATTERN',
  'WORKLOAD_BALANCE',
  'DEADLINE_RISK',
  'PERFORMANCE_TREND',
  'CUSTOM'
]);

export const LearningPatternSchema = z.object({
  timeOfDay: z.string(),
  productivity: z.number().min(0).max(100),
  subjectArea: z.string(),
  duration: z.number(),
  breaks: z.number(),
  environment: z.string(),
  focusLevel: z.number().min(1).max(10),
  energyLevel: z.number().min(1).max(5),
  completion: z.boolean(),
  distractions: z.array(z.string())
});

export const CognitiveLoadSchema = z.object({
  taskComplexity: z.number().min(1).max(5),
  mentalEffort: z.number().min(1).max(10),
  timeSpent: z.number(),
  comprehension: z.number().min(1).max(5),
  retentionRate: z.number().min(0).max(100),
  fatigueLevel: z.number().min(1).max(5)
});

export const StudySessionSchema = z.object({
  startTime: z.date(),
  endTime: z.date(),
  duration: z.number(),
  learningPattern: LearningPatternSchema,
  cognitiveLoad: CognitiveLoadSchema,
  breaks: z.array(z.object({
    startTime: z.date(),
    duration: z.number(),
    type: z.enum(['SHORT', 'LONG'])
  })),
  achievements: z.array(z.string()),
  insights: z.array(z.string())
});

export const AIInsightSchema = z.object({
  id: z.string(),
  type: AIInsightTypeSchema,
  confidence: z.number().min(0).max(1),
  priority: z.number().min(0),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']),
  data: z.record(z.unknown()),
  appliedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type AIInsightType = z.infer<typeof AIInsightTypeSchema>;
export type LearningPattern = z.infer<typeof LearningPatternSchema>;
export type CognitiveLoad = z.infer<typeof CognitiveLoadSchema>;
export type StudySession = z.infer<typeof StudySessionSchema>;
export type AIInsight = z.infer<typeof AIInsightSchema>;
