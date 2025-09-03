'use client';

import { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

const TASKS_MOCK: Task[] = [
  {
    id: '1',
    title: 'Finish AI project documentation',
    dueDate: '2025-09-08',
    completed: false,
  },
  {
    id: '2',
    title: 'Prepare for Midterm Exam',
    dueDate: '2025-09-10',
    completed: true,
  },
];

export default function TasksListPage() {
  const [tasks, setTasks] = useState<Task[]>(TASKS_MOCK);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-semibold text-lavender-700">My Tasks</h1>
        <div className="flex gap-3">
          <Link href="/dashboard/tasks/import">
            <Button variant="secondary">Bulk Import</Button>
          </Link>
          <Link href="/dashboard/tasks/new">
            <Button>
              <Plus className="mr-2 w-5 h-5" />
              Create Task
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 && (
          <div className="text-center text-lavender-500 mt-10">No tasks yet. Create your first task!</div>
        )}
        {tasks.map((task) => (
          <Link href={`/dashboard/tasks/${task.id}`} key={task.id}>
            <Card className="flex items-center justify-between hover:shadow-lg transition cursor-pointer">
              <div>
                <div className={`text-lg font-semibold ${task.completed ? 'line-through text-lavender-400' : 'text-lavender-900'}`}>{task.title}</div>
                <div className="text-sm text-lavender-500 mt-0.5">
                  Due {new Date(task.dueDate).toLocaleDateString()}
                </div>
              </div>
              {task.completed && (
                <span className="bg-sage-200 text-sage-700 px-3 py-1 rounded-full text-xs font-medium">
                  Completed
                </span>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
