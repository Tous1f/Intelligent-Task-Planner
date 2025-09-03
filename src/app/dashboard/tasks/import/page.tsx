'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';

export default function ImportTasksPage() {
  const { addToast } = useToast();

  const handleImport = () => {
    addToast({ title: 'Import Complete', description: 'Tasks imported from CSV/PDF.', type: 'success' });
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md mx-auto text-center">
        <h2 className="font-display text-2xl mb-6 text-lavender-700">Bulk Import Tasks</h2>
        <p className="mb-4 text-lavender-600">Quickly add many tasks at once by importing a CSV or PDF syllabus.</p>
        <Button className="w-full mb-3" onClick={handleImport}>Import CSV</Button>
        <Button className="w-full" variant="secondary" onClick={handleImport}>Import PDF</Button>
      </Card>
    </div>
  );
}
