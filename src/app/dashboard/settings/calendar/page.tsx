'use client';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function CalendarSettings() {
  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="font-display text-2xl text-lavender-700 mb-6">Calendar Integration</h1>
      <Card>
        <p className="mb-4 text-lavender-600">
          Connect or disconnect your Google Calendar here. You can sync your tasks for seamless planning across platforms.
        </p>
        <Button variant="primary" className="w-full mb-2" onClick={() => alert('Connect Google Calendar')}>
          Connect Google Calendar
        </Button>
        <Button variant="secondary" className="w-full" onClick={() => alert('Disconnect Calendar')}>
          Disconnect
        </Button>
      </Card>
    </div>
  );
}
