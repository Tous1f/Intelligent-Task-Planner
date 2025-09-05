
'use client';
import EnhancedCalendarView from "@/components/calendar/EnhancedCalendarView";
import { Card } from "@/components/ui/card";

export default function CalendarPage() {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Calendar & Tasks</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your schedule, sync with Google Calendar, and get AI-powered insights
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-accent-foreground/10">
          <EnhancedCalendarView tasks={[]} />
        </Card>
      </div>
    </div>
  );
}
