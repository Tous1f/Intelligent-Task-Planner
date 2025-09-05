export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hints?: string;
  tags: string[];
  deckId: string;
  profileId: string;
  lastReviewed?: Date;
  nextReview?: Date;
  confidence?: number; // 1-5 scale
  timesReviewed: number;
  correctStreak: number;
  easeFactor: number;
  interval: number;
  status: 'NEW' | 'LEARNING' | 'REVIEWING' | 'MASTERED';
  mediaUrl?: string;
  created: Date;
  updatedAt: Date;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description?: string;
  course?: string;
  subject?: string;
  userId: string;
  cards: Flashcard[];
  totalCards: number;
  mastered: number;
  learning: number;
  needsReview: number;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  reviewInterval: number;
  created: Date;
  lastModified: Date;
  isPublic: boolean;
  isArchived: boolean;
}

// Study session stats for flashcards
export interface FlashcardStudyStats {
  totalReviewed: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageConfidence: number;
  timeSpent: number;
  masteredCards: number;
  needsMoreReview: number;
  lastStudyDate?: Date;
  nextReviewDate?: Date;
}

// Sample decks and cards for demonstration
export const SAMPLE_DECKS: Record<string, FlashcardDeck> = {
  'software-engineering': {
    id: 'se-deck',
    name: 'Software Engineering Fundamentals',
    description: 'Core concepts in software engineering',
    subject: 'Software Engineering',
    userId: 'system',
    cards: [],
    totalCards: 5,
    mastered: 0,
    learning: 0,
    needsReview: 5,
    reviewInterval: 1,
    created: new Date(),
    lastModified: new Date(),
    isPublic: true,
    isArchived: false
  },
  'data-structures': {
    id: 'dsa-deck',
    name: 'Data Structures and Algorithms',
    description: 'Essential DSA concepts',
    subject: 'Computer Science',
    userId: 'system',
    cards: [],
    totalCards: 5,
    mastered: 0,
    learning: 0,
    needsReview: 5,
    reviewInterval: 1,
    created: new Date(),
    lastModified: new Date(),
    isPublic: true,
    isArchived: false
  }
};

export const SAMPLE_CARDS: Record<string, Flashcard[]> = {
  'software-engineering': [
    {
      id: 'se-1',
      front: 'What is Software Engineering?',
      back: 'Software Engineering is the systematic application of engineering approaches to software development.',
      hints: 'Think about systematic processes and engineering principles',
      tags: ['fundamentals'],
      deckId: 'se-deck',
      profileId: 'system',
      timesReviewed: 0,
      correctStreak: 0,
      easeFactor: 2.5,
      interval: 1,
      status: 'NEW',
      created: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'se-2',
      front: 'Explain SOLID Principles',
      back: 'SOLID is an acronym for:\nS - Single Responsibility\nO - Open/Closed\nL - Liskov Substitution\nI - Interface Segregation\nD - Dependency Inversion',
      hints: 'Remember each letter stands for a principle',
      tags: ['principles', 'design'],
      deckId: 'se-deck',
      profileId: 'system',
      timesReviewed: 0,
      correctStreak: 0,
      easeFactor: 2.5,
      interval: 1,
      status: 'NEW',
      created: new Date(),
      updatedAt: new Date()
    }
  ],
  'data-structures': [
    {
      id: 'dsa-1',
      front: 'What is Big O Notation?',
      back: 'Big O Notation describes the performance or complexity of an algorithm.',
      hints: 'Think about how runtime grows with input size',
      tags: ['complexity', 'fundamentals'],
      deckId: 'dsa-deck',
      profileId: 'system',
      timesReviewed: 0,
      correctStreak: 0,
      easeFactor: 2.5,
      interval: 1,
      status: 'NEW',
      created: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'dsa-2',
      front: 'Explain Binary Search Tree (BST)',
      back: 'A Binary Search Tree is a node-based binary tree where left nodes are smaller and right nodes are larger than the parent.',
      hints: 'Think about the ordering property',
      tags: ['trees', 'data-structures'],
      deckId: 'dsa-deck',
      profileId: 'system',
      timesReviewed: 0,
      correctStreak: 0,
      easeFactor: 2.5,
      interval: 1,
      status: 'NEW',
      created: new Date(),
      updatedAt: new Date()
    }
  ]
};
