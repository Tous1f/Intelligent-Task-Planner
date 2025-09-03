'use client';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useState } from 'react';

export default function StudySettings() {
  const [pomodoroLength, setPomodoroLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="font-display text-2xl text-lavender-700 mb-6">Study Tool Preferences</h1>
      <Card>
        <form className="space-y-6">
          <div>
            <label className="block text-lavender-700 mb-1 font-semibold" htmlFor="pomodoro">Pomodoro Length (min)</label>
            <input
              type="number"
              id="pomodoro"
              value={pomodoroLength}
              onChange={e => setPomodoroLength(Number(e.target.value))}
              min={15}
              max={90}
              className="border px-3 py-2 rounded-md w-24"
            />
          </div>
          <div>
            <label className="block text-lavender-700 mb-1 font-semibold" htmlFor="break">Break Length (min)</label>
            <input
              type="number"
              id="break"
              value={breakLength}
              onChange={e => setBreakLength(Number(e.target.value))}
              min={3}
              max={30}
              className="border px-3 py-2 rounded-md w-24"
            />
          </div>
          <Button className="w-full mt-6">Save Preferences</Button>
        </form>
      </Card>
    </div>
  );
}
