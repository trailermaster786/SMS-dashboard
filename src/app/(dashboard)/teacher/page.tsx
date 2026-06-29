'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Users,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileText,
  Upload,
  Star,
} from 'lucide-react'
import {
  teachers,
  subjects,
  classes,
  sections,
  students,
  assignments,
  attendanceRecords,
  grades,
  timetables,
} from '@/lib/mock-data'
import { useAuthStore } from '@/store/auth-store'
import type { Assignment, Timetable } from '@/types'

const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getTodaySchedule(currentTeacherId: string): { time: string; subject: string; classSection: string; room: string }[] {
  const today = new Date()
  const dayName = daysOfWeek[today.getDay()]
  const todayTimetables = timetables.filter(
    (tt) => tt.dayOfWeek === dayName && tt.periods.some((p) => p.teacherId === currentTeacherId)
  )

  const schedule: { time: string; subject: string; classSection: string; room: string }[] = []
  todayTimetables.forEach((tt) => {
    const cls = classes.find((c) => c.id === tt.classId)
    const section = sections.find((s) => s.id === tt.sectionId)
    tt.periods
      .filter((p) => p.teacherId === currentTeacherId)
      .forEach((period) => {
        const subject = subjects.find((s) => s.id === period.subjectId)
        schedule.push({
          time: `${period.startTime} - ${period.endTime}`,
          subject: subject?.name || 'Unknown',
          classSection: `${cls?.name || 'Unknown'} - Section ${section?.name || '?'}`,
          room: period.room,
        })
      })
  })

  return schedule.sort((a, b) => a.time.localeCompare(b.time))
}

function getTeacherStudentCount(currentTeacherId: string): number {
  const teacherSubjectClassIds = subjects
    .filter((s) => s.teacherId === currentTeacherId)
    .map((s) => s.classId)
  const uniqueClassIds = [...new Set(teacherSubjectClassIds)]
  return students.filter((s) => uniqueClassIds.includes(s.classId)).length
}

function getTeacherAssignmentCount(currentTeacherId: string): number {
  return assignments.filter((a) => a.teacherId === currentTeacherId).length
}

function getPendingAssignmentCount(currentTeacherId: string): number {
  return assignments.filter((a) => a.teacherId === currentTeacherId && a.status === 'published').length
}

function getAverageGrade(currentTeacherId: string): number {
  const teacherSubjectIds = subjects
    .filter((s) => s.teacherId === currentTeacherId)
    .map((s) => s.id)
  const teacherGrades = grades.filter((g) => teacherSubjectIds.includes(g.subjectId))
  if (teacherGrades.length === 0) return 0
  const avg = teacherGrades.reduce((sum, g) => sum + g.percentage, 0) / teacherGrades.length
  return Math.round(avg * 10) / 10
}

function getRecentSubmissions(currentTeacherId: string): { studentName: string; assignment: string; date: string }[] {
  const teacherAssignments = assignments.filter((a) => a.teacherId === currentTeacherId)
  const submissions: { studentName: string; assignment: string; date: string }[] = []
  teacherAssignments.forEach((assignment) => {
    students.slice(0, 3).forEach((student) => {
      submissions.push({
        studentName: student.name,
        assignment: assignment.title,
        date: '2026-06-27',
      })
    })
  })
  return submissions.slice(0, 5)
}

export default function TeacherDashboard() {
  const { user } = useAuthStore()
  const currentTeacher = teachers.find((t) => t.id === user?.id) || teachers[0]
  const teacherName = user?.name || currentTeacher.name
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const schedule = useMemo(() => getTodaySchedule(currentTeacher.id), [currentTeacher.id])
  const totalStudents = getTeacherStudentCount(currentTeacher.id)
  const classesToday = schedule.length
  const pendingAssignments = getPendingAssignmentCount(currentTeacher.id)
  const avgGrade = getAverageGrade(currentTeacher.id)
  const recentSubmissions = getRecentSubmissions(currentTeacher.id)

  const stats = [
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Classes Today',
      value: classesToday,
      icon: BookOpen,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Pending Assignments',
      value: pendingAssignments,
      icon: ClipboardList,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      title: 'Average Grade',
      value: `${avgGrade}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  const quickActions = [
    { label: 'Mark Attendance', icon: CheckCircle2, href: '/teacher/attendance' },
    { label: 'Upload Assignment', icon: Upload, href: '/teacher/assignments' },
    { label: 'Grade Submissions', icon: Star, href: '/teacher/gradebook' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {getGreeting()}, {teacherName}
          </h1>
          <p className="text-muted-foreground">{formattedDate}</p>
        </div>
        <Avatar className="h-12 w-12">
          <AvatarImage src={currentTeacher.avatar} alt={teacherName} />
          <AvatarFallback>
            {teacherName
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today&apos;s Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {schedule.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="mb-2 h-10 w-10 text-muted-foreground/50" />
                <p className="text-muted-foreground">No classes scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {schedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-primary/10 px-3 py-2 text-center">
                        <p className="text-xs text-muted-foreground">Time</p>
                        <p className="text-sm font-medium">{item.time}</p>
                      </div>
                      <div>
                        <p className="font-medium">{item.subject}</p>
                        <p className="text-sm text-muted-foreground">{item.classSection}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{item.room}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="w-full justify-start gap-3"
                asChild
              >
                <a href={action.href}>
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </a>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentSubmissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="mb-2 h-10 w-10 text-muted-foreground/50" />
              <p className="text-muted-foreground">No recent submissions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSubmissions.map((submission, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {submission.studentName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{submission.studentName}</p>
                      <p className="text-xs text-muted-foreground">{submission.assignment}</p>
                    </div>
                  </div>
                  <Badge variant="outline">New</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
