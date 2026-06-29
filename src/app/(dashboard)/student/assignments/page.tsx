'use client'

import { useMemo, useState } from 'react'
import { FileText, Upload, Eye, CheckCircle, Clock, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
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
import { assignments, subjects, teachers, grades, students } from '@/lib/mock-data'
import { useAuthStore } from '@/store/auth-store'

type FilterStatus = 'all' | 'pending' | 'submitted' | 'graded'

// Use deterministic values based on assignment id to avoid hydration mismatch
const getSubmissionStatus = (id: string): 'pending' | 'submitted' | 'graded' => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const rand = (hash % 10) / 10
  return rand < 0.3 ? 'submitted' : 'pending'
}

const submissionStatuses: Record<string, 'pending' | 'submitted' | 'graded'> = {}
assignments.forEach((a) => {
  submissionStatuses[a.id] = a.status === 'graded' ? 'graded' : getSubmissionStatus(a.id)
})

const studentSubmissions: Record<string, { notes: string; submittedAt: string }> = {}

Object.entries(submissionStatuses).forEach(([id, status]) => {
  if (status === 'submitted' || status === 'graded') {
    // Use deterministic date based on id hash
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const daysAgo = (hash % 5) + 1
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    studentSubmissions[id] = {
      notes: 'Submission attached.',
      submittedAt: date.toISOString(),
    }
  }
})

export default function AssignmentsPage() {
  const { user } = useAuthStore()
  const student = students.find((s) => s.id === user?.id) || students[0]
  const CURRENT_STUDENT_ID = student.id
  const CURRENT_CLASS_ID = student.classId
  const CURRENT_SECTION_ID = student.sectionId
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null)
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
  const [submitNotes, setSubmitNotes] = useState('')
  const [fileName, setFileName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const filteredAssignments = useMemo(() => {
    return assignments
      .filter(
        (a) =>
          a.classId === CURRENT_CLASS_ID &&
          a.sectionId === CURRENT_SECTION_ID
      )
      .filter((a) => {
        const status = submissionStatuses[a.id] || 'pending'
        if (filterStatus === 'all') return true
        return status === filterStatus
      })
  }, [filterStatus])

  const getSubjectName = (id: string) => subjects.find((s) => s.id === id)?.name || 'Unknown'
  const getTeacherName = (id: string) => teachers.find((t) => t.id === id)?.name || 'Unknown'

  const getGrade = (assignmentId: string) => {
    const grade = grades.find(
      (g) =>
        g.studentId === CURRENT_STUDENT_ID &&
        g.subjectId === assignments.find((a) => a.id === assignmentId)?.subjectId
    )
    return grade
  }

  const handleSubmit = () => {
    setSubmitting(true)
    setTimeout(() => {
      const aId = selectedAssignment
      if (aId) {
        submissionStatuses[aId] = 'submitted'
        studentSubmissions[aId] = {
          notes: submitNotes,
          submittedAt: new Date().toISOString(),
        }
      }
      setSubmitting(false)
      setSubmitDialogOpen(false)
      setSubmitNotes('')
      setFileName('')
      setSelectedAssignment(null)
    }, 1000)
  }

  const selectedAssignmentData = selectedAssignment
    ? assignments.find((a) => a.id === selectedAssignment)
    : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assignments</h1>
        <p className="text-muted-foreground">
          View and submit your assignments.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select
          value={filterStatus}
          onValueChange={(v) => setFilterStatus(v as FilterStatus)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="graded">Graded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAssignments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="mb-3 h-12 w-12 text-muted-foreground/40" />
            <p className="text-lg font-medium">No assignments found</p>
            <p className="text-sm text-muted-foreground">
              {filterStatus === 'all'
                ? 'There are no assignments for your class yet.'
                : `No ${filterStatus} assignments.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="hidden md:block">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.map((assignment) => {
                    const status = submissionStatuses[assignment.id] || 'pending'
                    const grade = getGrade(assignment.id)
                    const dueDate = new Date(assignment.dueDate)
                    const isOverdue = dueDate < new Date() && status === 'pending'
                    return (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">
                          {assignment.title}
                        </TableCell>
                        <TableCell>{getSubjectName(assignment.subjectId)}</TableCell>
                        <TableCell>{getTeacherName(assignment.teacherId)}</TableCell>
                        <TableCell>
                          <span className={isOverdue ? 'text-destructive' : ''}>
                            {dueDate.toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>{assignment.totalMarks}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              status === 'graded'
                                ? 'success'
                                : status === 'submitted'
                                ? 'default'
                                : isOverdue
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {status === 'graded' && <CheckCircle className="mr-1 h-3 w-3" />}
                            {status === 'submitted' && <Clock className="mr-1 h-3 w-3" />}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {grade ? `${grade.marksObtained}/${grade.totalMarks}` : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {status === 'pending' ? (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedAssignment(assignment.id)
                                setSubmitDialogOpen(true)
                              }}
                            >
                              <Upload className="mr-1 h-3 w-3" />
                              Submit
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedAssignment(assignment.id)}
                            >
                              <Eye className="mr-1 h-3 w-3" />
                              View
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Card>
          </div>

          <div className="space-y-3 md:hidden">
            {filteredAssignments.map((assignment) => {
              const status = submissionStatuses[assignment.id] || 'pending'
              const grade = getGrade(assignment.id)
              const dueDate = new Date(assignment.dueDate)
              const isOverdue = dueDate < new Date() && status === 'pending'
              return (
                <Card key={assignment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {getSubjectName(assignment.subjectId)} &middot;{' '}
                          {getTeacherName(assignment.teacherId)}
                        </p>
                      </div>
                      <Badge
                        variant={
                          status === 'graded'
                            ? 'success'
                            : status === 'submitted'
                            ? 'default'
                            : isOverdue
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <p>Due: {dueDate.toLocaleDateString()}</p>
                        <p>Marks: {assignment.totalMarks}</p>
                        {grade && (
                          <p className="font-medium text-foreground">
                            Score: {grade.marksObtained}/{grade.totalMarks}
                          </p>
                        )}
                      </div>
                      {status === 'pending' ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedAssignment(assignment.id)
                            setSubmitDialogOpen(true)
                          }}
                        >
                          <Upload className="mr-1 h-3 w-3" />
                          Submit
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedAssignment(assignment.id)}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}

      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              {selectedAssignmentData?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Upload File</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Choose a file..."
                  value={fileName}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => setFileName('assignment_submission.pdf')}
                >
                  <Upload className="mr-1 h-4 w-4" />
                  Browse
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="submit-notes">Notes (optional)</Label>
              <Textarea
                id="submit-notes"
                placeholder="Add any notes about your submission..."
                value={submitNotes}
                onChange={(e) => setSubmitNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSubmitDialogOpen(false)
                setSubmitNotes('')
                setFileName('')
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!fileName || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Assignment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={submitDialogOpen === false && selectedAssignment !== null && submissionStatuses[selectedAssignment] !== 'pending'}
        onOpenChange={(open) => {
          if (!open) setSelectedAssignment(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assignment Details</DialogTitle>
          </DialogHeader>
          {selectedAssignmentData && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Title:</span>
                <span className="font-medium">{selectedAssignmentData.title}</span>
                <span className="text-muted-foreground">Subject:</span>
                <span>{getSubjectName(selectedAssignmentData.subjectId)}</span>
                <span className="text-muted-foreground">Teacher:</span>
                <span>{getTeacherName(selectedAssignmentData.teacherId)}</span>
                <span className="text-muted-foreground">Due Date:</span>
                <span>{new Date(selectedAssignmentData.dueDate).toLocaleDateString()}</span>
                <span className="text-muted-foreground">Total Marks:</span>
                <span>{selectedAssignmentData.totalMarks}</span>
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={submissionStatuses[selectedAssignment!] === 'graded' ? 'success' : 'default'}>
                  {submissionStatuses[selectedAssignment!] || 'pending'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description:</p>
                <p className="mt-1 text-sm">{selectedAssignmentData.description}</p>
              </div>
              {studentSubmissions[selectedAssignmentData.id] && (
                <div className="rounded-lg border p-3">
                  <p className="text-sm text-muted-foreground">Your Submission:</p>
                  <p className="mt-1 text-sm">
                    Submitted on{' '}
                    {new Date(studentSubmissions[selectedAssignmentData.id].submittedAt).toLocaleString()}
                  </p>
                </div>
              )}
              {getGrade(selectedAssignmentData.id) && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-sm font-medium text-emerald-800">Grade</p>
                  <p className="text-lg font-bold text-emerald-700">
                    {getGrade(selectedAssignmentData.id)!.marksObtained}/
                    {getGrade(selectedAssignmentData.id)!.totalMarks} (
                    {getGrade(selectedAssignmentData.id)!.grade})
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAssignment(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
