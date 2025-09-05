'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SchedulePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="font-display text-3xl mb-6 text-lavender-700">Your Schedule</h1>
      <Card>
        <p className="text-lavender-700 mb-4">
          View and manage your scheduled tasks with AI-powered conflict awareness.
        </p>
        <Button variant="primary" onClick={() => alert('View detailed schedule')}>
          Open Schedule
        </Button>
      </Card>
    </div>
  );
}
