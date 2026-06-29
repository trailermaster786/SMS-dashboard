'use client'

import { useMemo, useState } from 'react'
import {
  CheckCircle,
  XCircle,
  Clock,
  CalendarDays,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { attendanceRecords, subjects, students } from '@/lib/mock-data'
import { useAuthStore } from '@/store/auth-store'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const statusConfig: Record<string, { color: string; bg: string; icon: typeof CheckCircle }> = {
  present: { color: 'text-emerald-600', bg: 'bg-emerald-500', icon: CheckCircle },
  absent: { color: 'text-destructive', bg: 'bg-destructive', icon: XCircle },
  late: { color: 'text-amber-600', bg: 'bg-amber-500', icon: Clock },
  excused: { color: 'text-blue-600', bg: 'bg-blue-500', icon: CheckCircle },
}

export default function AttendancePage() {
  const { user } = useAuthStore()
  const student = students.find((s) => s.id === user?.id) || students[0]
  const CURRENT_STUDENT_ID = student.id
  const CURRENT_CLASS_ID = student.classId
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth().toString())
  const [selectedYear] = useState(now.getFullYear().toString())

  const studentAttendance = useMemo(
    () => attendanceRecords.filter((a) => a.studentId === CURRENT_STUDENT_ID),
    []
  )

  const monthAttendance = useMemo(() => {
    const month = parseInt(selectedMonth)
    const year = parseInt(selectedYear)
    return studentAttendance.filter((a) => {
      const d = new Date(a.date)
      return d.getMonth() === month && d.getFullYear() === year
    })
  }, [studentAttendance, selectedMonth, selectedYear])

  const stats = useMemo(() => {
    const total = monthAttendance.length
    const present = monthAttendance.filter((a) => a.status === 'present').length
    const absent = monthAttendance.filter((a) => a.status === 'absent').length
    const late = monthAttendance.filter((a) => a.status === 'late').length
    const excused = monthAttendance.filter((a) => a.status === 'excused').length
    const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0
    return { total, present, absent, late, excused, percentage }
  }, [monthAttendance])

  const calendarDays = useMemo(() => {
    const month = parseInt(selectedMonth)
    const year = parseInt(selectedYear)
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)
    return days
  }, [selectedMonth, selectedYear])

  const getAttendanceForDate = (day: number) => {
    const month = parseInt(selectedMonth)
    const year = parseInt(selectedYear)
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return monthAttendance.find((a) => a.date === dateStr)
  }

  const subjectWiseAttendance = useMemo(() => {
    const map = new Map<string, { total: number; present: number }>()
    monthAttendance.forEach((a) => {
      const existing = map.get(a.classId)
      if (existing) {
        existing.total++
        if (a.status === 'present' || a.status === 'late') existing.present++
      } else {
        map.set(a.classId, {
          total: 1,
          present: a.status === 'present' || a.status === 'late' ? 1 : 0,
        })
      }
    })
    const subjectList = subjects.filter((s) => s.classId === CURRENT_CLASS_ID)
    return subjectList.map((subject) => {
      const stats = map.get(subject.classId) || { total: 0, present: 0 }
      const percentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0
      return {
        subject: subject.name,
        percentage,
        total: stats.total,
        present: stats.present,
      }
    })
  }, [monthAttendance])

  const monthlyTrend = useMemo(() => {
    const year = parseInt(selectedYear)
    return months.map((month, index) => {
      const monthRecords = studentAttendance.filter((a) => {
        const d = new Date(a.date)
        return d.getMonth() === index && d.getFullYear() === year
      })
      const total = monthRecords.length
      const present = monthRecords.filter(
        (a) => a.status === 'present' || a.status === 'late'
      ).length
      return {
        month: month.substring(0, 3),
        percentage: total > 0 ? Math.round((present / total) * 100) : 0,
        total,
      }
    })
  }, [studentAttendance, selectedYear])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            Track your attendance history and patterns.
          </p>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={index} value={index.toString()}>
                {month} {selectedYear}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Present
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.present}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Absent
            </CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.absent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Late
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.late}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Attendance Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.percentage}%</div>
            <Progress value={stats.percentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Calendar View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center">
              {dayLabels.map((label) => (
                <div
                  key={label}
                  className="p-1 text-xs font-medium text-muted-foreground"
                >
                  {label}
                </div>
              ))}
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="p-1" />
                }
                const record = getAttendanceForDate(day)
                const config = record ? statusConfig[record.status] : null
                const isToday =
                  day === now.getDate() &&
                  parseInt(selectedMonth) === now.getMonth() &&
                  parseInt(selectedYear) === now.getFullYear()
                return (
                  <div
                    key={day}
                    className={`relative flex h-9 w-full items-center justify-center rounded-lg text-sm ${
                      config
                        ? `${config.bg}/10 ${config.color}`
                        : 'text-muted-foreground'
                    } ${isToday ? 'ring-2 ring-primary' : ''}`}
                  >
                    {day}
                    {config && (
                      <div
                        className={`absolute -bottom-0.5 h-1 w-1 rounded-full ${config.bg}`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Present
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-destructive" /> Absent
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Late
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> Excused
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar
                  dataKey="percentage"
                  name="Attendance %"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {monthAttendance.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Marked By</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthAttendance
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((record) => {
                    const date = new Date(record.date)
                    const config = statusConfig[record.status]
                    const Icon = config.icon
                    return (
                      <TableRow key={record.id}>
                        <TableCell>{date.toLocaleDateString()}</TableCell>
                        <TableCell>{dayLabels[date.getDay()]}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              record.status === 'present'
                                ? 'success'
                                : record.status === 'absent'
                                ? 'destructive'
                                : record.status === 'late'
                                ? 'warning'
                                : 'secondary'
                            }
                          >
                            <Icon className="mr-1 h-3 w-3" />
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.markedBy}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {record.remarks || '-'}
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <CalendarDays className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">No attendance records</p>
              <p className="text-sm text-muted-foreground">
                No attendance data available for this month.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
