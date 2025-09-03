'use client';

import Card from '@/components/ui/Card';

export default function InsightsPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="font-display text-3xl mb-6 text-lavender-700">AI Productivity Insights</h1>
      <Card>
        <ul className="space-y-4">
          <li>
            <span className="font-semibold text-lavender-700">⏰ Peak Focus Period:</span>
            <span className="ml-2 text-lavender-600">Evenings (6pm-9pm)</span>
          </li>
          <li>
            <span className="font-semibold text-lavender-700">💡 AI Recommendation:</span>
            <span className="ml-2 text-lavender-600">Schedule deep work during these hours for better productivity.</span>
          </li>
          <li>
            <span className="font-semibold text-lavender-700">📈 Completion Rate:</span>
            <span className="ml-2 text-lavender-600">82% of tasks completed on time this week.</span>
          </li>
          <li>
            <span className="font-semibold text-lavender-700">🔥 Top Subject:</span>
            <span className="ml-2 text-lavender-600">Data Structures (most study time logged)</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
