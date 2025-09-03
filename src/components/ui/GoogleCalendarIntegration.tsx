'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, RefreshCw, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  attendees?: Array<{ email: string; displayName?: string }>;
  htmlLink: string;
  status: string;
}

interface CalendarIntegrationProps {
  className?: string;
}

export default function GoogleCalendarIntegration({ className = '' }: CalendarIntegrationProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch('/api/calendar/status');
      const data = await response.json();
      setIsConnected(data.connected);
      if (data.connected) {
        fetchEvents();
      }
    } catch (error) {
      console.error('Error checking calendar status:', error);
    }
  };

  const connectGoogleCalendar = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Redirect to Google OAuth for calendar permissions
      window.location.href = '/api/auth/google-calendar';
    } catch (error) {
      setError('Failed to connect to Google Calendar');
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7); // Next 7 days
      
      const response = await fetch(`/api/calendar/events?start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }
      
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      setError('Failed to load calendar events');
      console.error('Calendar fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatEventTime = (event: CalendarEvent) => {
    const start = event.start.dateTime || event.start.date;
    const end = event.end.dateTime || event.end.date;
    
    if (!start) return '';
    
    const startDate = new Date(start);
    const endDate = new Date(end || start);
    
    if (event.start.date) {
      // All-day event
      return 'All day';
    }
    
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    };
    
    if (startDate.toDateString() === endDate.toDateString()) {
      return `${formatTime(startDate)} - ${formatTime(endDate)}`;
    } else {
      return `${startDate.toLocaleDateString()} ${formatTime(startDate)} - ${endDate.toLocaleDateString()} ${formatTime(endDate)}`;
    }
  };

  const getEventDate = (event: CalendarEvent) => {
    const start = event.start.dateTime || event.start.date;
    if (!start) return '';
    
    const date = new Date(start);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const groupEventsByDate = () => {
    const grouped: { [key: string]: CalendarEvent[] } = {};
    
    events.forEach(event => {
      const dateKey = getEventDate(event);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    
    return grouped;
  };

  if (!isConnected) {
    return (
      <motion.div 
        className={`bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-lavender-200/50 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.div
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-2xl flex items-center justify-center"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Calendar className="w-10 h-10 text-white" />
          </motion.div>
          
          <h3 className="text-2xl font-bold text-lavender-900 mb-4">
            Connect Google Calendar
          </h3>
          
          <p className="text-lavender-600 mb-8 max-w-md mx-auto leading-relaxed">
            Sync your Google Calendar to see upcoming events and better plan your tasks around your schedule.
          </p>
          
          <motion.button
            onClick={connectGoogleCalendar}
            disabled={loading}
            className="bg-gradient-to-r from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 disabled:opacity-60 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5" />
                <span>Connect Calendar</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-lavender-200/50 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-lavender-100 bg-gradient-to-r from-lavender-50 to-lavender-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-lavender-900">
                Google Calendar
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">Connected</span>
              </div>
            </div>
          </div>
          
          <motion.button
            onClick={fetchEvents}
            disabled={loading}
            className="p-3 rounded-xl text-lavender-600 hover:text-lavender-700 hover:bg-lavender-50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={loading ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && events.length === 0 ? (
          <div className="text-center py-12">
            <motion.div
              className="w-12 h-12 border-3 border-lavender-200 border-t-lavender-500 rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-lavender-600">Loading your calendar events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-lavender-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-lavender-700 mb-2">
              No upcoming events
            </h4>
            <p className="text-lavender-500">
              Your calendar is free for the next week!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupEventsByDate()).map(([date, dateEvents]) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-lg font-semibold text-lavender-700 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  {date}
                </h4>
                
                <div className="space-y-3">
                  {dateEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      className="bg-gradient-to-r from-lavender-50 to-white p-4 rounded-2xl border border-lavender-100 hover:border-lavender-200 transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-semibold text-lavender-900 mb-2">
                            {event.summary}
                          </h5>
                          
                          <div className="flex items-center space-x-4 text-sm text-lavender-600 mb-2">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatEventTime(event)}
                            </span>
                            
                            {event.location && (
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {event.location}
                              </span>
                            )}
                          </div>
                          
                          {event.attendees && event.attendees.length > 0 && (
                            <div className="flex items-center text-sm text-lavender-500">
                              <Users className="w-4 h-4 mr-1" />
                              {event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}
                            </div>
                          )}
                          
                          {event.description && (
                            <p className="text-sm text-lavender-600 mt-2 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                        
                        <motion.a
                          href={event.htmlLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-lavender-600 hover:text-lavender-700 hover:bg-lavender-100 transition-all duration-300 ml-4"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </motion.a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}