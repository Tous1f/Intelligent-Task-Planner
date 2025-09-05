'use client';

import { Card } from '@/components/ui/exports';

export interface Stats {
  tasksCompleted: number;
  studyHours: number;
  focusTime: number;
  efficiency: number;
}

interface ProductivityStatsProps {
  stats: Stats;
}

export default function ProductivityStats({ stats }: ProductivityStatsProps) {

  return (
    <Card className="p-6">
      <h3 className="text-xl font-heading font-semibold mb-6 bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
        Productivity Stats
      </h3>
      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 rounded-lg bg-accent-50/50 dark:bg-accent-950/50 backdrop-blur-sm border border-accent-200/50 dark:border-accent-800/50">
          <p className="text-2xl font-bold bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
            {stats.tasksCompleted}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Tasks Completed</p>
        </div>
        <div className="p-4 rounded-lg bg-secondary-50/50 dark:bg-secondary-950/50 backdrop-blur-sm border border-secondary-200/50 dark:border-secondary-800/50">
          <p className="text-2xl font-bold bg-gradient-to-r from-secondary-600 to-secondary-700 dark:from-secondary-400 dark:to-secondary-500 bg-clip-text text-transparent">
            {stats.studyHours}h
          </p>
          <p className="text-sm text-muted-foreground mt-1">Study Hours</p>
        </div>
        <div className="p-4 rounded-lg bg-accent-50/50 dark:bg-accent-950/50 backdrop-blur-sm border border-accent-200/50 dark:border-accent-800/50">
          <p className="text-2xl font-bold bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
            {stats.focusTime}h
          </p>
          <p className="text-sm text-muted-foreground mt-1">Focus Time</p>
        </div>
        <div className="p-4 rounded-lg bg-secondary-50/50 dark:bg-secondary-950/50 backdrop-blur-sm border border-secondary-200/50 dark:border-secondary-800/50">
          <p className="text-2xl font-bold bg-gradient-to-r from-secondary-600 to-secondary-700 dark:from-secondary-400 dark:to-secondary-500 bg-clip-text text-transparent">
            {stats.efficiency}%
          </p>
          <p className="text-sm text-muted-foreground mt-1">Efficiency</p>
        </div>
      </div>
    </Card>
  );
}
