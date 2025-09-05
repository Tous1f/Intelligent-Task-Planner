'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Task } from '@/types/task';
import { useToast } from '@/hooks/use-toast';
import { taskService } from '@/lib/services/task-service';

interface Props {
  onTaskCreated: (task: Task) => void;
}

export default function QuickTaskCreator({ onTaskCreated }: Props) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [duration, setDuration] = useState(30);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a task title'
      });
      return;
    }

    try {
  const task = await taskService.createTask({
        title,
        description: '',
  dueDate: dueDate ? new Date(dueDate) : null,
        priority: 'LOW',
        status: 'TODO',
        tags: '',
        estimatedDuration: duration
  } as any);

      onTaskCreated(task);
      
      setTitle('');
      setSubject('');
      setDueDate('');
      setDuration(30);

      toast({
        title: 'Success',
        description: 'Task created successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create task'
      });
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div>
          <Input
            type="number"
            placeholder="Estimated duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
          />
        </div>
        <Button type="submit">Create Task</Button>
      </form>
    </Card>
  );
}
