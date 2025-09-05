export default function DashboardLoading() {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-accent-50/50 to-accent-100/50 dark:from-accent-950/50 dark:to-accent-900/50 animate-fadeIn">
      <div className="flex items-center space-x-4 p-6 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm backdrop-saturate-150 border border-border/50 dark:border-white/10 shadow-[0_8px_16px_rgb(0_0_0/0.08)] dark:shadow-[0_8px_16px_rgb(0_0_0/0.16)]">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 animate-spin [&::before]:content-[''] [&::before]:block [&::before]:h-4 [&::before]:w-4 [&::before]:rounded-[50%] [&::before]:bg-white dark:[&::before]:bg-slate-900"></div>
        <span className="text-lg font-medium bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
          Loading your dashboard...
        </span>
      </div>
    </div>
  );
}
