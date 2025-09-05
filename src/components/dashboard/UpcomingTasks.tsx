'use client';

import { Card } from '@/components/ui/exports';
import { Task } from '@/types/task';


interface UpcomingTasksProps {
  tasks: Task[];
  loading?: boolean;
  error?: string | null;
}

export default function UpcomingTasks({ tasks, loading, error }: UpcomingTasksProps) {



  const getPriorityColor = (priority: string | number) => {
    const value = typeof priority === 'string' ? priority.toLowerCase() : String(priority);
    switch (value) {
      case 'high':
      case '1':
        return 'bg-red-100 text-red-800';
      case 'medium':
      case '2':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
      case '3':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Upcoming Tasks</h3>
      {loading ? (
        <div className="text-gray-500">Loading tasks...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : tasks.length === 0 ? (
        <div className="text-gray-500">No upcoming tasks.</div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-600">Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No due date'}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
