"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarDays, Plus, Clock, MapPin } from "lucide-react";
import { examSchedules, subjects, classes, exams } from "@/lib/mock-data";
import { toast } from "sonner";

export default function ExamSchedulePage() {
  const [classFilter, setClassFilter] = useState<string>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    subjectId: "",
    classId: "",
    date: "",
    startTime: "",
    endTime: "",
    room: "",
    totalMarks: "100",
    passingMarks: "40",
    instructions: "",
  });

  const filteredSchedules = useMemo(() => {
    if (classFilter === "all") return examSchedules;
    return examSchedules.filter((s) => s.classId === classFilter);
  }, [classFilter]);

  const getSubjectName = (id: string) =>
    subjects.find((s) => s.id === id)?.name || "Unknown";

  const getClassName = (id: string) =>
    classes.find((c) => c.id === id)?.name || "Unknown";

  const getExamName = (id: string) =>
    exams.find((e) => e.id === id)?.name || "Unknown";

  const handleAdd = () => {
    if (!newSchedule.subjectId || !newSchedule.classId || !newSchedule.date) {
      toast.error("Please fill in required fields");
      return;
    }
    toast.success("Exam schedule added successfully!");
    setAddDialogOpen(false);
    setNewSchedule({
      subjectId: "",
      classId: "",
      date: "",
      startTime: "",
      endTime: "",
      room: "",
      totalMarks: "100",
      passingMarks: "40",
      instructions: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Exam Schedule</h1>
          <p className="text-muted-foreground">Manage examination schedules and timetables</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Schedule
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                <CalendarDays className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Exams</p>
                <p className="text-2xl font-bold">{examSchedules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900/30">
                <Clock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">
                  {examSchedules.filter(
                    (s) => new Date(s.date) >= new Date()
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30">
                <MapPin className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rooms Used</p>
                <p className="text-2xl font-bold">
                  {new Set(examSchedules.map((s) => s.room)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Schedule</CardTitle>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="all">All Classes</option>
              {classes.filter(c => c.grade >= 9).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Marks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">
                    {getExamName(schedule.examId)}
                  </TableCell>
                  <TableCell>{getSubjectName(schedule.subjectId)}</TableCell>
                  <TableCell>{getClassName(schedule.classId)}</TableCell>
                  <TableCell>{new Date(schedule.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {schedule.startTime} - {schedule.endTime}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{schedule.room}</Badge>
                  </TableCell>
                  <TableCell>
                    {schedule.totalMarks} ({schedule.passingMarks} pass)
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Exam Schedule</DialogTitle>
            <DialogDescription>Create a new exam schedule entry.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Select
                  value={newSchedule.subjectId}
                  onValueChange={(v) => setNewSchedule({ ...newSchedule, subjectId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name} ({s.code})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Class *</Label>
                <Select
                  value={newSchedule.classId}
                  onValueChange={(v) => setNewSchedule({ ...newSchedule, classId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.filter(c => c.grade >= 9).map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Date *</Label>
              <Input
                type="date"
                value={newSchedule.date}
                onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={newSchedule.startTime}
                  onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={newSchedule.endTime}
                  onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Room</Label>
                <Input
                  placeholder="e.g. Hall A"
                  value={newSchedule.room}
                  onChange={(e) => setNewSchedule({ ...newSchedule, room: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Total Marks</Label>
                <Input
                  type="number"
                  value={newSchedule.totalMarks}
                  onChange={(e) => setNewSchedule({ ...newSchedule, totalMarks: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Passing Marks</Label>
                <Input
                  type="number"
                  value={newSchedule.passingMarks}
                  onChange={(e) => setNewSchedule({ ...newSchedule, passingMarks: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Instructions</Label>
              <Textarea
                placeholder="Exam instructions..."
                value={newSchedule.instructions}
                onChange={(e) => setNewSchedule({ ...newSchedule, instructions: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
