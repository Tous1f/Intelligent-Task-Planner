import { type DraggableProvided, type DroppableProvided, type DraggableStateSnapshot } from '@hello-pangea/dnd';

export type {
  DraggableProvided,
  DroppableProvided,
  DraggableStateSnapshot,
};

export interface DragDropItem<T = any> {
  id: string;
  type: 'task' | 'event' | 'flashcard';
  data: T;
}

export interface DragResult {
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  } | null;
  draggableId: string;
}
