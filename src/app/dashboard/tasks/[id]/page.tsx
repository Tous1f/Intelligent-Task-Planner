'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';

export default function TaskDetailPage() {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get task id from URL
  const id = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/tasks/${id}`);
        if (!response.ok) throw new Error('Failed to fetch task');
        const data = await response.json();
        setTitle(data.tasks?.[0]?.title || '');
        setDueDate(data.tasks?.[0]?.dueDate ? data.tasks[0].dueDate.slice(0, 10) : '');
        setCompleted(data.tasks?.[0]?.status === 'COMPLETED');
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTask();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, dueDate, status: completed ? 'COMPLETED' : 'TODO' })
      });
      if (!response.ok) throw new Error('Failed to update task');
      toast({ 
        title: 'Task Updated', 
        description: 'Your changes have been saved successfully.',
        variant: 'success'
      });
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      toast({
        title: 'Error',
        description: err.message || 'Failed to update task',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner className="text-accent-600 w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center flex-col">
        <div className="text-destructive text-lg mb-4">Something went wrong!</div>
        <div className="text-muted-foreground">{error}</div>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-3 bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
          Edit Task
        </h1>
        <p className="text-muted-foreground dark:text-slate-400">
          Update task details and track progress
        </p>
      </div>

      <Card className="backdrop-blur-sm border border-border/50 dark:border-white/10">
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground dark:text-slate-200">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={saving}
                placeholder="Enter task title"
                className="transition-colors duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground dark:text-slate-200">
                Due Date
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                disabled={saving}
                className="transition-colors duration-200"
              />
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-accent-50/30 dark:bg-accent-950/30 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="completed"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                disabled={saving}
                className="h-4 w-4 rounded border-border/50 dark:border-white/10 text-accent-600 dark:text-accent-400 focus:ring-accent-500 dark:focus:ring-accent-400 transition-colors duration-200"
              />
              <label 
                htmlFor="completed"
                className="text-sm font-medium text-foreground dark:text-slate-200"
              >
                Mark as completed
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border/50 dark:border-white/10">
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => window.history.back()}
              className="transition-colors duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={saving}
              className="shadow-lg shadow-accent-600/20 dark:shadow-accent-500/20 transition-all duration-200"
            >
              {saving ? (
                <>
                  <LoadingSpinner className="w-4 h-4 mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
