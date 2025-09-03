'use client';

import Card from '@/components/ui/Card';

export default function AnalyticsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="font-display text-3xl mb-6 text-lavender-700">Analytics Overview</h1>
      <Card>
        <p className="text-lavender-700">
          Analyze your productivity trends and study performance.
        </p>
      </Card>
    </div>
  );
}
