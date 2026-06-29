'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
  Library,
  Bell,
  AlertCircle,
  TrendingUp,
  CreditCard,
  BarChart3,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  students,
  attendanceRecords,
  grades,
  exams,
  assignments,
  timetables,
  notices,
  subjects,
  teachers,
  libraryIssues,
  libraryBooks,
  fees,
} from '@/lib/mock-data'
import { useAuthStore } from '@/store/auth-store'

const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

export default function StudentDashboardPage() {
  const { user } = useAuthStore()
  const student = useMemo(() => students.find((s) => s.id === user?.id) || students[0], [user?.id])
  const CURRENT_STUDENT_ID = student.id
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const dayOfWeek = dayNames[today.getDay()]

  const studentAttendance = useMemo(
    () => attendanceRecords.filter((a) => a.studentId === CURRENT_STUDENT_ID),
    []
  )

  const attendanceStats = useMemo(() => {
    const total = studentAttendance.length
    const present = studentAttendance.filter((a) => a.status === 'present').length
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0
    return { total, present, percentage }
  }, [studentAttendance])

  const studentGrades = useMemo(
    () => grades.filter((g) => g.studentId === CURRENT_STUDENT_ID),
    []
  )

  const currentGPA = useMemo(() => {
    if (studentGrades.length === 0) return 0
    const avg = studentGrades.reduce((sum, g) => sum + g.percentage, 0) / studentGrades.length
    return Math.round(avg * 10) / 10
  }, [studentGrades])

  const pendingAssignments = useMemo(
    () => assignments.filter((a) => a.classId === student.classId && a.status === 'published'),
    [student.classId]
  )

  const overdueBooks = useMemo(
    () =>
      libraryIssues.filter(
        (i) => i.userId === CURRENT_STUDENT_ID && i.status === 'issued'
      ),
    []
  )

  const pendingFees = useMemo(
    () =>
      fees.filter(
        (f) =>
          f.studentId === CURRENT_STUDENT_ID &&
          (f.status === 'pending' || f.status === 'partial' || f.status === 'overdue')
      ),
    []
  )

  const pendingFeeAmount = useMemo(
    () => pendingFees.reduce((sum, f) => sum + (f.amount - f.paidAmount), 0),
    [pendingFees]
  )

  const todayTimetable = useMemo(
    () => timetables.find((t) => t.classId === student.classId && t.sectionId === student.sectionId && t.dayOfWeek === dayOfWeek),
    [student.classId, student.sectionId, dayOfWeek]
  )

  const recentGrades = useMemo(() => {
    const completedExams = exams.filter((e) => e.classId === student.classId && e.status === 'completed')
    return completedExams.slice(-3).reverse().map((exam) => {
      const examGrades = studentGrades.filter((g) => g.examId === exam.id)
      const avg = examGrades.length > 0
        ? examGrades.reduce((sum, g) => sum + g.percentage, 0) / examGrades.length
        : 0
      return { exam, average: Math.round(avg * 10) / 10 }
    })
  }, [studentGrades, student.classId])

  const upcomingAssignments = useMemo(
    () =>
      pendingAssignments
        .filter((a) => new Date(a.dueDate) >= today)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 4),
    [pendingAssignments]
  )

  const latestNotices = useMemo(
    () =>
      notices
        .filter((n) => n.isPublished && n.targetAudience.includes('student'))
        .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
        .slice(0, 4),
    []
  )

  const getSubjectName = (subjectId: string) => subjects.find((s) => s.id === subjectId)?.name || 'Unknown'
  const getTeacherName = (teacherId: string) => teachers.find((t) => t.id === teacherId)?.name || 'Unknown'

  const statCards = [
    {
      title: 'Attendance',
      value: `${attendanceStats.percentage}%`,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      progress: attendanceStats.percentage,
    },
    {
      title: 'Current GPA',
      value: `${currentGPA}%`,
      icon: GraduationCap,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      progress: currentGPA,
    },
    {
      title: 'Pending Assignments',
      value: pendingAssignments.length.toString(),
      icon: FileText,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      progress: 0,
    },
    {
      title: 'Library Books Due',
      value: overdueBooks.length.toString(),
      icon: Library,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      progress: 0,
    },
  ]

  const quickLinks = [
    { label: 'Assignments', href: '/student/assignments', icon: FileText },
    { label: 'Results', href: '/student/results', icon: BarChart3 },
    { label: 'Timetable', href: '/student/timetable', icon: Calendar },
    { label: 'Library', href: '/student/library', icon: Library },
    { label: 'Fees', href: '/student/fees', icon: CreditCard },
    { label: 'Attendance', href: '/student/attendance', icon: CheckCircle },
    { label: 'Notices', href: '/student/notices', icon: Bell },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {student.name.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your academics today.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          {student.studentId} &middot; Grade 10-A
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bg} rounded-lg p-2`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.progress > 0 && (
                <Progress value={stat.progress} className="mt-2" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today&apos;s Timetable
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayTimetable ? (
              <div className="space-y-3">
                {todayTimetable.periods.map((period) => (
                  <div
                    key={period.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                        P{period.periodNumber}
                      </div>
                      <div>
                        <p className="font-medium">{getSubjectName(period.subjectId)}</p>
                        <p className="text-sm text-muted-foreground">
                          {getTeacherName(period.teacherId)} &middot; {period.room}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{period.startTime}</p>
                      <p>{period.endTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="mb-2 h-10 w-10 text-muted-foreground/50" />
                <p className="text-muted-foreground">No classes scheduled for today.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentGrades.length > 0 ? (
              <div className="space-y-3">
                {recentGrades.map(({ exam, average }) => (
                  <div key={exam.id} className="rounded-lg border p-3">
                    <p className="font-medium">{exam.name}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average</span>
                      <span className="font-semibold">{average}%</span>
                    </div>
                    <Progress value={average} className="mt-2 h-1.5" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BarChart3 className="mb-2 h-10 w-10 text-muted-foreground/50" />
                <p className="text-muted-foreground">No results available yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Assignments
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/student/assignments">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {upcomingAssignments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAssignments.map((assignment) => {
                  const daysLeft = Math.ceil(
                    (new Date(assignment.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                  )
                  return (
                    <div key={assignment.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {getSubjectName(assignment.subjectId)}
                        </p>
                      </div>
                      <Badge variant={daysLeft <= 2 ? 'destructive' : daysLeft <= 5 ? 'warning' : 'secondary'}>
                        {daysLeft}d left
                      </Badge>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="mb-2 h-10 w-10 text-emerald-500/50" />
                <p className="text-muted-foreground">All caught up! No pending assignments.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Latest Notices
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/student/notices">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {latestNotices.length > 0 ? (
              <div className="space-y-3">
                {latestNotices.map((notice) => (
                  <div key={notice.id} className="rounded-lg border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium">{notice.title}</p>
                      <Badge
                        variant={
                          notice.type === 'urgent'
                            ? 'destructive'
                            : notice.type === 'event'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {notice.type}
                      </Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {notice.content}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(notice.publishDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="mb-2 h-10 w-10 text-muted-foreground/50" />
                <p className="text-muted-foreground">No notices at the moment.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {quickLinks.map((link) => (
              <Button
                key={link.href}
                variant="outline"
                className="flex h-auto flex-col gap-2 py-4"
                asChild
              >
                <Link href={link.href}>
                  <link.icon className="h-6 w-6" />
                  <span className="text-xs">{link.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
