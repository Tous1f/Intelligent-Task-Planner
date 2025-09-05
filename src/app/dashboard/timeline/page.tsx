'use client';

import { Card } from '@/components/ui/card';

export default function TimelinePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="font-display text-3xl mb-6 text-lavender-700">Timeline View</h1>
      <Card>
        <p className="text-lavender-700">
          Visualize your tasks and deadlines on an interactive timeline.
        </p>
      </Card>
    </div>
  );
}
