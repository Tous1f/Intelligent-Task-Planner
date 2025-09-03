'use client';

export default function DashboardError() {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-lavender-50 animate-fadeIn">
      <h1 className="font-display text-2xl text-lavender-700 mb-2">Dashboard Error</h1>
      <p className="text-lavender-500 mb-3">An error occurred in your dashboard. Please refresh or try again later.</p>
    </div>
  );
}
