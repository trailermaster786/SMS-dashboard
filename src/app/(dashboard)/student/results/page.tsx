'use client'

import { useMemo, useState } from 'react'
import { BarChart3, Download, TrendingUp } from 'lucide-react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  LineChart,
  Line,
} from 'recharts'
import { grades, exams, subjects, students } from '@/lib/mock-data'
import { ReportCardPDF } from '@/components/report-card-pdf'
import { useAuthStore } from '@/store/auth-store'

const gradeColors: Record<string, string> = {
  'A+': '#10b981',
  A: '#22c55e',
  'B+': '#3b82f6',
  B: '#6366f1',
  'C+': '#f59e0b',
  C: '#f97316',
  F: '#ef4444',
}

export default function ResultsPage() {
  const { user } = useAuthStore()
  const student = students.find((s) => s.id === user?.id) || students[0]
  const CURRENT_STUDENT_ID = student.id
  const CURRENT_CLASS_ID = student.classId
  const [selectedExamId, setSelectedExamId] = useState<string>('all')

  const classExams = useMemo(
    () => exams.filter((e) => e.classId === CURRENT_CLASS_ID && e.status === 'completed'),
    []
  )

  const studentGrades = useMemo(
    () => grades.filter((g) => g.studentId === CURRENT_STUDENT_ID),
    []
  )

  const filteredGrades = useMemo(() => {
    if (selectedExamId === 'all') {
      return studentGrades.filter((g) =>
        classExams.some((e) => e.id === g.examId)
      )
    }
    return studentGrades.filter((g) => g.examId === selectedExamId)
  }, [selectedExamId, studentGrades, classExams])

  const subjectResults = useMemo(() => {
    const map = new Map<string, { total: number; count: number; subjectId: string }>()
    filteredGrades.forEach((g) => {
      const existing = map.get(g.subjectId)
      if (existing) {
        existing.total += g.percentage
        existing.count += 1
      } else {
        map.set(g.subjectId, { total: g.percentage, count: 1, subjectId: g.subjectId })
      }
    })
    return Array.from(map.values()).map((item) => {
      const subject = subjects.find((s) => s.id === item.subjectId)
      const avgPercentage = Math.round((item.total / item.count) * 10) / 10
      const latestGrade = filteredGrades.find((g) => g.subjectId === item.subjectId)
      return {
        subject: subject?.name || 'Unknown',
        code: subject?.code || '',
        marksObtained: latestGrade?.marksObtained || 0,
        totalMarks: latestGrade?.totalMarks || 100,
        percentage: avgPercentage,
        grade: latestGrade?.grade || '-',
      }
    })
  }, [filteredGrades])

  const overallSummary = useMemo(() => {
    if (subjectResults.length === 0) {
      return { totalMarks: 0, totalObtained: 0, percentage: 0, grade: '-', rank: '-' }
    }
    const totalObtained = subjectResults.reduce((sum, s) => sum + s.marksObtained, 0)
    const totalMarks = subjectResults.reduce((sum, s) => sum + s.totalMarks, 0)
    const percentage = totalMarks > 0 ? Math.round((totalObtained / totalMarks) * 1000) / 10 : 0
    const letterGrade =
      percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' :
      percentage >= 60 ? 'B' : percentage >= 50 ? 'C+' : percentage >= 40 ? 'C' : 'F'
    const rank = Math.floor((percentage / 100) * 38) + 1
    return { totalMarks, totalObtained, percentage, grade: letterGrade, rank: `${Math.min(rank, 38)} / 38` }
  }, [subjectResults])

  const gradeDistribution = useMemo(() => {
    const dist: Record<string, number> = { 'A+': 0, A: 0, 'B+': 0, B: 0, 'C+': 0, C: 0, F: 0 }
    filteredGrades.forEach((g) => {
      if (dist[g.grade] !== undefined) dist[g.grade]++
    })
    return Object.entries(dist).map(([grade, count]) => ({ grade, count }))
  }, [filteredGrades])

  const performanceTrend = useMemo(() => {
    return classExams.map((exam) => {
      const examGrades = studentGrades.filter((g) => g.examId === exam.id)
      const avg = examGrades.length > 0
        ? Math.round((examGrades.reduce((sum, g) => sum + g.percentage, 0) / examGrades.length) * 10) / 10
        : 0
      return {
        exam: exam.name.replace('Examination', '').replace('Weekly Quiz - ', 'Quiz '),
        percentage: avg,
        date: exam.startDate,
      }
    })
  }, [classExams, studentGrades])

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-emerald-600'
    if (grade.startsWith('B')) return 'text-blue-600'
    if (grade.startsWith('C')) return 'text-amber-600'
    return 'text-destructive'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Exam Results</h1>
          <p className="text-muted-foreground">
            View your exam results and academic performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedExamId} onValueChange={setSelectedExamId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select exam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exams</SelectItem>
              {classExams.map((exam) => (
                <SelectItem key={exam.id} value={exam.id}>
                  {exam.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Report Card
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Marks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallSummary.totalObtained} / {overallSummary.totalMarks}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Percentage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallSummary.percentage}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getGradeColor(overallSummary.grade)}`}>
              {overallSummary.grade}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Class Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallSummary.rank}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="results">
        <TabsList>
          <TabsTrigger value="results">
            <BarChart3 className="mr-1 h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="report">
            <Download className="mr-1 h-4 w-4" />
            Report Card
          </TabsTrigger>
          <TabsTrigger value="trend">
            <TrendingUp className="mr-1 h-4 w-4" />
            Performance Trend
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Results</CardTitle>
            </CardHeader>
            <CardContent>
              {subjectResults.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Marks Obtained</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjectResults.map((result) => (
                      <TableRow key={result.code}>
                        <TableCell className="font-medium">{result.subject}</TableCell>
                        <TableCell>{result.marksObtained}</TableCell>
                        <TableCell>{result.totalMarks}</TableCell>
                        <TableCell>{result.percentage}%</TableCell>
                        <TableCell>
                          <Badge
                            variant={result.percentage >= 60 ? 'success' : result.percentage >= 40 ? 'warning' : 'destructive'}
                          >
                            {result.grade}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <BarChart3 className="mb-3 h-12 w-12 text-muted-foreground/40" />
                  <p className="text-lg font-medium">No results available</p>
                  <p className="text-sm text-muted-foreground">
                    Results for this exam have not been published yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    name="Number of Subjects"
                    radius={[4, 4, 0, 0]}
                  >
                    {gradeDistribution.map((entry) => (
                      <rect
                        key={entry.grade}
                        fill={gradeColors[entry.grade] || '#94a3b8'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report" className="space-y-6">
          <ReportCardPDF studentId={CURRENT_STUDENT_ID} />
        </TabsContent>

        <TabsContent value="trend" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="exam" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    name="Average %"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 6, fill: '#3b82f6' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
