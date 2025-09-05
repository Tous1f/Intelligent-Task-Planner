'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { format, addDays, isWithinInterval, startOfToday, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, RotateCw, Lightbulb, List, Grid } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Calendar from '@/components/ui/calendar';
import Alert, { AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

interface Task {
  id: string;
  title: string;
  description?: string;
  date: Date;
  priority: 'high' | 'medium' | 'low';
  source: 'LOCAL' | 'GOOGLE';
  completed: boolean;
  location?: string;
  duration?: number;
}

interface AIInsight {
  type: 'scheduling' | 'pattern' | 'suggestion';
  title: string;
  description: string;
  confidence?: number;
  data?: any;
}

interface ViewMode {
  type: 'month' | 'week' | 'agenda';
  label: string;
  icon: React.ReactNode;
}

const VIEW_MODES: ViewMode[] = [
  { type: 'month', label: 'Month', icon: <Grid className="w-4 h-4" /> },
  { type: 'week', label: 'Week', icon: <List className="w-4 h-4" /> },
  { type: 'agenda', label: 'Agenda', icon: <List className="w-4 h-4" /> },
];

const taskVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const TaskItem: React.FC<{ task: Task; isDragging?: boolean }> = ({ task, isDragging }) => (
  <motion.div
    className={cn(
      'p-3 rounded-lg mb-2 cursor-pointer',
      isDragging ? 'bg-purple-100 dark:bg-purple-900' : 'bg-white dark:bg-gray-800',
      'border border-gray-200 dark:border-gray-700'
    )}
    variants={taskVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div
          className={cn(
            'w-2 h-2 rounded-full',
            task.priority === 'high' ? 'bg-red-500' :
            task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
          )}
        />
        <span className="font-medium">{task.title}</span>
      </div>
      <Badge variant={task.source === 'GOOGLE' ? 'secondary' : 'default'}>
        {task.source}
      </Badge>
    </div>
    {task.description && (
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {task.description}
      </p>
    )}
    {task.location && (
      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
        📍 {task.location}
      </p>
    )}
  </motion.div>
);

const WeekView: React.FC<{ tasks: Task[]; currentDate: Date; onTaskMove: (taskId: string, date: Date) => void }> = ({ 
  tasks, 
  currentDate,
  onTaskMove 
}) => {
  const weekStart = startOfWeek(currentDate);
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(currentDate),
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newDate = new Date(result.destination.droppableId);
    onTaskMove(taskId, newDate);
  };

  return (
    <div className="grid grid-cols-7 gap-4">
      {weekDays.map((day) => (
        <div
          key={day.toISOString()}
          className={cn(
            'p-4 rounded-lg',
            isSameDay(day, new Date()) ? 'bg-purple-100 dark:bg-purple-900' : 'bg-white dark:bg-gray-800'
          )}
        >
          <div className="text-center mb-4">
            <div className="text-sm text-gray-500">{format(day, 'EEE')}</div>
            <div className="text-lg font-semibold">{format(day, 'd')}</div>
          </div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId={day.toISOString()}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2"
                >
                  <AnimatePresence>
                    {tasks
                      .filter((task) => isSameDay(task.date, day))
                      .map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskItem
                                task={task}
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                  </AnimatePresence>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      ))}
    </div>
  );
};

interface MonthViewProps {
  tasks: Task[];
  currentDate: Date;
  onTaskMove: (taskId: string, date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ tasks, currentDate, onTaskMove }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Calendar</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Today
            </Button>
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="range"
          selected={{
            from: startOfToday(),
            to: addDays(startOfToday(), 6)
          }}
        />
      </CardContent>
    </Card>
  );
};

interface AgendaViewProps {
  tasks: Task[];
  currentDate: Date;
}

const AgendaView: React.FC<AgendaViewProps> = ({ tasks, currentDate }) => {
  const sortedTasks = [...tasks].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          {sortedTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tasks scheduled</p>
            </div>
          ) : (
            sortedTasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-4">
                <div className="flex-none">
                  <div className="text-sm font-medium">
                    {format(task.date, 'MMM d')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(task.date, 'h:mm a')}
                  </div>
                </div>
                <TaskItem task={task} />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface EnhancedCalendarViewProps {
  tasks: Task[];
  onTaskMove?: (taskId: string, newDate: Date) => void;
  onTaskCreate?: (task: Omit<Task, 'id'>) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
}

export default function EnhancedCalendarView({
  tasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete
}: EnhancedCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode['type']>('month');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTaskMove = (taskId: string, newDate: Date) => {
    if (onTaskMove) {
      onTaskMove(taskId, newDate);
      toast({
        title: 'Task moved',
        description: `Task has been rescheduled to ${format(newDate, 'MMM d')}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {VIEW_MODES.map((mode) => (
            <Button
              key={mode.type}
              variant={viewMode === mode.type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode(mode.type)}
              className="flex items-center space-x-1"
            >
              {mode.icon}
              <span>{mode.label}</span>
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setLoading(true)}
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner className="w-4 h-4" />
          ) : (
            <RotateCw className="w-4 h-4" />
          )}
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      {/* Calendar Views */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'month' && (
            <MonthView
              tasks={tasks}
              currentDate={currentDate}
              onTaskMove={handleTaskMove}
            />
          )}
          {viewMode === 'week' && (
            <WeekView
              tasks={tasks}
              currentDate={currentDate}
              onTaskMove={handleTaskMove}
            />
          )}
          {viewMode === 'agenda' && (
            <AgendaView
              tasks={tasks}
              currentDate={currentDate}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
