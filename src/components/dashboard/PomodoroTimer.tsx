'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/exports';
import { studyService } from '@/lib/services/study-service';
import { useToast } from '@/hooks/use-toast';

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? 25 * 60 : 5 * 60);
      setIsActive(false);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeLeft, isBreak]);

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const toggleTimer = async () => {
    const newIsActive = !isActive;
    setIsActive(newIsActive);
    
    if (newIsActive) {
      try {
        const session = await studyService.startSession();
        setCurrentSessionId(session.id);
        toast({
          title: "Study Session Started",
          description: "Focus mode activated. Good luck!",
        });
      } catch (error) {
        console.error('Failed to start study session:', error);
        toast({
          title: "Error",
          description: "Failed to start study session",
          variant: "destructive",
        });
      }
    } else if (currentSessionId) {
      try {
        await studyService.endSession(currentSessionId, Math.floor((25 * 60 - timeLeft) / 60));
        setCurrentSessionId(null);
        toast({
          title: "Study Session Ended",
          description: `You studied for ${Math.floor((25 * 60 - timeLeft) / 60)} minutes`,
        });
      } catch (error) {
        console.error('Failed to end study session:', error);
        toast({
          title: "Error",
          description: "Failed to end study session",
          variant: "destructive",
        });
      }
    }
  };

  const resetTimer = () => {
    if (isActive) {
      // End session when timer is reset while active
      try {
        fetch('/api/study/session/end', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ duration: 25 * 60 - timeLeft })
        });
      } catch (error) {
        console.error('Failed to end study session:', error);
      }
    }
    setIsActive(false);
    setTimeLeft(25 * 60);
    setIsBreak(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-heading font-semibold mb-6 bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
        Pomodoro Timer
      </h3>
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-48 h-48 rounded-full bg-accent-50/30 dark:bg-accent-950/30 backdrop-blur-sm border-4 border-accent-200/50 dark:border-accent-800/50">
            <div className="text-5xl font-bold bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
        <div className="space-x-3">
          <button
            onClick={toggleTimer}
            className={`
              px-6 py-2.5 rounded-md font-medium transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${
                isActive
                  ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground focus:ring-destructive/50'
                  : 'bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary/50'
              }
            `}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="px-6 py-2.5 rounded-md font-medium bg-accent-600 hover:bg-accent-700 text-white 
                     transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2"
          >
            Reset
          </button>
        </div>
        <div className="mt-6">
          <span className={`
            inline-block px-4 py-2 rounded-full text-sm font-medium
            ${isBreak 
              ? 'bg-secondary-50 text-secondary-700 dark:bg-secondary-950 dark:text-secondary-300' 
              : 'bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300'}
          `}>
            {isBreak ? 'Break Time' : 'Focus Time'}
          </span>
        </div>
      </div>
    </Card>
  );
}
