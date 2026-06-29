"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarDays, Video, MapPin, Plus } from "lucide-react";
import { meetings, students } from "@/lib/mock-data";
import { toast } from "sonner";

const currentParentId = "usr-parent-001";

export default function ParentMeetingsPage() {
  const parentChildren = useMemo(
    () => students.filter((s) => s.parentId === currentParentId),
    []
  );

  const childIds = useMemo(() => parentChildren.map((c) => c.id), [parentChildren]);

  const myMeetings = useMemo(
    () => meetings.filter((m) => m.parentId === currentParentId),
    []
  );

  const stats = useMemo(() => ({
    total: myMeetings.length,
    scheduled: myMeetings.filter((m) => m.status === "scheduled").length,
    completed: myMeetings.filter((m) => m.status === "completed").length,
  }), [myMeetings]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Parent-Teacher Meetings</h1>
          <p className="text-muted-foreground">View and schedule meetings with teachers</p>
        </div>
        <Button onClick={() => toast.info("Contact the school office to schedule a meeting.")}>
          <Plus className="mr-2 h-4 w-4" />
          Request Meeting
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
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30">
                <CalendarDays className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900/30">
                <CalendarDays className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myMeetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell className="font-medium">{meeting.teacherName}</TableCell>
                  <TableCell>{meeting.studentName}</TableCell>
                  <TableCell>{meeting.subject}</TableCell>
                  <TableCell>
                    <div>
                      <p>{new Date(meeting.date).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {meeting.startTime} - {meeting.endTime}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      {meeting.meetingType === "online" ? (
                        <Video className="h-3 w-3" />
                      ) : (
                        <MapPin className="h-3 w-3" />
                      )}
                      {meeting.meetingType === "online" ? "Online" : "In-Person"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        meeting.status === "completed"
                          ? "success"
                          : meeting.status === "scheduled"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {meeting.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
