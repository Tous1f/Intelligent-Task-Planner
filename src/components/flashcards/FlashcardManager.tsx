'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Flashcard, FlashcardDeck, SAMPLE_DECKS, SAMPLE_CARDS } from '@/types/flashcard';
import { Upload, Download, Plus, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

const FlashcardView: React.FC<{ card: Flashcard }> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [grade, setGrade] = useState<1|2|3|4|5>(3);

  const updateCardProgress = (selectedGrade: number) => {
    // Calculate new ease factor and interval based on SM-2 algorithm
    const newEaseFactor = Math.max(1.3, card.easeFactor + (0.1 - (5 - selectedGrade) * (0.08 + (5 - selectedGrade) * 0.02)));
    let newInterval = 1;
    
    if (card.correctStreak === 0) {
      newInterval = 1;
    } else if (card.correctStreak === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(card.interval * card.easeFactor);
    }

    // Update card status
    let newStatus: 'NEW' | 'LEARNING' | 'REVIEW' | 'MASTERED';
    if (selectedGrade >= 4) {
      newStatus = card.correctStreak >= 3 ? 'MASTERED' : 'REVIEW';
    } else if (selectedGrade >= 3) {
      newStatus = 'LEARNING';
    } else {
      newStatus = 'NEW';
    }

    // Call the API to update the card
    // TODO: Implement API call
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-64 cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className={`absolute w-full h-full backface-hidden p-6 rounded-xl shadow-lg
            ${isFlipped ? 'hidden' : 'bg-white dark:bg-gray-800'}`}
        >
          <div className="h-full flex flex-col justify-between">
            <div className="text-lg font-medium">{card.front}</div>
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Status: {card.status}</span>
              <span>Click to flip</span>
            </div>
          </div>
        </div>
        <div
          className={`absolute w-full h-full backface-hidden p-6 rounded-xl shadow-lg bg-purple-100 dark:bg-purple-900
            ${!isFlipped ? 'hidden' : ''}`}
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-lg">{card.back}</div>
              {card.hints && (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Hint:</strong> {card.hints}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Rate your understanding (1-5):
              </div>
              <div className="flex gap-1 justify-center">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={(e) => {
                      e.stopPropagation();
                      setGrade(rating as 1|2|3|4|5);
                      updateCardProgress(rating);
                    }}
                    className={`w-8 h-8 rounded-full ${
                      grade === rating
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <div className="text-xs text-center text-gray-500">
                1: Complete blackout | 2: Incorrect but familiar | 3: Correct with effort
                4: Correct with hesitation | 5: Perfect recall
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const FlashcardStudySession: React.FC<{
  deck: FlashcardDeck;
  onClose: () => void;
}> = ({ deck, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studyHistory, setStudyHistory] = useState<{ cardId: string; confidence: number }[]>([]);

  const handleNext = () => {
    if (currentIndex < deck.cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full text-center mb-4">
        <h3 className="text-xl font-semibold">{deck.name}</h3>
        <p className="text-sm text-gray-500">
          Card {currentIndex + 1} of {deck.cards.length}
        </p>
      </div>

      <FlashcardView card={deck.cards[currentIndex]} />

      <div className="flex gap-4 mt-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === deck.cards.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <Button
        variant="ghost"
        onClick={onClose}
        className="mt-4"
      >
        End Session
      </Button>
    </div>
  );
};

export const FlashcardManager: React.FC = () => {
  const { toast } = useToast();
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);

  useEffect(() => {
    // Load decks from localStorage
    const savedDecks = localStorage.getItem('flashcard-decks');
    if (savedDecks) {
      setDecks(JSON.parse(savedDecks));
    } else {
      // Set default decks if no saved decks found
      const defaultDecks = [
        SAMPLE_DECKS['software-engineering'],
        SAMPLE_DECKS['data-structures']
      ];
      setDecks(defaultDecks);
      localStorage.setItem('flashcard-decks', JSON.stringify(defaultDecks));
    }
  }, []);
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedDeck: FlashcardDeck = JSON.parse(text);
      setDecks([...decks, importedDeck]);
      toast({
        title: 'Success',
        description: 'Flashcard deck imported successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to import flashcard deck',
        variant: 'destructive',
      });
    }
  };

  const handleExport = (deck: FlashcardDeck) => {
    const dataStr = JSON.stringify(deck, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${deck.name.toLowerCase().replace(/\s+/g, '-')}-flashcards.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="container mx-auto py-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".json"
        className="hidden"
        aria-label="Import flashcard deck"
        title="Import flashcard deck"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {decks.map((deck) => (
          <Card key={deck.id} className="p-4">
            <CardContent className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">{deck.name}</h3>
              <p className="text-sm text-gray-500">
                {deck.cards.length} cards • Last modified:{' '}
                {new Date(deck.lastModified).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedDeck(deck)}
                >
                  Study
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport(deck)}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="p-4 flex items-center justify-center">
          <Button
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col gap-2 h-auto py-8"
          >
            <Upload className="w-8 h-8" />
            <span>Import Deck</span>
          </Button>
        </Card>
      </div>

      <Dialog open={!!selectedDeck} onOpenChange={() => setSelectedDeck(null)}>
        <DialogContent className="max-w-4xl">
          {selectedDeck && (
            <FlashcardStudySession
              deck={selectedDeck}
              onClose={() => setSelectedDeck(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
