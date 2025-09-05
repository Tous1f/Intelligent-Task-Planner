'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function StudyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="font-display text-3xl mb-6 text-lavender-700">Study Tools</h1>
      <Card>
        <p className="text-lavender-700 mb-4">
          Use Pomodoro timers and Spaced Repetition to boost your productivity.
        </p>
        <Button variant="primary" onClick={() => alert('Start Pomodoro')}>
          Start Pomodoro Timer
        </Button>
      </Card>
    </div>
  );
}
