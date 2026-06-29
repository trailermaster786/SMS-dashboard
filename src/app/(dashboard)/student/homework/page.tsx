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
  Send,
  CheckCircle,
  Clock,
  FileText,
  Upload,
  Search,
} from "lucide-react";
import {
  assignments,
  subjects,
  homeworkSubmissions,
  students,
} from "@/lib/mock-data";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

export default function StudentHomeworkPage() {
  const { user } = useAuthStore()
  const student = students.find((s) => s.id === user?.id) || students[0]
  const CURRENT_STUDENT_ID = student.id
  const CURRENT_CLASS_ID = student.classId
  const CURRENT_SECTION_ID = student.sectionId
  const [searchQuery, setSearchQuery] = useState("");
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [fileName, setFileName] = useState("");

  const pendingAssignments = useMemo(
    () =>
      assignments.filter(
        (a) =>
          a.classId === CURRENT_CLASS_ID &&
          a.sectionId === CURRENT_SECTION_ID &&
          a.status === "published"
      ),
    []
  );

  const mySubmissions = useMemo(
    () =>
      homeworkSubmissions.filter((s) => s.studentId === CURRENT_STUDENT_ID),
    []
  );

  const getSubjectName = (id: string) =>
    subjects.find((s) => s.id === id)?.name || "Unknown";

  const getSubmissionStatus = (assignmentId: string) =>
    mySubmissions.find((s) => s.assignmentId === assignmentId);

  const filteredAssignments = useMemo(() => {
    if (!searchQuery.trim()) return pendingAssignments;
    const q = searchQuery.toLowerCase();
    return pendingAssignments.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        getSubjectName(a.subjectId).toLowerCase().includes(q)
    );
  }, [searchQuery, pendingAssignments]);

  const handleSubmit = () => {
    if (!submissionText.trim()) {
      toast.error("Please enter your submission text");
      return;
    }
    toast.success("Homework submitted!", {
      description: "Your teacher will review it soon.",
    });
    setSubmitDialogOpen(false);
    setSubmissionText("");
    setFileName("");
    setSelectedAssignment(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Homework</h1>
        <p className="text-muted-foreground">
          View your assignments and submit homework
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
                <p className="text-sm text-muted-foreground">Total Assignments</p>
                <p className="text-2xl font-bold">{pendingAssignments.length}</p>
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
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="text-2xl font-bold">{mySubmissions.length}</p>
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
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {pendingAssignments.length - mySubmissions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Assignments
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              {filteredAssignments.length} assignments
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assignment</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map((assignment) => {
                const submission = getSubmissionStatus(assignment.id);
                return (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {assignment.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getSubjectName(assignment.subjectId)}</TableCell>
                    <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{assignment.totalMarks}</TableCell>
                    <TableCell>
                      {submission ? (
                        <Badge variant={submission.status === "graded" ? "success" : "default"}>
                          {submission.status === "graded"
                            ? `${submission.marks}/${submission.totalMarks}`
                            : submission.status}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not Submitted</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!submission ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedAssignment(assignment.id);
                            setSubmitDialogOpen(true);
                          }}
                        >
                          <Send className="mr-1 h-4 w-4" />
                          Submit
                        </Button>
                      ) : submission.status === "graded" ? (
                        <span className="text-sm text-muted-foreground">
                          {submission.feedback}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Awaiting review</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Homework</DialogTitle>
            <DialogDescription>
              Submit your work for the selected assignment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="submission-text">Your Answer *</Label>
              <Textarea
                id="submission-text"
                placeholder="Type your answer here..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-upload">Attach File (optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file-upload"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setFileName(file.name);
                  }}
                  className="flex-1"
                />
              </div>
              {fileName && (
                <p className="text-sm text-muted-foreground">
                  <FileText className="mr-1 inline h-4 w-4" />
                  {fileName}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Upload className="mr-2 h-4 w-4" />
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
