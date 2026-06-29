'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Users, Phone, Mail, BookOpen } from 'lucide-react'
import {
  teachers,
  subjects,
  classes,
  sections,
  students,
  grades,
  attendanceRecords,
  parents,
} from '@/lib/mock-data'
import { useAuthStore } from '@/store/auth-store'
import type { Student, Parent } from '@/types'

interface StudentProfile {
  student: Student
  className: string
  sectionName: string
  subjectName: string
  attendancePercent: number
  currentGrade: string
  parentName: string
  parentPhone: string
  parentEmail: string
}

function getTeacherStudents(currentTeacher: { id: string }): StudentProfile[] {
  const teacherSubjects = subjects.filter((s) => s.teacherId === currentTeacher.id)
  const classIds = [...new Set(teacherSubjects.map((s) => s.classId))]

  const studentProfiles: StudentProfile[] = []

  classIds.forEach((classId) => {
    const classStudents = students.filter((s) => s.classId === classId)
    const subject = teacherSubjects.find((s) => s.classId === classId)
    const cls = classes.find((c) => c.id === classId)
    const section = sections.find((s) => s.classId === classId)

    classStudents.forEach((student) => {
      const studentAttendance = attendanceRecords.filter(
        (r) => r.studentId === student.id && r.classId === classId
      )
      const presentCount = studentAttendance.filter((r) => r.status === 'present' || r.status === 'late').length
      const attendancePercent = studentAttendance.length > 0
        ? Math.round((presentCount / studentAttendance.length) * 100)
        : 0

      const studentGrades = grades.filter(
        (g) => g.studentId === student.id && subject && g.subjectId === subject.id
      )
      const avgGrade = studentGrades.length > 0
        ? studentGrades.reduce((sum, g) => sum + g.percentage, 0) / studentGrades.length
        : 0
      const letterGrade =
        avgGrade >= 90 ? 'A+' : avgGrade >= 80 ? 'A' : avgGrade >= 70 ? 'B+' : avgGrade >= 60 ? 'B' : avgGrade >= 50 ? 'C+' : avgGrade >= 40 ? 'C' : avgGrade > 0 ? 'F' : '-'

      const parent = parents.find((p) => p.id === student.parentId)

      studentProfiles.push({
        student,
        className: cls?.name || 'Unknown',
        sectionName: section?.name || '?',
        subjectName: subject?.name || 'Unknown',
        attendancePercent,
        currentGrade: letterGrade,
        parentName: parent?.name || 'N/A',
        parentPhone: parent?.phone || 'N/A',
        parentEmail: parent?.email || 'N/A',
      })
    })
  })

  return studentProfiles
}

export default function StudentsPage() {
  const { user } = useAuthStore()
  const currentTeacher = teachers.find((t) => t.id === user?.id) || teachers[0]
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null)
  const [showProfileDialog, setShowProfileDialog] = useState(false)

  const allStudents = useMemo(() => getTeacherStudents(currentTeacher), [currentTeacher])

  const teacherClassOptions = useMemo(() => {
    const classIds = [...new Set(allStudents.map((s) => s.className))]
    return classIds
  }, [allStudents])

  const filteredStudents = useMemo(() => {
    return allStudents.filter((sp) => {
      const matchesSearch =
        sp.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sp.student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesClass = selectedClass === 'all' || sp.className === selectedClass
      return matchesSearch && matchesClass
    })
  }, [allStudents, searchQuery, selectedClass])

  const viewProfile = (studentProfile: StudentProfile) => {
    setSelectedStudent(studentProfile)
    setShowProfileDialog(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">View students in your classes</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {teacherClassOptions.map((className) => (
                  <SelectItem key={className} value={className}>
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium">No students found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedClass !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No students are assigned to your classes yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((sp) => (
            <Card
              key={sp.student.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => viewProfile(sp)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={sp.student.avatar} alt={sp.student.name} />
                    <AvatarFallback className="text-lg">
                      {sp.student.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{sp.student.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {sp.className} - Section {sp.sectionName}
                    </p>
                    <p className="text-xs text-muted-foreground">{sp.student.studentId}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Attendance</span>
                    <span className="font-medium">{sp.attendancePercent}%</span>
                  </div>
                  <Progress value={sp.attendancePercent} className="h-1.5" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current Grade</span>
                    <Badge
                      variant={
                        sp.currentGrade.startsWith('A')
                          ? 'success'
                          : sp.currentGrade.startsWith('B')
                          ? 'default'
                          : sp.currentGrade === 'F'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {sp.currentGrade}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span className="truncate">{sp.parentName}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
            <DialogDescription>Detailed student information</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedStudent.student.avatar} alt={selectedStudent.student.name} />
                  <AvatarFallback className="text-xl">
                    {selectedStudent.student.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedStudent.student.name}</h3>
                  <p className="text-muted-foreground">
                    {selectedStudent.className} - Section {selectedStudent.sectionName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedStudent.student.studentId}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Attendance</p>
                  <p className="text-lg font-bold">{selectedStudent.attendancePercent}%</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Grade</p>
                  <p className="text-lg font-bold">{selectedStudent.currentGrade}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="text-sm font-medium">{selectedStudent.student.dateOfBirth}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Blood Group</p>
                  <p className="text-sm font-medium">{selectedStudent.student.bloodGroup || 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Parent/Guardian</h4>
                <div className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedStudent.parentName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedStudent.parentPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedStudent.parentEmail}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Subject</h4>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedStudent.subjectName}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
