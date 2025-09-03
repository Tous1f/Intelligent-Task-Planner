'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useState } from 'react';
import { Zap, Plus, BarChart3 } from 'lucide-react';
import Link from 'next/link';

const MOCK_TODAY_TASKS = [
  { id: '1', title: 'AI project demo slides', due: 'Today, 6:00PM' },
  { id: '2', title: 'Prepare for Data Structures Quiz', due: 'Today, 9:00PM' },
];

export default function DashboardHome() {
  const [tasks] = useState(MOCK_TODAY_TASKS);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="font-display text-3xl mb-5 text-lavender-700">Today’s Overview</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Today's tasks */}
        <Card>
          <div className="flex items-center mb-4">
            <Zap className="w-6 h-6 text-lavender-400 mr-2" />
            <h2 className="font-semibold text-xl text-lavender-700">Today's Tasks</h2>
          </div>
          {tasks.length === 0 ? (
            <p className="text-lavender-400">Nothing scheduled for today 🎉</p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between">
                  <span>{task.title}</span>
                  <span className="text-lavender-400 text-sm">{task.due}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex gap-2">
            <Link href="/dashboard/tasks/new">
              <Button variant="primary" className="w-full">
                <Plus className="inline w-4 h-4 mb-1 mr-1" />
                New Task
              </Button>
            </Link>
            <Link href="/dashboard/tasks">
              <Button variant="secondary" className="w-full">All Tasks</Button>
            </Link>
          </div>
        </Card>

        {/* Quick productivity stats */}
        <Card>
          <div className="flex items-center mb-4">
            <BarChart3 className="w-6 h-6 text-lavender-400 mr-2" />
            <h2 className="font-semibold text-xl text-lavender-700">Quick Stats</h2>
          </div>
          <ul className="space-y-3">
            <li><span className="font-bold text-lavender-600 text-lg">4h 30m</span> focused today</li>
            <li><span className="font-bold text-lavender-600 text-lg">2</span> tasks completed</li>
            <li><span className="font-bold text-lavender-600 text-lg">1</span> upcoming deadline</li>
            <li><span className="font-bold text-lavender-600 text-lg">Pomodoro streak: 3</span></li>
          </ul>
          <div className="mt-4 flex gap-2">
            <Link href="/dashboard/analytics">
              <Button variant="secondary" className="w-full">Analytics</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
