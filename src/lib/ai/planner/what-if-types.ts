import { z } from 'zod';

// Schema for time blocks
const TimeBlockSchema = z.object({
  start: z.string().transform((str) => new Date(str)),
  end: z.string().transform((str) => new Date(str))
});

// Schema for study preferences
const StudyPreferencesSchema = z.object({
  preferredTimes: z.array(z.string()),
  breakDuration: z.number(),
  sessionLength: z.number()
});

// Schema for what-if analysis parameters
export const WhatIfParamsSchema = z.object({
  scenarioType: z.enum(['schedule', 'workload', 'impact']),
  params: z.object({
    adjustedDeadlines: z.array(z.string()).optional(),
    timeBlocks: z.array(TimeBlockSchema).optional(),
    studyPreferences: StudyPreferencesSchema.optional(),
    workloadDistribution: z.enum(['even', 'frontend-heavy', 'backend-heavy']).optional()
  })
});

export type WhatIfParams = z.infer<typeof WhatIfParamsSchema>;
