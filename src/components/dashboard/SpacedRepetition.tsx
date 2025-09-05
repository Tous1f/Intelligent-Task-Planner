'use client';

import { Card } from '@/components/ui/exports';

export default function SpacedRepetition() {
  const mockFlashcards = [
    {
      id: 1,
      subject: 'Mathematics',
      dueDate: '2024-02-20',
      progress: 75,
    },
    {
      id: 2,
      subject: 'History',
      dueDate: '2024-02-21',
      progress: 60,
    },
    {
      id: 3,
      subject: 'Physics',
      dueDate: '2024-02-22',
      progress: 90,
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-heading font-semibold mb-6 bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
        Spaced Repetition
      </h3>
      <div className="space-y-4">
        {mockFlashcards.map((flashcard) => (
          <div
            key={flashcard.id}
            className="p-4 rounded-lg bg-accent-50/30 dark:bg-accent-950/30 backdrop-blur-sm
                     border border-accent-200/50 dark:border-accent-800/50 transition-all duration-200
                     hover:bg-accent-50/50 dark:hover:bg-accent-950/50 hover:border-accent-300/50 dark:hover:border-accent-700/50"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-accent-700 dark:text-accent-300">
                {flashcard.subject}
              </h4>
              <span className="text-sm text-muted-foreground px-2 py-1 rounded-md bg-background/50 dark:bg-slate-900/50 border border-border/50">
                Due: {flashcard.dueDate}
              </span>
            </div>
            <div className="w-full h-2 bg-accent-100 dark:bg-accent-900 rounded-full overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 dark:from-accent-400 dark:to-accent-500"
                style={{ width: `${flashcard.progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-sm font-medium text-accent-600 dark:text-accent-400">
                {flashcard.progress}% Mastered
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
