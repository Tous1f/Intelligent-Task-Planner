'use client';

export default function DashboardError() {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-accent-50/50 to-accent-100/50 dark:from-accent-950/50 dark:to-accent-900/50 animate-fadeIn">
      <div className="p-8 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm backdrop-saturate-150 border border-border/50 dark:border-white/10 shadow-[0_8px_16px_rgb(0_0_0/0.08)] dark:shadow-[0_8px_16px_rgb(0_0_0/0.16)]">
        <h1 className="text-2xl font-heading font-semibold mb-3 bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
          Dashboard Error
        </h1>
        <p className="text-muted-foreground dark:text-slate-400">
          An error occurred in your dashboard. Please refresh or try again later.
        </p>
      </div>
    </div>
  );
}
