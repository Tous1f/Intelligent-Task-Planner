'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function WhatIfPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="font-display text-3xl mb-6 text-lavender-700">What-If Scenario Planning</h1>
      <Card>
        <p className="text-lavender-700 mb-4">
          Simulate schedule changes and plan recoveries effectively.
        </p>
        <Button variant="primary" onClick={() => alert('Open What-If Simulator')}>
          Explore What-If Scenarios
        </Button>
      </Card>
    </div>
  );
}
