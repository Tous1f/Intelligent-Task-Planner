'use client';

import { Card } from '@/components/ui/card';

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-3 bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
          Analytics Overview
        </h1>
        <p className="text-muted-foreground dark:text-slate-400">
          Track your progress and analyze your productivity patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
                Study Time
              </h3>
              <div className="px-3 py-1 rounded-full text-sm font-medium bg-accent-50/50 dark:bg-accent-950/50 text-accent-700 dark:text-accent-300">
                This Week
              </div>
            </div>
            <div className="mb-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
                24.5h
              </div>
              <div className="text-sm text-muted-foreground dark:text-slate-400">
                Total study hours
              </div>
            </div>
            <div className="space-y-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={day} className="flex items-center">
                  <div className="w-10 text-sm text-muted-foreground dark:text-slate-400">{day}</div>
                  <div className="flex-1 h-2 ml-2 bg-accent-100 dark:bg-accent-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 rounded-full"
                      style={{ width: `${[65, 80, 45, 90, 70, 40, 55][i]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
                Task Completion
              </h3>
              <div className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-50/50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                85% rate
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground dark:text-slate-400">Assignments</span>
                  <span className="font-medium text-accent-700 dark:text-accent-300">92%</span>
                </div>
                <div className="h-2 bg-accent-100 dark:bg-accent-900 rounded-full overflow-hidden">
                  <div className="h-full w-[92%] bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground dark:text-slate-400">Study Goals</span>
                  <span className="font-medium text-accent-700 dark:text-accent-300">78%</span>
                </div>
                <div className="h-2 bg-accent-100 dark:bg-accent-900 rounded-full overflow-hidden">
                  <div className="h-full w-[78%] bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground dark:text-slate-400">Practice Tests</span>
                  <span className="font-medium text-accent-700 dark:text-accent-300">85%</span>
                </div>
                <div className="h-2 bg-accent-100 dark:bg-accent-900 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
                Study Habits
              </h3>
              <div className="px-3 py-1 rounded-full text-sm font-medium bg-accent-50/50 dark:bg-accent-950/50 text-accent-700 dark:text-accent-300">
                Last 30 days
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-accent-50/30 dark:bg-accent-950/30">
                <div className="text-2xl font-bold bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
                  4.2h
                </div>
                <div className="text-sm text-muted-foreground dark:text-slate-400">
                  Average daily study time
                </div>
              </div>
              <div className="p-4 rounded-xl bg-accent-50/30 dark:bg-accent-950/30">
                <div className="text-2xl font-bold bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
                  8
                </div>
                <div className="text-sm text-muted-foreground dark:text-slate-400">
                  Current study streak (days)
                </div>
              </div>
              <div className="p-4 rounded-xl bg-accent-50/30 dark:bg-accent-950/30">
                <div className="text-2xl font-bold bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
                  92%
                </div>
                <div className="text-sm text-muted-foreground dark:text-slate-400">
                  Tasks completed on time
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
