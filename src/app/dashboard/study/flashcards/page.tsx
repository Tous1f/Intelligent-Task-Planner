'use client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function FlashcardsPage() {
  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="font-display text-2xl text-lavender-700 mb-6">Flashcards</h1>
      <Card>
        <p className="mb-4 text-lavender-600">
          Review and create new flashcard decks to enhance your learning.
        </p>
        <Button onClick={() => alert('Create New Deck')}>New Flashcard Deck</Button>
      </Card>
    </div>
  );
}
