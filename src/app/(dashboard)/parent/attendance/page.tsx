'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { students, attendanceRecords, subjects } from '@/lib/mock-data';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ParentAttendancePage() {
  const { user } = useAuthStore()
  const parentChildren = students.filter(
    (s) => s.parentId === user?.id
  );
  const [selectedChildId, setSelectedChildId] = useState(parentChildren[0]?.id || '');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const selectedChild = students.find((s) => s.id === selectedChildId);
  const childAttendance = attendanceRecords.filter((a) => a.studentId === selectedChildId);

  const monthAttendance = childAttendance.filter((a) => {
    const d = new Date(a.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalDays = monthAttendance.length;
  const presentDays = monthAttendance.filter((a) => a.status === 'present').length;
  const lateDays = monthAttendance.filter((a) => a.status === 'late').length;
  const absentDays = monthAttendance.filter((a) => a.status === 'absent').length;
  const excusedDays = monthAttendance.filter((a) => a.status === 'excused').length;
  const attendanceRate = totalDays > 0 ? Math.round(((presentDays + lateDays) / totalDays) * 100) : 0;

  const attendanceMap = useMemo(() => {
    const map: Record<string, string> = {};
    childAttendance.forEach((a) => {
      map[a.date] = a.status;
    });
    return map;
  }, [childAttendance]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days: { day: number; date: string; status?: string }[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: 0, date: '' });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, date: dateStr, status: attendanceMap[dateStr] });
    }
    return days;
  }, [currentMonth, currentYear, attendanceMap]);

  const subjectAttendance = useMemo(() => {
    const subjectMap: Record<string, { total: number; present: number }> = {};
    childAttendance.forEach((a) => {
      if (!subjectMap[a.classId]) {
        subjectMap[a.classId] = { total: 0, present: 0 };
      }
      subjectMap[a.classId].total++;
      if (a.status === 'present' || a.status === 'late') {
        subjectMap[a.classId].present++;
      }
    });
    return Object.entries(subjectMap).map(([classId, data]) => ({
      classId,
      total: data.total,
      present: data.present,
      rate: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
    }));
  }, [childAttendance]);

  const trendData = useMemo(() => {
    const months: { month: string; rate: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const m = new Date();
      m.setMonth(m.getMonth() - i);
      const mIdx = m.getMonth();
      const y = m.getFullYear();
      const monthData = childAttendance.filter((a) => {
        const d = new Date(a.date);
        return d.getMonth() === mIdx && d.getFullYear() === y;
      });
      const t = monthData.length;
      const p = monthData.filter((a) => a.status === 'present' || a.status === 'late').length;
      months.push({
        month: MONTHS[mIdx].slice(0, 3),
        rate: t > 0 ? Math.round((p / t) * 100) : 0,
      });
    }
    return months;
  }, [childAttendance]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'present':
        return 'bg-emerald-100 text-emerald-700';
      case 'late':
        return 'bg-amber-100 text-amber-700';
      case 'absent':
        return 'bg-red-100 text-red-700';
      case 'excused':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance Tracking</h1>
          <p className="text-muted-foreground">Monitor your child&apos;s attendance</p>
        </div>
        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select child" />
          </SelectTrigger>
          <SelectContent>
            {parentChildren.map((child) => (
              <SelectItem key={child.id} value={child.id}>
                {child.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">{MONTHS[currentMonth]} {currentYear}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{presentDays}</div>
            <p className="text-xs text-muted-foreground">days this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lateDays}</div>
            <p className="text-xs text-muted-foreground">days this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{absentDays}</div>
            <p className="text-xs text-muted-foreground">days this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Monthly Calendar</CardTitle>
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
                <span className="text-sm font-medium">
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
            <div className="grid grid-cols-7 gap-1 text-center">
              {DAYS.map((day) => (
                <div key={day} className="py-1 text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              {calendarDays.map((item, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex h-9 items-center justify-center rounded-md text-xs',
                    item.day === 0
                      ? ''
                      : item.status
                      ? getStatusColor(item.status)
                      : 'bg-muted/30 text-muted-foreground'
                  )}
                >
                  {item.day > 0 ? item.day : ''}
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded bg-emerald-200" /> Present
              </span>
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded bg-amber-200" /> Late
              </span>
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded bg-red-200" /> Absent
              </span>
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded bg-blue-200" /> Excused
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Trend (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis domain={[0, 100]} className="text-xs" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    name="Attendance %"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          {subjectAttendance.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="mb-2 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No attendance data available.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {subjectAttendance.map((sa) => (
                <div key={sa.classId} className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Class: {sa.classId.replace('cls-', '').replace('-', ' ')}</p>
                    <p className="text-xs text-muted-foreground">
                      {sa.present} of {sa.total} days present
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-emerald-500 transition-all"
                        style={{ width: `${sa.rate}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-sm font-semibold">{sa.rate}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
