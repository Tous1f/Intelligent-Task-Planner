'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function CalendarPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="font-display text-3xl mb-6 text-lavender-700">Calendar Integration</h1>
      <Card>
        <p className="text-lavender-700 mb-4">
          Sync your tasks with Google Calendar to never miss a deadline.
        </p>
        <Button variant="primary" onClick={() => alert('Manage calendar sync')}>
          Sync Calendar
        </Button>
      </Card>
    </div>
  );
}
