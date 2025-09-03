'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useToast } from '@/hooks/use-toast';

const TASK_MOCK = {
  id: '1',
  title: 'Finish AI project documentation',
  dueDate: '2025-09-08',
  completed: false,
};

export default function TaskDetailPage() {
  // In future: fetch task from API with id param
  const [title, setTitle] = useState(TASK_MOCK.title);
  const [dueDate, setDueDate] = useState(TASK_MOCK.dueDate);
  const [completed, setCompleted] = useState(TASK_MOCK.completed);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      addToast({ title: 'Task Updated', description: 'Your changes have been saved.', type: 'success' });
      setSaving(false);
    }, 1200);
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-lg mx-auto">
        <h2 className="font-display text-2xl mb-6 text-lavender-700">Edit Task</h2>
        <form className="space-y-6" onSubmit={handleSave}>
          <Input label="Title" value={title} required onChange={e => setTitle(e.target.value)} />
          <Input label="Due Date" type="date" value={dueDate} required onChange={e => setDueDate(e.target.value)} />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="completed" checked={completed} onChange={e => setCompleted(e.target.checked)} />
            <label htmlFor="completed" className="text-lavender-700 font-semibold">Completed</label>
          </div>
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
