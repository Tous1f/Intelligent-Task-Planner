import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FlashcardDeck, SAMPLE_DECKS } from '@/types/flashcard';

// GET route to fetch all flashcard decks
export async function GET() {
  try {
  const defaultDecks = Object.values(SAMPLE_DECKS);

    // Fetch user's custom decks from database
    const customDecks = await prisma.flashcardDeck.findMany({
      include: {
        cards: true,
      },
    });

    // Combine built-in and custom decks
    return NextResponse.json([...defaultDecks, ...customDecks]);
  } catch (error) {
    console.error('Error fetching flashcard decks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flashcard decks' },
      { status: 500 }
    );
  }
}

// POST route to create a new flashcard deck
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, course, cards } = body;

    const deck = await prisma.flashcardDeck.create({
      data: {
        name,
        description,
        course,
        userId: body.userId || 'system',
        cards: {
          create: (cards || []).map((card: any) => ({
            front: card.front,
            back: card.back,
            tags: Array.isArray(card.tags) ? card.tags.join(',') : (card.tags || ''),
            profileId: body.profileId || 'system'
          })),
        },
      },
      include: {
        cards: true,
      },
    });

    return NextResponse.json(deck);
  } catch (error) {
    console.error('Error creating flashcard deck:', error);
    return NextResponse.json(
      { error: 'Failed to create flashcard deck' },
      { status: 500 }
    );
  }
}
