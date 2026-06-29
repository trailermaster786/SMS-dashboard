'use client'

import { useState, useMemo } from 'react'
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
import { BookOpen, Users, Clock, ArrowRight } from 'lucide-react'
import {
  teachers,
  subjects,
  classes,
  sections,
  students,
  timetables,
} from '@/lib/mock-data'
import { useAuthStore } from '@/store/auth-store'
import type { Subject, Class, Section } from '@/types'

const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

interface ClassCard {
  subject: Subject
  class: Class
  section: Section
  studentCount: number
  nextClassTime: string
}

function getTeacherClasses(currentTeacher: { id: string }): ClassCard[] {
  const teacherSubjects = subjects.filter((s) => s.teacherId === currentTeacher.id)
  const classCards: ClassCard[] = []

  teacherSubjects.forEach((subject) => {
    const cls = classes.find((c) => c.id === subject.classId)
    const section = sections.find((s) => s.classId === subject.classId)
    if (!cls || !section) return

    const classStudents = students.filter(
      (s) => s.classId === subject.classId && s.sectionId === section.id
    )

    const now = new Date()
    const currentDay = daysOfWeek[now.getDay()]
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    const todayTimetable = timetables.find(
      (tt) => tt.classId === subject.classId && tt.sectionId === section.id && tt.dayOfWeek === currentDay
    )

    let nextClassTime = 'No more classes today'
    if (todayTimetable) {
      const upcomingPeriod = todayTimetable.periods.find(
        (p) => p.subjectId === subject.id && p.startTime > currentTime
      )
      if (upcomingPeriod) {
        nextClassTime = `Today at ${upcomingPeriod.startTime}`
      } else {
        const nextDayIndex = (now.getDay() + 1) % 7
        const nextDayName = daysOfWeek[nextDayIndex]
        const nextDayTimetable = timetables.find(
          (tt) => tt.classId === subject.classId && tt.sectionId === section.id && tt.dayOfWeek === nextDayName
        )
        if (nextDayTimetable) {
          const firstPeriod = nextDayTimetable.periods.find((p) => p.subjectId === subject.id)
          if (firstPeriod) {
            nextClassTime = `${nextDayName.charAt(0).toUpperCase() + nextDayName.slice(1)} at ${firstPeriod.startTime}`
          }
        }
      }
    }

    classCards.push({
      subject,
      class: cls,
      section,
      studentCount: classStudents.length,
      nextClassTime,
    })
  })

  return classCards
}

export default function TeacherClassesPage() {
  const { user } = useAuthStore()
  const currentTeacher = teachers.find((t) => t.id === user?.id) || teachers[0]
  const [selectedSubject, setSelectedSubject] = useState<string>('all')

  const allClasses = useMemo(() => getTeacherClasses(currentTeacher), [currentTeacher])

  const teacherSubjects = useMemo(
    () => subjects.filter((s) => s.teacherId === currentTeacher.id),
    []
  )

  const filteredClasses = useMemo(() => {
    if (selectedSubject === 'all') return allClasses
    return allClasses.filter((c) => c.subject.id === selectedSubject)
  }, [allClasses, selectedSubject])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Classes</h1>
          <p className="text-muted-foreground">Manage your classes and subjects</p>
        </div>
        <div className="w-full sm:w-64">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {teacherSubjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredClasses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium">No classes found</h3>
            <p className="text-muted-foreground">
              {selectedSubject === 'all'
                ? 'You are not assigned to any classes yet.'
                : 'No classes found for the selected subject.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((classCard) => (
            <Card key={`${classCard.subject.id}-${classCard.section.id}`} className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{classCard.subject.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Grade {classCard.class.grade} - Section {classCard.section.name}
                    </p>
                  </div>
                  <Badge variant="secondary">{classCard.subject.code}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {classCard.subject.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{classCard.studentCount} students</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="truncate max-w-[150px]">{classCard.nextClassTime}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <a href={`/teacher/attendance?classId=${classCard.class.id}&sectionId=${classCard.section.id}`}>
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
