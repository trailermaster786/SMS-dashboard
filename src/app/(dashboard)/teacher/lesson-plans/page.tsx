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
import { CalendarDays, BookOpen, FileText, Plus, CheckCircle2, Clock, Edit2 } from 'lucide-react'
import { teachers, subjects, classes, sections } from '@/lib/mock-data'
import { useAuthStore } from '@/store/auth-store'

type LessonStatus = 'planned' | 'in-progress' | 'completed'

interface LessonPlan {
  id: string
  day: string
  date: string
  subjectId: string
  classId: string
  sectionId: string
  topic: string
  resources: string
  notes: string
  status: LessonStatus
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

function generateWeekDates(): { day: string; date: string }[] {
  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - today.getDay() + 1)

  return daysOfWeek.map((day, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    return {
      day,
      date: date.toISOString().split('T')[0],
    }
  })
}

function generateMockLessonPlans(currentTeacher: { id: string }): LessonPlan[] {
  const weekDates = generateWeekDates()
  const teacherSubjects = subjects.filter((s) => s.teacherId === currentTeacher.id)
  const plans: LessonPlan[] = []

  weekDates.forEach((weekDay, dayIndex) => {
    const subject = teacherSubjects[dayIndex % teacherSubjects.length]
    const cls = classes.find((c) => c.id === subject.classId)
    const section = sections.find((s) => s.classId === subject.classId)
    const statuses: LessonStatus[] = ['completed', 'completed', 'in-progress', 'planned', 'planned']

    plans.push({
      id: `lp-${dayIndex}`,
      day: weekDay.day,
      date: weekDay.date,
      subjectId: subject.id,
      classId: subject.classId,
      sectionId: section?.id || '',
      topic: [
        'Quadratic Equations - Solving by Factoring',
        'Newton\'s Laws of Motion',
        'Shakespeare\'s Macbeth - Act III Analysis',
        'World War II - Pacific Theater',
        'Chemical Bonding and Molecular Structure',
      ][dayIndex] || 'Review Session',
      resources: [
        'Textbook Chapter 5, pp. 120-135',
        'Lab Manual - Experiment 4',
        'Film clip: Roman Polanski\'s Macbeth',
        'Documentary: The War in the Pacific',
        'Online simulation: Molecular Viewer',
      ][dayIndex] || 'Review materials',
      notes: dayIndex < 2 ? 'Class performed well. Need to revisit topic for 3 students.' : '',
      status: statuses[dayIndex],
    })
  })

  return plans
}

function getStatusBadge(status: LessonStatus) {
  switch (status) {
    case 'completed':
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </Badge>
      )
    case 'in-progress':
      return (
        <Badge variant="warning" className="gap-1">
          <Clock className="h-3 w-3" />
          In Progress
        </Badge>
      )
    case 'planned':
      return (
        <Badge variant="outline" className="gap-1">
          <CalendarDays className="h-3 w-3" />
          Planned
        </Badge>
      )
  }
}

export default function LessonPlansPage() {
  const { user } = useAuthStore()
  const currentTeacher = teachers.find((t) => t.id === user?.id) || teachers[0]
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(() => generateMockLessonPlans(currentTeacher))
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null)

  const teacherSubjects = useMemo(
    () => subjects.filter((s) => s.teacherId === currentTeacher.id),
    []
  )

  const handleEdit = (plan: LessonPlan) => {
    setEditingPlan({ ...plan })
    setShowEditDialog(true)
  }

  const handleSave = () => {
    if (!editingPlan) return
    setLessonPlans((prev) =>
      prev.map((p) => (p.id === editingPlan.id ? editingPlan : p))
    )
    setShowEditDialog(false)
    setEditingPlan(null)
  }

  const weekDates = useMemo(() => generateWeekDates(), [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Lesson Plans</h1>
        <p className="text-muted-foreground">Plan and track your weekly lessons</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-100 p-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">
                  {lessonPlans.filter((p) => p.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-100 p-3">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">
                  {lessonPlans.filter((p) => p.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <CalendarDays className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Planned</p>
                <p className="text-2xl font-bold">
                  {lessonPlans.filter((p) => p.status === 'planned').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {lessonPlans.map((plan, index) => {
          const subject = teacherSubjects.find((s) => s.id === plan.subjectId)
          const cls = classes.find((c) => c.id === plan.classId)
          const section = sections.find((s) => s.id === plan.sectionId)

          return (
            <Card key={plan.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold">
                      {plan.day.slice(0, 3)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{plan.topic}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {cls?.name || 'Unknown'} - Section {section?.name || '?'} | {subject?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(plan.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(plan)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <BookOpen className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Resources</p>
                      <p className="text-sm">{plan.resources}</p>
                    </div>
                  </div>
                  {plan.notes && (
                    <div className="flex items-start gap-2">
                      <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Notes</p>
                        <p className="text-sm">{plan.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{plan.date}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Lesson Plan</DialogTitle>
            <DialogDescription>Update the lesson plan details</DialogDescription>
          </DialogHeader>
          {editingPlan && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Topic</Label>
                <Input
                  value={editingPlan.topic}
                  onChange={(e) =>
                    setEditingPlan((prev) =>
                      prev ? { ...prev, topic: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Resources</Label>
                <Textarea
                  value={editingPlan.resources}
                  rows={3}
                  onChange={(e) =>
                    setEditingPlan((prev) =>
                      prev ? { ...prev, resources: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={editingPlan.notes}
                  rows={3}
                  placeholder="Add notes about this lesson..."
                  onChange={(e) =>
                    setEditingPlan((prev) =>
                      prev ? { ...prev, notes: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editingPlan.status}
                  onValueChange={(v) =>
                    setEditingPlan((prev) =>
                      prev ? { ...prev, status: v as LessonStatus } : null
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
