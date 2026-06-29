'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { Plus, FileText, Users, Calendar, CheckCircle2, Clock, Eye } from 'lucide-react'
import {
  teachers,
  subjects,
  classes,
  sections,
  students,
  assignments as mockAssignments,
} from '@/lib/mock-data'
import { useAuthStore } from '@/store/auth-store'
import type { Assignment } from '@/types'

function getTeacherAssignments(currentTeacher: { id: string }): (Assignment & { className: string; sectionName: string; subjectName: string; submissionCount: number })[] {
  return mockAssignments
    .filter((a) => a.teacherId === currentTeacher.id)
    .map((assignment) => {
      const cls = classes.find((c) => c.id === assignment.classId)
      const section = sections.find((s) => s.id === assignment.sectionId)
      const subject = subjects.find((s) => s.id === assignment.subjectId)
      const classStudents = students.filter(
        (s) => s.classId === assignment.classId && s.sectionId === assignment.sectionId
      )
      return {
        ...assignment,
        className: cls?.name || 'Unknown',
        sectionName: section?.name || '?',
        subjectName: subject?.name || 'Unknown',
        submissionCount: Math.floor(Math.random() * (classStudents.length + 1)),
      }
    })
}

function getStatusBadge(status: Assignment['status']) {
  switch (status) {
    case 'published':
      return <Badge variant="success">Active</Badge>
    case 'draft':
      return <Badge variant="warning">Draft</Badge>
    case 'graded':
      return <Badge variant="secondary">Graded</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getDueStatus(dueDate: string): { label: string; variant: 'default' | 'destructive' | 'warning' } {
  const due = new Date(dueDate)
  const now = new Date()
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return { label: 'Overdue', variant: 'destructive' }
  if (diffDays <= 2) return { label: `${diffDays}d left`, variant: 'warning' }
  return { label: `${diffDays}d left`, variant: 'default' }
}

export default function AssignmentsPage() {
  const { user } = useAuthStore()
  const currentTeacher = teachers.find((t) => t.id === user?.id) || teachers[0]
  const [assignments, setAssignments] = useState(() => getTeacherAssignments(currentTeacher))
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showSubmissionsDialog, setShowSubmissionsDialog] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<(typeof assignments)[0] | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    subjectId: '',
    classId: '',
    sectionId: '',
    dueDate: '',
    totalMarks: '',
  })

  const filteredAssignments = useMemo(() => {
    if (filterStatus === 'all') return assignments
    return assignments.filter((a) => a.status === filterStatus)
  }, [assignments, filterStatus])

  const teacherSubjects = useMemo(
    () => subjects.filter((s) => s.teacherId === currentTeacher.id),
    []
  )

  const availableSections = useMemo(() => {
    if (!newAssignment.classId) return []
    return sections.filter((s) => s.classId === newAssignment.classId)
  }, [newAssignment.classId])

  const handleCreate = () => {
    const subject = subjects.find((s) => s.id === newAssignment.subjectId)
    const cls = classes.find((c) => c.id === newAssignment.classId)
    const section = sections.find((s) => s.id === newAssignment.sectionId)

    const assignment: (typeof assignments)[0] = {
      id: `asgn-new-${Date.now()}`,
      title: newAssignment.title,
      description: newAssignment.description,
      subjectId: newAssignment.subjectId,
      classId: newAssignment.classId,
      sectionId: newAssignment.sectionId,
      teacherId: currentTeacher.id,
      totalMarks: parseInt(newAssignment.totalMarks, 10) || 50,
      dueDate: newAssignment.dueDate,
      status: 'published',
      createdAt: new Date().toISOString(),
      className: cls?.name || 'Unknown',
      sectionName: section?.name || '?',
      subjectName: subject?.name || 'Unknown',
      submissionCount: 0,
    }

    setAssignments((prev) => [assignment, ...prev])
    setShowCreateDialog(false)
    setNewAssignment({
      title: '',
      description: '',
      subjectId: '',
      classId: '',
      sectionId: '',
      dueDate: '',
      totalMarks: '',
    })
  }

  const viewSubmissions = (assignment: (typeof assignments)[0]) => {
    setSelectedAssignment(assignment)
    setShowSubmissionsDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground">Create and manage assignments for your classes</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Assignment
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'published', 'draft', 'graded'].map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus(status)}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {filteredAssignments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium">No assignments found</h3>
            <p className="text-muted-foreground">
              {filterStatus === 'all'
                ? 'Create your first assignment to get started.'
                : `No ${filterStatus} assignments found.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-center">Submissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment) => {
                  const dueStatus = getDueStatus(assignment.dueDate)
                  return (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{assignment.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {assignment.totalMarks} marks
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{assignment.subjectName}</TableCell>
                      <TableCell>
                        {assignment.className} - {assignment.sectionName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{assignment.dueDate}</span>
                          <Badge variant={dueStatus.variant} className="text-xs">
                            {dueStatus.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {assignment.submissionCount}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewSubmissions(assignment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>
              Create a new assignment for your students
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Assignment title"
                value={newAssignment.title}
                onChange={(e) =>
                  setNewAssignment((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Assignment description and instructions"
                rows={4}
                value={newAssignment.description}
                onChange={(e) =>
                  setNewAssignment((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select
                  value={newAssignment.subjectId}
                  onValueChange={(v) =>
                    setNewAssignment((prev) => ({ ...prev, subjectId: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {teacherSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Select
                  value={newAssignment.classId}
                  onValueChange={(v) =>
                    setNewAssignment((prev) => ({
                      ...prev,
                      classId: v,
                      sectionId: '',
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes
                      .filter((c) =>
                        teacherSubjects.some((s) => s.classId === c.id)
                      )
                      .map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Section</Label>
                <Select
                  value={newAssignment.sectionId}
                  onValueChange={(v) =>
                    setNewAssignment((prev) => ({ ...prev, sectionId: v }))
                  }
                  disabled={!newAssignment.classId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        Section {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) =>
                    setNewAssignment((prev) => ({ ...prev, dueDate: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Max Marks</Label>
                <Input
                  type="number"
                  placeholder="50"
                  value={newAssignment.totalMarks}
                  onChange={(e) =>
                    setNewAssignment((prev) => ({ ...prev, totalMarks: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                !newAssignment.title ||
                !newAssignment.subjectId ||
                !newAssignment.classId ||
                !newAssignment.sectionId ||
                !newAssignment.dueDate
              }
            >
              Create Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSubmissionsDialog} onOpenChange={setShowSubmissionsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submissions - {selectedAssignment?.title}</DialogTitle>
            <DialogDescription>
              View student submissions for this assignment
            </DialogDescription>
          </DialogHeader>
          {selectedAssignment && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg border p-3">
                  <p className="text-2xl font-bold">{selectedAssignment.submissionCount}</p>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-2xl font-bold">{selectedAssignment.totalMarks}</p>
                  <p className="text-xs text-muted-foreground">Max Marks</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-2xl font-bold">{selectedAssignment.dueDate}</p>
                  <p className="text-xs text-muted-foreground">Due Date</p>
                </div>
              </div>
              <div className="space-y-2">
                {students
                  .filter((s) => s.classId === selectedAssignment.classId && s.sectionId === selectedAssignment.sectionId)
                  .map((student, index) => {
                    const isSubmitted = index < selectedAssignment.submissionCount
                    return (
                      <div key={student.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                            {student.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.studentId}</p>
                          </div>
                        </div>
                        <Badge variant={isSubmitted ? 'success' : 'outline'}>
                          {isSubmitted ? 'Submitted' : 'Pending'}
                        </Badge>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
