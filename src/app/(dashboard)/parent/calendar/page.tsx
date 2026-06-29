'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, CheckCircle } from 'lucide-react';
import { events } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const eventTypeColors: Record<string, string> = {
  cultural: 'bg-purple-100 text-purple-700 border-purple-200',
  academic: 'bg-blue-100 text-blue-700 border-blue-200',
  meeting: 'bg-amber-100 text-amber-700 border-amber-200',
  sports: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  workshop: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function ParentCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [rsvpdEvents, setRsvpdEvents] = useState<Set<string>>(new Set());

  const parentEvents = events.filter((e) =>
    e.targetAudience.includes('parent') || e.targetAudience.includes('student')
  );

  const monthEvents = parentEvents.filter((e) => {
    const d = new Date(e.startDate);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const eventMap = useMemo(() => {
    const map: Record<string, typeof parentEvents> = {};
    parentEvents.forEach((e) => {
      const dateStr = e.startDate;
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(e);
    });
    return map;
  }, [parentEvents]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days: { day: number; date: string; events: typeof parentEvents }[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: 0, date: '', events: [] });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, date: dateStr, events: eventMap[dateStr] || [] });
    }
    return days;
  }, [currentMonth, currentYear, eventMap]);

  const toggleRsvp = (eventId: string) => {
    setRsvpdEvents((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Event Calendar</h1>
        <p className="text-muted-foreground">View school events and manage RSVPs</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (currentMonth === 0) {
                      setCurrentMonth(11);
                      setCurrentYear(currentYear - 1);
                    } else {
                      setCurrentMonth(currentMonth - 1);
                    }
                  }}
                  className="rounded-md bg-muted px-3 py-1 text-sm hover:bg-muted/80"
                >
                  &lt;
                </button>
                <span className="min-w-[140px] text-center text-sm font-medium">
                  {MONTHS[currentMonth]} {currentYear}
                </span>
                <button
                  onClick={() => {
                    if (currentMonth === 11) {
                      setCurrentMonth(0);
                      setCurrentYear(currentYear + 1);
                    } else {
                      setCurrentMonth(currentMonth + 1);
                    }
                  }}
                  className="rounded-md bg-muted px-3 py-1 text-sm hover:bg-muted/80"
                >
                  &gt;
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((day) => (
                <div key={day} className="py-2 text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              {calendarDays.map((item, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'min-h-[60px] rounded-md border p-1 text-xs',
                    item.day === 0
                      ? 'border-transparent'
                      : item.events.length > 0
                      ? 'border-primary/20 bg-primary/5'
                      : 'border-muted'
                  )}
                >
                  {item.day > 0 && (
                    <>
                      <span className="font-medium">{item.day}</span>
                      {item.events.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={cn('mt-0.5 truncate rounded px-1 py-0.5 text-[10px] font-medium', eventTypeColors[event.type])}
                        >
                          {event.title}
                        </div>
                      ))}
                      {item.events.length > 2 && (
                        <div className="text-[10px] text-muted-foreground">
                          +{item.events.length - 2} more
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {monthEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No events this month.</p>
                </div>
              ) : (
                monthEvents.map((event) => (
                  <div key={event.id} className="rounded-lg border p-3">
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="text-sm font-medium">{event.title}</h3>
                      <Badge variant="outline" className={cn('text-[10px]', eventTypeColors[event.type])}>
                        {event.type}
                      </Badge>
                    </div>
                    <p className="mb-2 text-xs text-muted-foreground">{event.description}</p>
                    <div className="mb-2 space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.startTime} - {event.endTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.currentParticipants}/{event.maxParticipants} participants
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={rsvpdEvents.has(event.id) ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => toggleRsvp(event.id)}
                    >
                      {rsvpdEvents.has(event.id) ? (
                        <>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Acknowledged
                        </>
                      ) : (
                        'Acknowledge'
                      )}
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Event Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(eventTypeColors).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-2">
                    <span className={cn('h-3 w-3 rounded-full', color.split(' ')[0])} />
                    <span className="text-xs capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
