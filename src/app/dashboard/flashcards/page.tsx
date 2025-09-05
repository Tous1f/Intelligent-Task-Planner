import React from 'react';
import { FlashcardManager } from '@/components/flashcards/FlashcardManager';

export default function FlashcardsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Flashcards</h1>
      <FlashcardManager />
    </div>
  );
}
