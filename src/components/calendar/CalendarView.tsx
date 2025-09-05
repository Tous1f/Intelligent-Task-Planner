"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  LoadingSpinner,
  Alert,
  AlertTitle,
  AlertDescription
} from '@/components/ui/exports';
import { Calendar as CalendarIcon, Clock, MapPin, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CalendarEvent } from '@/lib/calendar/calendar-service';

interface EventCardProps {
  event: CalendarEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formatDateTime = (dateTime: Date, isAllDay?: boolean) => {
    if (isAllDay) {
      return dateTime.toLocaleDateString([], {
        dateStyle: 'medium',
      });
    }
    return dateTime.toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <Card className="mb-4 bg-gray-800 border-gray-700 shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-purple-400 text-lg font-bold">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-gray-300 space-y-3">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-400" />
          <span>
            {event.isAllDay 
              ? formatDateTime(event.startTime, true)
              : `${formatDateTime(event.startTime)} - ${formatDateTime(event.endTime)}`
            }
          </span>
        </div>
        {event.location && (
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-gray-400" />
            <span>{event.location}</span>
          </div>
        )}
        {event.source === 'GOOGLE' && event.googleEventId && (
          <div className="flex items-center space-x-2">
            <Video className="h-5 w-5 text-gray-400" />
            <a 
              href={`https://calendar.google.com/calendar/event?eid=${event.googleEventId}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 hover:underline"
            >
              Open in Google Calendar
            </a>
          </div>
        )}
        {event.description && (
           <div className="flex items-center space-x-2 pt-2">
             <CalendarIcon className="h-5 w-5 text-gray-500" />
             <span className="text-sm text-gray-500">{event.description}</span>
           </div>
        )}
      </CardContent>
    </Card>
  );
};

const CalendarView: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const { toast } = useToast();

  const fetchEvents = async () => {
    if (!session?.user) {
      setIsLoading(false);
      setError('Please sign in to view your calendar');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/calendar/events');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch calendar events');
      }
      const data = await res.json();
      setEvents(data.events || []);
      toast({
        title: 'Calendar Updated',
        description: 'Your calendar has been synced successfully',
      });
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      toast({
        title: 'Error',
        description: 'Failed to fetch calendar events',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/calendar/sync', { method: 'POST' });
      if (!res.ok) {
        throw new Error('Failed to sync with Google Calendar');
      }
      await fetchEvents();
      toast({
        title: 'Success',
        description: 'Calendar synced with Google Calendar',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sync with Google Calendar',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
        <p className="ml-4 text-lg text-gray-300">Loading your schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="bg-red-900/20 border-red-500 text-red-300">
        <AlertTitle>Connection Error</AlertTitle>
        <AlertDescription>
          {error} Please try reconnecting your calendar.
        </AlertDescription>
        {!session?.user && (
          <Button 
            variant="ghost" 
            className="mt-4"
            onClick={() => window.location.href = '/api/auth/signin/google'}
          >
            Sign in with Google
          </Button>
        )}
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Your Calendar</h2>
        <Button 
          onClick={handleSync} 
          disabled={isLoading || !session?.user}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isLoading ? <LoadingSpinner className="w-4 h-4" /> : 'Sync Calendar'}
        </Button>
      </div>

      {events.length === 0 ? (
        <Card className="text-center p-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>All Clear!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">You have no upcoming events in the next 30 days.</p>
            <p className="text-gray-500 text-sm mt-2">Enjoy your free time or plan something new!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarView;
