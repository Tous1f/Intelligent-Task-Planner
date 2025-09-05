'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types/task';
import { taskService } from '@/lib/services/task-service';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';

export default function ImportTasksPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/tasks/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Import failed');
      }

      const { tasks } = await response.json();
      
      for (const task of tasks) {
        await taskService.createTask(task);
      }

      toast({ 
        title: 'Import Complete', 
        description: `Successfully imported ${tasks.length} tasks.`, 
        variant: 'default' 
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({ 
        title: 'Import Failed', 
        description: 'Failed to import tasks. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md mx-auto text-center p-6">
        <h2 className="font-display text-2xl mb-6 text-lavender-700">Bulk Import Tasks</h2>
        <p className="mb-4 text-lavender-600">Quickly add many tasks at once by importing a CSV or PDF syllabus.</p>
        
        <input
          type="file"
          accept=".csv,.pdf"
          onChange={handleFileSelect}
          ref={fileInputRef}
          className="hidden"
          aria-label="Import tasks from file"
          title="Import tasks from file"
        />
        
        <Button 
          className="w-full mb-3" 
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          {loading ? (
            <>
              <LoadingSpinner className="mr-2" />
              Importing...
            </>
          ) : (
            'Import File (CSV/PDF)'
          )}
        </Button>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>Supported formats:</p>
          <ul className="list-disc list-inside mt-2">
            <li>CSV with columns: title, description, dueDate, priority, subject</li>
            <li>PDF syllabus (we&apos;ll extract assignment dates and details)</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
