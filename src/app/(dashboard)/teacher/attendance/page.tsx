'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Users,
  CalendarDays,
  History,
} from 'lucide-react'
import {
  teachers,
  subjects,
  classes,
  sections,
  students,
  attendanceRecords,
} from '@/lib/mock-data'
import { useAuthStore } from '@/store/auth-store'
import type { Student, Attendance } from '@/types'

type AttendanceStatus = 'present' | 'absent' | 'late'

interface StudentAttendance {
  student: Student
  status: AttendanceStatus
}

interface AttendanceSubmission {
  className: string
  section: string
  subject: string
  date: string
  totalStudents: number
  presentCount: number
  absentCount: number
  lateCount: number
}

function getTeacherClassOptions(currentTeacher: { id: string }): { classId: string; sectionId: string; subjectId: string; label: string }[] {
  const teacherSubjects = subjects.filter((s) => s.teacherId === currentTeacher.id)
  return teacherSubjects.map((subject) => {
    const cls = classes.find((c) => c.id === subject.classId)
    const section = sections.find((s) => s.classId === subject.classId && s.classTeacherId === currentTeacher.id) ||
      sections.find((s) => s.classId === subject.classId)
    return {
      classId: subject.classId,
      sectionId: section?.id || '',
      subjectId: subject.id,
      label: `${cls?.name || 'Unknown'} - Section ${section?.name || '?'} (${subject.name})`,
    }
  })
}

function getStudentsForClass(classId: string, sectionId: string): Student[] {
  return students.filter((s) => s.classId === classId && s.sectionId === sectionId)
}

function getAttendanceHistory(currentTeacher: { id: string }): AttendanceSubmission[] {
  const today = new Date()
  const history: AttendanceSubmission[] = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dayOfWeek = date.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) continue

    const dateStr = date.toISOString().split('T')[0]
    const dayRecords = attendanceRecords.filter(
      (r) => r.date === dateStr && r.markedBy === currentTeacher.id
    )

    if (dayRecords.length > 0) {
      const presentCount = dayRecords.filter((r) => r.status === 'present').length
      const absentCount = dayRecords.filter((r) => r.status === 'absent').length
      const lateCount = dayRecords.filter((r) => r.status === 'late').length
      const cls = classes.find((c) => c.id === dayRecords[0].classId)
      const section = sections.find((s) => s.id === dayRecords[0].sectionId)

      history.push({
        className: cls?.name || 'Unknown',
        section: section?.name || '?',
        subject: 'Mathematics',
        date: dateStr,
        totalStudents: dayRecords.length,
        presentCount,
        absentCount,
        lateCount,
      })
    }
  }

  return history.slice(0, 5)
}

export default function AttendancePage() {
  const { user } = useAuthStore()
  const currentTeacher = teachers.find((t) => t.id === user?.id) || teachers[0]
  const classOptions = useMemo(() => getTeacherClassOptions(currentTeacher), [currentTeacher])
  const [selectedClassOption, setSelectedClassOption] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [studentAttendances, setStudentAttendances] = useState<StudentAttendance[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attendanceHistory] = useState<AttendanceSubmission[]>(() => getAttendanceHistory(currentTeacher))

  const selectedOption = classOptions.find((o) => `${o.classId}-${o.sectionId}-${o.subjectId}` === selectedClassOption)

  const classStudents = useMemo(() => {
    if (!selectedOption) return []
    return getStudentsForClass(selectedOption.classId, selectedOption.sectionId)
  }, [selectedOption])

  const prevClassStudentsRef = useState<string>('')
  const classStudentIds = classStudents.map(s => s.id).join(',')
  
  useEffect(() => {
    if (classStudents.length > 0 && classStudentIds !== prevClassStudentsRef[0]) {
      prevClassStudentsRef[1](classStudentIds)
      setStudentAttendances(
        classStudents.map((student) => ({
          student,
          status: 'present' as AttendanceStatus,
        }))
      )
      setIsSubmitted(false)
    }
  }, [classStudents, classStudentIds, prevClassStudentsRef])

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStudentAttendances((prev) =>
      prev.map((sa) => (sa.student.id === studentId ? { ...sa, status } : sa))
    )
  }

  const handleMarkAll = (status: AttendanceStatus) => {
    setStudentAttendances((prev) =>
      prev.map((sa) => ({ ...sa, status }))
    )
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
  }

  const presentCount = studentAttendances.filter((sa) => sa.status === 'present').length
  const absentCount = studentAttendances.filter((sa) => sa.status === 'absent').length
  const lateCount = studentAttendances.filter((sa) => sa.status === 'late').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mark Attendance</h1>
        <p className="text-muted-foreground">Record student attendance for your classes</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{studentAttendances.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-100 p-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Present</p>
                <p className="text-2xl font-bold">{presentCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-red-100 p-3">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Absent / Late</p>
                <p className="text-2xl font-bold">{absentCount + lateCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Select Class & Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Class / Subject</Label>
              <Select value={selectedClassOption} onValueChange={setSelectedClassOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class and subject" />
                </SelectTrigger>
                <SelectContent>
                  {classOptions.map((option) => (
                    <SelectItem
                      key={`${option.classId}-${option.sectionId}-${option.subjectId}`}
                      value={`${option.classId}-${option.sectionId}-${option.subjectId}`}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedOption && studentAttendances.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Student List</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkAll('present')}
                >
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Mark All Present
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkAll('absent')}
                >
                  <XCircle className="mr-1 h-4 w-4" />
                  Mark All Absent
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="mb-4 h-12 w-12 text-emerald-500" />
                <h3 className="text-lg font-medium">Attendance Submitted!</h3>
                <p className="text-muted-foreground">
                  {presentCount} present, {absentCount} absent, {lateCount} late
                </p>
                <Button
                  className="mt-4"
                  onClick={() => {
                    setIsSubmitted(false)
                    setStudentAttendances(
                      classStudents.map((student) => ({
                        student,
                        status: 'present' as AttendanceStatus,
                      }))
                    )
                  }}
                >
                  Mark New Attendance
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {studentAttendances.map((sa) => (
                    <div
                      key={sa.student.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={sa.student.avatar} alt={sa.student.name} />
                          <AvatarFallback className="text-xs">
                            {sa.student.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{sa.student.name}</p>
                          <p className="text-xs text-muted-foreground">{sa.student.studentId}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant={sa.status === 'present' ? 'default' : 'outline'}
                          className={
                            sa.status === 'present'
                              ? 'bg-emerald-600 hover:bg-emerald-700'
                              : ''
                          }
                          onClick={() => handleStatusChange(sa.student.id, 'present')}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={sa.status === 'absent' ? 'default' : 'outline'}
                          className={
                            sa.status === 'absent'
                              ? 'bg-red-600 hover:bg-red-700'
                              : ''
                          }
                          onClick={() => handleStatusChange(sa.student.id, 'absent')}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={sa.status === 'late' ? 'default' : 'outline'}
                          className={
                            sa.status === 'late'
                              ? 'bg-amber-600 hover:bg-amber-700'
                              : ''
                          }
                          onClick={() => handleStatusChange(sa.student.id, 'late')}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleSubmit}>
                    <Save className="mr-2 h-4 w-4" />
                    Submit Attendance
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedOption && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarDays className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium">Select a class to begin</h3>
            <p className="text-muted-foreground">
              Choose a class and subject from the dropdown above to mark attendance
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Attendance History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {attendanceHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <History className="mb-2 h-10 w-10 text-muted-foreground/50" />
              <p className="text-muted-foreground">No attendance records yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {attendanceHistory.map((record, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {record.className} - Section {record.section}
                    </p>
                    <p className="text-xs text-muted-foreground">{record.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="success">{record.presentCount} Present</Badge>
                    <Badge variant="destructive">{record.absentCount} Absent</Badge>
                    <Badge variant="warning">{record.lateCount} Late</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
