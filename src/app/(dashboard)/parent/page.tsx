'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  GraduationCap,
  DollarSign,
  BookOpen,
  Calendar,
  TrendingUp,
  Clock,
  MessageSquare,
  FileText,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { students, fees, grades, attendanceRecords, subjects, exams, events } from '@/lib/mock-data';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

export default function ParentDashboardPage() {
  const { user } = useAuthStore()
  const parentChildren = students.filter(
    (s) => s.parentId === user?.id
  );
  const [selectedChildId, setSelectedChildId] = useState(parentChildren[0]?.id || '');

  const selectedChild = students.find((s) => s.id === selectedChildId);
  const childFees = fees.filter((f) => f.studentId === selectedChildId);
  const childGrades = grades.filter((g) => g.studentId === selectedChildId);
  const childAttendance = attendanceRecords.filter((a) => a.studentId === selectedChildId);

  const totalPaid = childFees.filter((f) => f.status === 'paid').reduce((sum, f) => sum + f.paidAmount, 0);
  const totalPending = childFees.filter((f) => f.status !== 'paid').reduce((sum, f) => sum + (f.amount - f.paidAmount), 0);
  const totalFee = childFees.reduce((sum, f) => sum + f.amount, 0);

  const attendanceDays = childAttendance.length;
  const presentDays = childAttendance.filter((a) => a.status === 'present').length;
  const attendanceRate = attendanceDays > 0 ? Math.round((presentDays / attendanceDays) * 100) : 0;

  const latestExamGrades = childGrades.slice(-6);
  const avgMarks =
    latestExamGrades.length > 0
      ? Math.round(latestExamGrades.reduce((sum, g) => sum + g.percentage, 0) / latestExamGrades.length)
      : 0;

  const upcomingEvents = events
    .filter((e) => new Date(e.startDate) > new Date() && e.status === 'upcoming')
    .slice(0, 3);

  const recentGrades = childGrades.slice(-4).reverse();

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-emerald-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Parent Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Track your child&apos;s progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Select Child:</span>
          <Select value={selectedChildId} onValueChange={setSelectedChildId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a child" />
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
      </div>

      {selectedChild && (
        <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
          <Avatar className="h-14 w-14">
            <AvatarImage src={selectedChild.avatar} alt={selectedChild.name} />
            <AvatarFallback className="text-lg font-bold">
              {selectedChild.name.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{selectedChild.name}</h2>
            <p className="text-sm text-muted-foreground">
              Student ID: {selectedChild.studentId} | Class: Grade 10 - Section A
            </p>
          </div>
          <Badge variant="success">Active</Badge>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">
              {presentDays} of {attendanceDays} days present
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average GPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgMarks}%</div>
            <p className="text-xs text-muted-foreground">
              Based on recent exams
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Fee Status</CardTitle>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${totalPaid.toLocaleString()} of ${totalFee.toLocaleString()} paid
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Library Books</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Currently issued
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
          </CardHeader>
          <CardContent>
            {recentGrades.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <GraduationCap className="mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No grades available yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentGrades.map((grade) => {
                  const subject = subjects.find((s) => s.id === grade.subjectId);
                  const exam = exams.find((e) => e.id === grade.examId);
                  return (
                    <div
                      key={grade.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{subject?.name || 'Unknown Subject'}</p>
                        <p className="text-xs text-muted-foreground">{exam?.name || ''}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {grade.marksObtained}/{grade.totalMarks}
                        </p>
                        <p className={cn('text-xs font-bold', getGradeColor(grade.grade))}>
                          {grade.grade}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No upcoming events.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        | {event.location}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <Button variant="outline" className="h-auto justify-start gap-3 p-4" asChild>
              <a href="/parent/fees">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                <div className="text-left">
                  <p className="font-medium">Pay Fee</p>
                  <p className="text-xs text-muted-foreground">View & pay outstanding fees</p>
                </div>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </a>
            </Button>
            <Button variant="outline" className="h-auto justify-start gap-3 p-4" asChild>
              <a href="/parent/messaging">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <div className="text-left">
                  <p className="font-medium">Message Teacher</p>
                  <p className="text-xs text-muted-foreground">Contact teachers directly</p>
                </div>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </a>
            </Button>
            <Button variant="outline" className="h-auto justify-start gap-3 p-4" asChild>
              <a href="/parent/performance">
                <FileText className="h-5 w-5 text-purple-500" />
                <div className="text-left">
                  <p className="font-medium">View Report Card</p>
                  <p className="text-xs text-muted-foreground">Download academic reports</p>
                </div>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
