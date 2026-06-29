'use client'

import { useState, useMemo } from 'react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Award,
  Download,
  BarChart3,
} from 'lucide-react'
import {
  teachers,
  subjects,
  classes,
  sections,
  students,
  grades,
  exams,
} from '@/lib/mock-data'
import { useAuthStore } from '@/store/auth-store'
import type { Grade, Exam } from '@/types'

interface StudentGradeEntry {
  studentId: string
  studentName: string
  studentIdCode: string
  marksObtained: number
  totalMarks: number
  percentage: number
  grade: string
  remarks: string
  gradeId: string
}

interface ClassStats {
  average: number
  highest: number
  lowest: number
  passRate: number
}

interface GradeDistribution {
  range: string
  count: number
}

function getTeacherClassOptions(currentTeacher: { id: string }): { classId: string; subjectId: string; label: string }[] {
  const teacherSubjects = subjects.filter((s) => s.teacherId === currentTeacher.id)
  return teacherSubjects.map((subject) => {
    const cls = classes.find((c) => c.id === subject.classId)
    return {
      classId: subject.classId,
      subjectId: subject.id,
      label: `${cls?.name || 'Unknown'} - ${subject.name}`,
    }
  })
}

function getExamOptions(classId: string): Exam[] {
  return exams.filter((e) => e.classId === classId)
}

function getStudentGrades(classId: string, subjectId: string, examId: string): StudentGradeEntry[] {
  const classStudents = students.filter((s) => s.classId === classId)
  const exam = exams.find((e) => e.id === examId)

  return classStudents.map((student) => {
    const grade = grades.find(
      (g) =>
        g.studentId === student.id &&
        g.subjectId === subjectId &&
        g.examId === examId
    )
    return {
      studentId: student.id,
      studentName: student.name,
      studentIdCode: student.studentId,
      marksObtained: grade?.marksObtained || 0,
      totalMarks: exam?.totalMarks || 100,
      percentage: grade?.percentage || 0,
      grade: grade?.grade || '-',
      remarks: grade?.remarks || '',
      gradeId: grade?.id || '',
    }
  })
}

function calculateStats(studentGrades: StudentGradeEntry[]): ClassStats {
  if (studentGrades.length === 0) {
    return { average: 0, highest: 0, lowest: 0, passRate: 0 }
  }

  const percentages = studentGrades.map((sg) => sg.percentage)
  const average = percentages.reduce((a, b) => a + b, 0) / percentages.length
  const highest = Math.max(...percentages)
  const lowest = Math.min(...percentages)
  const passCount = studentGrades.filter((sg) => sg.percentage >= 40).length
  const passRate = (passCount / studentGrades.length) * 100

  return {
    average: Math.round(average * 10) / 10,
    highest,
    lowest,
    passRate: Math.round(passRate),
  }
}

function getGradeDistribution(studentGrades: StudentGradeEntry[]): GradeDistribution[] {
  const ranges = [
    { range: 'A+ (90-100)', min: 90, max: 101 },
    { range: 'A (80-89)', min: 80, max: 90 },
    { range: 'B+ (70-79)', min: 70, max: 80 },
    { range: 'B (60-69)', min: 60, max: 70 },
    { range: 'C+ (50-59)', min: 50, max: 60 },
    { range: 'C (40-49)', min: 40, max: 50 },
    { range: 'F (<40)', min: 0, max: 40 },
  ]

  return ranges.map((range) => ({
    range: range.range,
    count: studentGrades.filter(
      (sg) => sg.percentage >= range.min && sg.percentage < range.max
    ).length,
  }))
}

export default function GradebookPage() {
  const { user } = useAuthStore()
  const currentTeacher = teachers.find((t) => t.id === user?.id) || teachers[0]
  const classOptions = useMemo(() => getTeacherClassOptions(currentTeacher), [currentTeacher])
  const [selectedClassOption, setSelectedClassOption] = useState<string>('')
  const [selectedExam, setSelectedExam] = useState<string>('')
  const [editedGrades, setEditedGrades] = useState<Record<string, number>>({})

  const selectedOption = classOptions.find(
    (o) => `${o.classId}-${o.subjectId}` === selectedClassOption
  )

  const examOptions = useMemo(() => {
    if (!selectedOption) return []
    return getExamOptions(selectedOption.classId)
  }, [selectedOption])

  const studentGrades = useMemo(() => {
    if (!selectedOption || !selectedExam) return []
    return getStudentGrades(selectedOption.classId, selectedOption.subjectId, selectedExam)
  }, [selectedOption, selectedExam])

  const stats = useMemo(() => calculateStats(studentGrades), [studentGrades])
  const gradeDistribution = useMemo(() => getGradeDistribution(studentGrades), [studentGrades])

  const displayGrades = useMemo(() => {
    return studentGrades.map((sg) => {
      const edited = editedGrades[sg.studentId]
      if (edited !== undefined) {
        const percentage = (edited / sg.totalMarks) * 100
        const letterGrade =
          percentage >= 90
            ? 'A+'
            : percentage >= 80
            ? 'A'
            : percentage >= 70
            ? 'B+'
            : percentage >= 60
            ? 'B'
            : percentage >= 50
            ? 'C+'
            : percentage >= 40
            ? 'C'
            : 'F'
        return { ...sg, marksObtained: edited, percentage, grade: letterGrade }
      }
      return sg
    })
  }, [studentGrades, editedGrades])

  const handleMarksChange = (studentId: string, value: string) => {
    const num = parseInt(value, 10)
    if (!isNaN(num) && num >= 0) {
      setEditedGrades((prev) => ({ ...prev, [studentId]: num }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gradebook</h1>
          <p className="text-muted-foreground">View and manage student grades</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Grades
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Class & Exam</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Class / Subject</Label>
              <Select value={selectedClassOption} onValueChange={(v) => { setSelectedClassOption(v); setSelectedExam('') }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class and subject" />
                </SelectTrigger>
                <SelectContent>
                  {classOptions.map((option) => (
                    <SelectItem
                      key={`${option.classId}-${option.subjectId}`}
                      value={`${option.classId}-${option.subjectId}`}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Exam</Label>
              <Select value={selectedExam} onValueChange={setSelectedExam} disabled={!selectedOption}>
                <SelectTrigger>
                  <SelectValue placeholder={selectedOption ? 'Select exam' : 'Select class first'} />
                </SelectTrigger>
                <SelectContent>
                  {examOptions.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id}>
                      {exam.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedOption && selectedExam && displayGrades.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average</p>
                    <p className="text-2xl font-bold">{stats.average}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-emerald-100 p-3">
                    <Award className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Highest</p>
                    <p className="text-2xl font-bold">{stats.highest}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-red-100 p-3">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lowest</p>
                    <p className="text-2xl font-bold">{stats.lowest}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pass Rate</p>
                    <p className="text-2xl font-bold">{stats.passRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Student Grades</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-center">Marks</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Percentage</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayGrades.map((sg) => (
                    <TableRow key={sg.studentId}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sg.studentName}</p>
                          <p className="text-xs text-muted-foreground">{sg.studentIdCode}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          className="w-20 text-center"
                          value={editedGrades[sg.studentId] !== undefined ? editedGrades[sg.studentId] : sg.marksObtained}
                          onChange={(e) => handleMarksChange(sg.studentId, e.target.value)}
                          min={0}
                          max={sg.totalMarks}
                        />
                      </TableCell>
                      <TableCell className="text-center">{sg.totalMarks}</TableCell>
                      <TableCell className="text-center">{sg.percentage.toFixed(1)}%</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            sg.grade.startsWith('A')
                              ? 'success'
                              : sg.grade.startsWith('B')
                              ? 'default'
                              : sg.grade === 'F'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {sg.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {sg.remarks}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" fontSize={12} tickLine={false} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {(!selectedOption || !selectedExam) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium">Select a class and exam</h3>
            <p className="text-muted-foreground">
              Choose a class, subject, and exam from the dropdowns above to view grades
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
