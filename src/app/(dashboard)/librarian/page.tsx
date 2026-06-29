'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BookOpen, BookX, Clock, Plus, ArrowRight, AlertTriangle, Star } from 'lucide-react';
import { libraryBooks, libraryIssues, students } from '@/lib/mock-data';

export default function LibrarianDashboardPage() {
  const totalBooks = libraryBooks.reduce((sum, b) => sum + b.totalCopies, 0);
  const totalIssued = libraryIssues.filter((i) => i.status === 'issued').length;
  const totalAvailable = libraryBooks.reduce((sum, b) => sum + b.availableCopies, 0);
  const totalOverdue = libraryIssues.filter((i) => i.status === 'overdue').length;
  const totalFines = libraryIssues.filter((i) => i.fine).reduce((sum, i) => sum + (i.fine || 0), 0);

  const recentIssues = libraryIssues.slice(-5).reverse();

  const popularBooks = libraryBooks
    .map((book) => {
      const issueCount = libraryIssues.filter((i) => i.bookId === book.id).length;
      return { ...book, issueCount };
    })
    .sort((a, b) => b.issueCount - a.issueCount)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Librarian Dashboard</h1>
        <p className="text-muted-foreground">Library management overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalBooks}</div>
            <p className="text-xs text-muted-foreground">{libraryBooks.length} titles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Issued</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalIssued}</div>
            <p className="text-xs text-muted-foreground">Currently borrowed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <BookOpen className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAvailable}</div>
            <p className="text-xs text-muted-foreground">Ready to issue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{totalOverdue}</div>
            <p className="text-xs text-muted-foreground">${totalFines} in fines</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Issues & Returns</CardTitle>
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Book</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentIssues.map((issue) => {
                  const book = libraryBooks.find((b) => b.id === issue.bookId);
                  const student = students.find((s) => s.id === issue.userId);
                  return (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium">{student?.name || 'Unknown'}</TableCell>
                      <TableCell className="text-muted-foreground">{book?.title || 'Unknown'}</TableCell>
                      <TableCell>
                        <Badge variant={issue.status === 'returned' ? 'success' : issue.status === 'overdue' ? 'destructive' : 'warning'}>
                          {issue.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{issue.issueDate}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularBooks.map((book, idx) => (
                <div key={book.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{book.issueCount} issues</p>
                    <p className="text-xs text-muted-foreground">{book.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fine Collection Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Fine Collected</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">${totalFines}</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-sm text-muted-foreground">Pending Fines</p>
              <p className="mt-1 text-2xl font-bold text-amber-600">$50</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-sm text-muted-foreground">Overdue Books</p>
              <p className="mt-1 text-2xl font-bold text-red-600">{totalOverdue}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Button variant="outline" className="h-auto justify-start gap-3 p-4">
          <Plus className="h-5 w-5 text-blue-500" />
          <div className="text-left">
            <p className="font-medium">Add Book</p>
            <p className="text-xs text-muted-foreground">Add new book to catalog</p>
          </div>
        </Button>
        <Button variant="outline" className="h-auto justify-start gap-3 p-4">
          <BookOpen className="h-5 w-5 text-emerald-500" />
          <div className="text-left">
            <p className="font-medium">Issue Book</p>
            <p className="text-xs text-muted-foreground">Issue book to student</p>
          </div>
        </Button>
        <Button variant="outline" className="h-auto justify-start gap-3 p-4">
          <BookX className="h-5 w-5 text-amber-500" />
          <div className="text-left">
            <p className="font-medium">Return Book</p>
            <p className="text-xs text-muted-foreground">Process book return</p>
          </div>
        </Button>
      </div>
    </div>
  );
}
