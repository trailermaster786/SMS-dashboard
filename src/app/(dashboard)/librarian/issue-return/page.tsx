'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookX, Search, AlertTriangle, Clock } from 'lucide-react';
import { libraryBooks, libraryIssues, students } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function LibrarianIssueReturnPage() {
  const [selectedTab, setSelectedTab] = useState('active');
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeIssues = libraryIssues.filter((i) => i.status === 'issued' || i.status === 'overdue');
  const returnedIssues = libraryIssues.filter((i) => i.status === 'returned');
  const overdueIssues = libraryIssues.filter((i) => i.status === 'overdue');

  const filteredIssues = (selectedTab === 'active' ? activeIssues : returnedIssues).filter((issue) => {
    const student = students.find((s) => s.id === issue.userId);
    const book = libraryBooks.find((b) => b.id === issue.bookId);
    return (
      student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book?.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const calculateFine = (dueDate: string) => {
    const today = new Date('2026-06-27');
    const due = new Date(dueDate);
    const diffDays = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * 2 : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Issue/Return Tracking</h1>
          <p className="text-muted-foreground">Manage book issues and returns</p>
        </div>
        <Dialog open={issueDialogOpen} onOpenChange={setIssueDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Issue Book
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Issue Book</DialogTitle>
              <DialogDescription>Select a student and book to issue.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Student</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.studentId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Book</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select book" />
                  </SelectTrigger>
                  <SelectContent>
                    {libraryBooks
                      .filter((b) => b.availableCopies > 0)
                      .map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.title} (Available: {b.availableCopies})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIssueDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIssueDialogOpen(false)}>Issue Book</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {overdueIssues.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div>
              <p className="font-medium text-red-700">{overdueIssues.length} Overdue Book(s)</p>
              <p className="text-sm text-red-600">
                These books are past their due date. Fine of $2/day applies.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by student or book..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="active">
            Active Issues ({activeIssues.length})
          </TabsTrigger>
          <TabsTrigger value="returned">
            Returned ({returnedIssues.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Book</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Fine</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIssues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        No active issues found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredIssues.map((issue) => {
                      const student = students.find((s) => s.id === issue.userId);
                      const book = libraryBooks.find((b) => b.id === issue.bookId);
                      const fine = issue.fine || (issue.status === 'overdue' ? calculateFine(issue.dueDate) : 0);
                      return (
                        <TableRow key={issue.id}>
                          <TableCell className="font-medium">{student?.name || 'Unknown'}</TableCell>
                          <TableCell>{book?.title || 'Unknown'}</TableCell>
                          <TableCell>{issue.issueDate}</TableCell>
                          <TableCell>{issue.dueDate}</TableCell>
                          <TableCell>
                            <Badge variant={issue.status === 'overdue' ? 'destructive' : 'warning'}>
                              {issue.status === 'overdue' && <Clock className="mr-1 h-3 w-3" />}
                              {issue.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-red-600">
                            {fine > 0 ? `$${fine}` : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm">
                              <BookX className="mr-1 h-3 w-3" />
                              Return
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returned" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Book</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Fine</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIssues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        No returned books found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredIssues.map((issue) => {
                      const student = students.find((s) => s.id === issue.userId);
                      const book = libraryBooks.find((b) => b.id === issue.bookId);
                      return (
                        <TableRow key={issue.id}>
                          <TableCell className="font-medium">{student?.name || 'Unknown'}</TableCell>
                          <TableCell>{book?.title || 'Unknown'}</TableCell>
                          <TableCell>{issue.issueDate}</TableCell>
                          <TableCell>{issue.returnDate}</TableCell>
                          <TableCell>{issue.dueDate}</TableCell>
                          <TableCell className="text-right">
                            {issue.fine ? (
                              <span className="font-semibold text-red-600">${issue.fine}</span>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
