'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, Download, Award, BookOpen, FileText } from 'lucide-react';
import { students, grades, subjects, exams } from '@/lib/mock-data';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

export default function ParentPerformancePage() {
  const { user } = useAuthStore()
  const parentChildren = students.filter(
    (s) => s.parentId === user?.id
  );
  const [selectedChildId, setSelectedChildId] = useState(parentChildren[0]?.id || '');
  const [selectedTab, setSelectedTab] = useState('grades');

  const selectedChild = students.find((s) => s.id === selectedChildId);
  const childGrades = grades.filter((g) => g.studentId === selectedChildId);
  const completedExams = exams.filter((e) => e.status === 'completed');

  const subjectGrades = subjects
    .filter((s) => s.classId === selectedChild?.classId)
    .map((subject) => {
      const subjectData = childGrades.filter((g) => g.subjectId === subject.id);
      const avgPercentage =
        subjectData.length > 0
          ? Math.round(subjectData.reduce((sum, g) => sum + g.percentage, 0) / subjectData.length)
          : 0;
      const latestGrade = subjectData[subjectData.length - 1];
      return {
        subject: subject.name,
        code: subject.code,
        avgPercentage,
        latestGrade: latestGrade?.grade || '-',
        totalMarks: subjectData.reduce((sum, g) => sum + g.marksObtained, 0),
        totalPossible: subjectData.reduce((sum, g) => sum + g.totalMarks, 0),
        teacherRemarks: latestGrade?.remarks || 'No remarks',
      };
    });

  const performanceTrend = completedExams
    .filter((e) => e.classId === selectedChild?.classId)
    .map((exam) => {
      const examGrades = childGrades.filter((g) => g.examId === exam.id);
      const avgPercentage =
        examGrades.length > 0
          ? Math.round(examGrades.reduce((sum, g) => sum + g.percentage, 0) / examGrades.length)
          : 0;
      return {
        exam: exam.name.replace('Examination', '').trim(),
        percentage: avgPercentage,
      };
    });

  const overallAvg =
    subjectGrades.length > 0
      ? Math.round(subjectGrades.reduce((sum, s) => sum + s.avgPercentage, 0) / subjectGrades.length)
      : 0;

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-emerald-600 bg-emerald-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Academic Performance</h1>
          <p className="text-muted-foreground">Track your child&apos;s academic progress</p>
        </div>
        <div className="flex items-center gap-3">
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
      </div>

      {selectedChild && (
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">{selectedChild?.name}&apos;s Performance</h2>
            <p className="text-sm text-muted-foreground">
              Student ID: {selectedChild?.studentId} | Grade 10 - Section A
            </p>
          </div>
          <Badge variant="default" className="ml-auto">
            Overall: {overallAvg}%
          </Badge>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overallAvg}%</div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Best Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {subjectGrades.sort((a, b) => b.avgPercentage - a.avgPercentage)[0]?.subject || '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {subjectGrades.sort((a, b) => b.avgPercentage - a.avgPercentage)[0]?.avgPercentage || 0}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Exams Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedExams.filter((e) => e.classId === selectedChild?.classId).length}</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="grades">Subject Grades</TabsTrigger>
          <TabsTrigger value="trends">Performance Trend</TabsTrigger>
          <TabsTrigger value="exams">Exam Comparison</TabsTrigger>
          <TabsTrigger value="report">Report Card</TabsTrigger>
        </TabsList>

        <TabsContent value="grades" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Grades</CardTitle>
            </CardHeader>
            <CardContent>
              {subjectGrades.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No grades available yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead className="text-center">Marks</TableHead>
                      <TableHead className="text-center">Average %</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjectGrades.map((sg) => (
                      <TableRow key={sg.code}>
                        <TableCell className="font-medium">{sg.subject}</TableCell>
                        <TableCell className="text-muted-foreground">{sg.code}</TableCell>
                        <TableCell className="text-center">
                          {sg.totalMarks}/{sg.totalPossible}
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          {sg.avgPercentage}%
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={cn('inline-flex rounded-full px-2 py-1 text-xs font-bold', getGradeColor(sg.latestGrade))}>
                            {sg.latestGrade}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {sg.teacherRemarks}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {performanceTrend.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <TrendingUp className="mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No trend data available.</p>
                </div>
              ) : (
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="exam" className="text-xs" />
                      <YAxis domain={[0, 100]} className="text-xs" />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="percentage"
                        name="Average %"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exams" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Exam Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              {performanceTrend.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No exam data available.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedExams
                    .filter((e) => e.classId === selectedChild?.classId)
                    .map((exam) => {
                      const examGrades = childGrades.filter((g) => g.examId === exam.id);
                      const avg =
                        examGrades.length > 0
                          ? Math.round(examGrades.reduce((sum, g) => sum + g.percentage, 0) / examGrades.length)
                          : 0;
                      return (
                        <div key={exam.id} className="rounded-lg border p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <h3 className="font-medium">{exam.name}</h3>
                            <Badge variant={avg >= 60 ? 'success' : 'destructive'}>{avg}%</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                            {examGrades.map((g) => {
                              const sub = subjects.find((s) => s.id === g.subjectId);
                              return (
                                <div key={g.id} className="rounded bg-muted/50 p-2 text-center">
                                  <p className="text-xs text-muted-foreground">{sub?.name}</p>
                                  <p className="font-semibold">{g.marksObtained}/{g.totalMarks}</p>
                                  <p className={cn('text-xs font-bold', getGradeColor(g.grade))}>
                                    {g.grade}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Report Card</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border-2 border-primary/20 p-6">
                <div className="mb-6 text-center">
                  <h2 className="text-xl font-bold">Greenfield Academy</h2>
                  <p className="text-sm text-muted-foreground">Academic Report Card 2025-2026</p>
                </div>
                <div className="mb-4 grid grid-cols-2 gap-4 border-b pb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Student Name</p>
                    <p className="font-semibold">{selectedChild?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Student ID</p>
                    <p className="font-semibold">{selectedChild?.studentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Class</p>
                    <p className="font-semibold">Grade 10 - Section A</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Average</p>
                    <p className="font-semibold">{overallAvg}%</p>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead className="text-center">Marks</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjectGrades.map((sg) => (
                      <TableRow key={sg.code}>
                        <TableCell className="font-medium">{sg.subject}</TableCell>
                        <TableCell className="text-center">
                          {sg.totalMarks}/{sg.totalPossible}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={cn('inline-flex rounded-full px-2 py-1 text-xs font-bold', getGradeColor(sg.latestGrade))}>
                            {sg.latestGrade}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {sg.teacherRemarks}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
