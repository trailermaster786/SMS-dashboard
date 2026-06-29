"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  FileText,
  Star,
} from "lucide-react";
import {
  assignments,
  subjects,
  homeworkSubmissions,
} from "@/lib/mock-data";
import { toast } from "sonner";

export default function TeacherHomeworkPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");

  const myAssignments = useMemo(
    () => assignments.filter((a) => a.status === "published"),
    []
  );

  const allSubmissions = useMemo(() => homeworkSubmissions, []);

  const getSubjectName = (id: string) =>
    subjects.find((s) => s.id === id)?.name || "Unknown";

  const filteredSubmissions = useMemo(() => {
    const subs = allSubmissions;
    if (!searchQuery.trim()) return subs;
    const q = searchQuery.toLowerCase();
    return subs.filter(
      (s) =>
        s.studentName.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q)
    );
  }, [searchQuery, allSubmissions]);

  const handleGrade = () => {
    if (!grade.trim()) {
      toast.error("Please enter marks");
      return;
    }
    toast.success("Graded successfully!");
    setGradeDialogOpen(false);
    setGrade("");
    setFeedback("");
    setSelectedSubmission(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Homework Management</h1>
        <p className="text-muted-foreground">
          Review and grade student submissions
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                <ClipboardList className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">My Assignments</p>
                <p className="text-2xl font-bold">{myAssignments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900/30">
                <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Graded</p>
                <p className="text-2xl font-bold">
                  {allSubmissions.filter((s) => s.status === "graded").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">
                  {allSubmissions.filter((s) => s.status === "submitted").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Student Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Input
                placeholder="Search submissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => {
                const assignment = assignments.find(
                  (a) => a.id === submission.assignmentId
                );
                return (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <p className="font-medium">{submission.studentName}</p>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{assignment?.title || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">
                          {getSubjectName(submission.subjectId)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          submission.status === "graded"
                            ? "success"
                            : submission.status === "returned"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {submission.status === "graded"
                          ? `${submission.marks}/${submission.totalMarks}`
                          : submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {submission.status === "submitted" ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedSubmission(submission.id);
                            setGradeDialogOpen(true);
                          }}
                        >
                          <Star className="mr-1 h-4 w-4" />
                          Grade
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {submission.feedback || "No feedback"}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
            <DialogDescription>
              Review the student&apos;s work and provide marks and feedback.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedSubmission && (
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Submission:</p>
                <p className="mt-1">
                  {allSubmissions.find((s) => s.id === selectedSubmission)?.content}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="grade">Marks *</Label>
              <Input
                id="grade"
                type="number"
                placeholder="Enter marks"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Provide feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGradeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGrade}>Submit Grade</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
