declare module '@hello-pangea/dnd' {
  import * as React from 'react';

  export type DraggableId = string;
  export type DroppableId = string;
  export type DragStart = DragUpdate;
  
  export interface DraggableLocation {
    droppableId: DroppableId;
    index: number;
  }

  export interface DragUpdate {
    draggableId: DraggableId;
    type: string;
    source: DraggableLocation;
    destination?: DraggableLocation | null;
  }

  export interface DroppableProvided {
    innerRef: (element: HTMLElement | null) => void;
    placeholder?: React.ReactNode;
    droppableProps: {
      'data-rbd-droppable-id': string;
      'data-rbd-droppable-context-id': string;
    };
  }

  export interface DraggableProvided {
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: {
      'data-rbd-draggable-context-id': string;
      'data-rbd-draggable-id': string;
    };
    dragHandleProps?: {
      'data-rbd-drag-handle-draggable-id': string;
      'data-rbd-drag-handle-context-id': string;
      'aria-describedby': string;
      role: string;
      tabIndex: number;
      draggable: boolean;
      onDragStart: (event: React.DragEvent<HTMLElement>) => void;
    } | null;
  }

  export interface DraggableStateSnapshot {
    isDragging: boolean;
    isDropAnimating: boolean;
    draggingOver: DroppableId | null;
    dropAnimation: {
      curve: string;
      duration: number;
    } | null;
  }

  export interface DroppableStateSnapshot {
    isDraggingOver: boolean;
    draggingOverWith: DraggableId | null;
    draggingFromThisWith: DraggableId | null;
    isUsingPlaceholder: boolean;
  }

  export interface DroppableProps {
    droppableId: DroppableId;
    type?: string;
    mode?: 'standard' | 'virtual';
    isDropDisabled?: boolean;
    isCombineEnabled?: boolean;
    direction?: 'vertical' | 'horizontal';
    ignoreContainerClipping?: boolean;
    renderClone?: any;
    getContainerForClone?: any;
    children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactElement;
  }

  export interface DraggableProps {
    draggableId: DraggableId;
    index: number;
    isDragDisabled?: boolean;
    disableInteractiveElementBlocking?: boolean;
    shouldRespectForcePress?: boolean;
    children: (
      provided: DraggableProvided,
      snapshot: DraggableStateSnapshot,
      rubric: any
    ) => React.ReactElement;
  }

  export interface DragDropContextProps {
    onBeforeDragStart?: (initial: DragStart) => void;
    onDragStart?: (initial: DragStart, provided: any) => void;
    onDragUpdate?: (initial: DragUpdate, provided: any) => void;
    onDragEnd: (result: DropResult, provided: any) => void;
    children?: React.ReactNode;
    liftInstruction?: string;
    nonce?: string;
    sensors?: any[];
  }

  export interface DropResult extends DragUpdate {
    reason: 'DROP' | 'CANCEL';
  }

  export class Droppable extends React.Component<DroppableProps> {}
  export class Draggable extends React.Component<DraggableProps> {}
  export class DragDropContext extends React.Component<DragDropContextProps> {}
}
