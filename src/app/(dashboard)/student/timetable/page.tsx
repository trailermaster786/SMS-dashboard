'use client'

import { useMemo } from 'react'
import { Calendar, Clock, MapPin, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { timetables, subjects, teachers, students } from '@/lib/mock-data'
import { useAuthStore } from '@/store/auth-store'

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const
const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const periods = [1, 2, 3, 4, 5, 6]

const today = new Date()
const dayIndex = today.getDay()
const todayName = dayIndex >= 1 && dayIndex <= 5 ? days[dayIndex - 1] : null

const subjectColors: Record<string, string> = {
  'sub-math-10': 'bg-blue-100 border-blue-300 text-blue-900',
  'sub-phys-10': 'bg-purple-100 border-purple-300 text-purple-900',
  'sub-eng-10': 'bg-emerald-100 border-emerald-300 text-emerald-900',
  'sub-hist-10': 'bg-amber-100 border-amber-300 text-amber-900',
  'sub-chem-10': 'bg-rose-100 border-rose-300 text-rose-900',
  'sub-bio-10': 'bg-teal-100 border-teal-300 text-teal-900',
}

const subjectTextColors: Record<string, string> = {
  'sub-math-10': 'text-blue-700',
  'sub-phys-10': 'text-purple-700',
  'sub-eng-10': 'text-emerald-700',
  'sub-hist-10': 'text-amber-700',
  'sub-chem-10': 'text-rose-700',
  'sub-bio-10': 'text-teal-700',
}

export default function TimetablePage() {
  const { user } = useAuthStore()
  const student = students.find((s) => s.id === user?.id) || students[0]
  const CURRENT_CLASS_ID = student.classId
  const CURRENT_SECTION_ID = student.sectionId

  const timetableData = useMemo(() => {
    const map: Record<string, Record<number, (typeof timetables)[0]['periods'][0] | null>> = {}
    days.forEach((day) => {
      map[day] = {}
      periods.forEach((p) => {
        map[day][p] = null
      })
    })
    timetables
      .filter((t) => t.classId === CURRENT_CLASS_ID && t.sectionId === CURRENT_SECTION_ID)
      .forEach((t) => {
        t.periods.forEach((p) => {
          if (map[t.dayOfWeek]) {
            map[t.dayOfWeek][p.periodNumber] = p
          }
        })
      })
    return map
  }, [])

  const getSubjectName = (id: string) => subjects.find((s) => s.id === id)?.name || 'Unknown'
  const getTeacherName = (id: string) => teachers.find((t) => t.id === id)?.name || 'Unknown'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Class Timetable</h1>
          <p className="text-muted-foreground">
            Grade 10-A &middot; Weekly Schedule
          </p>
        </div>
        {todayName && (
          <Badge variant="default" className="gap-1">
            <Calendar className="h-3 w-3" />
            Today: {dayLabels[days.indexOf(todayName)]}
          </Badge>
        )}
      </div>

      <div className="hidden lg:block">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground w-24">
                      Period
                    </th>
                    {days.map((day, i) => (
                      <th
                        key={day}
                        className={`p-3 text-center text-sm font-medium ${
                          todayName === day
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span>{dayLabels[i]}</span>
                          {todayName === day && (
                            <Badge variant="default" className="text-[10px] px-1.5 py-0">
                              TODAY
                            </Badge>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periods.map((period) => (
                    <tr key={period} className="border-b last:border-0">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs font-bold">
                            P{period}
                          </div>
                        </div>
                      </td>
                      {days.map((day) => {
                        const periodData = timetableData[day]?.[period]
                        const isToday = todayName === day
                        return (
                          <td
                            key={day}
                            className={`p-2 ${isToday ? 'bg-primary/5' : ''}`}
                          >
                            {periodData ? (
                              <div
                                className={`rounded-lg border p-2.5 ${
                                  subjectColors[periodData.subjectId] ||
                                  'bg-gray-100 border-gray-300'
                                } ${isToday ? 'ring-2 ring-primary/30' : ''}`}
                              >
                                <p className="text-sm font-semibold leading-tight">
                                  {getSubjectName(periodData.subjectId)}
                                </p>
                                <div className="mt-1 flex items-center gap-1 text-xs opacity-80">
                                  <User className="h-3 w-3" />
                                  <span>{getTeacherName(periodData.teacherId)}</span>
                                </div>
                                <div className="mt-0.5 flex items-center gap-1 text-xs opacity-80">
                                  <MapPin className="h-3 w-3" />
                                  <span>{periodData.room}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex h-full min-h-[70px] items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
                                -
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 lg:hidden">
        {days.map((day, dayIndex) => (
          <Card key={day} className={todayName === day ? 'ring-2 ring-primary' : ''}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>{dayLabels[dayIndex]}</span>
                {todayName === day && (
                  <Badge variant="default" className="text-xs">
                    TODAY
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {periods.map((period) => {
                const periodData = timetableData[day]?.[period]
                return (
                  <div key={period} className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-muted text-xs font-bold">
                      P{period}
                    </div>
                    {periodData ? (
                      <div
                        className={`flex-1 rounded-lg border p-2.5 ${
                          subjectColors[periodData.subjectId] ||
                          'bg-gray-100 border-gray-300'
                        }`}
                      >
                        <p className="text-sm font-semibold">
                          {getSubjectName(periodData.subjectId)}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs opacity-80">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {getTeacherName(periodData.teacherId)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {periodData.room}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {periodData.startTime} - {periodData.endTime}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 rounded-lg border border-dashed p-2.5 text-center text-xs text-muted-foreground">
                        Free Period
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
