'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { libraryIssues, libraryBooks, students } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function LibrarianFinesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const fines = libraryIssues
    .filter((i) => i.fine || i.status === 'overdue')
    .map((issue) => {
      const student = students.find((s) => s.id === issue.userId);
      const book = libraryBooks.find((b) => b.id === issue.bookId);
      const today = new Date('2026-06-27');
      const due = new Date(issue.dueDate);
      const daysOverdue = Math.max(0, Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)));
      const fine = issue.fine || daysOverdue * 2;
      return {
        ...issue,
        studentName: student?.name || 'Unknown',
        bookTitle: book?.title || 'Unknown',
        daysOverdue,
        fine,
        isCollected: issue.status === 'returned',
      };
    });

  const filteredFines = fines.filter(
    (f) =>
      f.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFines = fines.reduce((sum, f) => sum + f.fine, 0);
  const collectedFines = fines.filter((f) => f.isCollected).reduce((sum, f) => sum + f.fine, 0);
  const outstandingFines = totalFines - collectedFines;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fine Management</h1>
        <p className="text-muted-foreground">Track and collect library fines</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalFines}</div>
            <p className="text-xs text-muted-foreground">{fines.length} fines total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Collected</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">${collectedFines}</div>
            <p className="text-xs text-muted-foreground">Successfully collected</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">${outstandingFines}</div>
            <p className="text-xs text-muted-foreground">Pending collection</p>
          </CardContent>
        </Card>
      </div>

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

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Book</TableHead>
                <TableHead className="text-center">Days Overdue</TableHead>
                <TableHead className="text-right">Fine Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No fines found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredFines.map((fine) => (
                  <TableRow key={fine.id}>
                    <TableCell className="font-medium">{fine.studentName}</TableCell>
                    <TableCell>{fine.bookTitle}</TableCell>
                    <TableCell className="text-center">
                      <span className={cn('font-semibold', fine.daysOverdue > 0 ? 'text-red-600' : 'text-muted-foreground')}>
                        {fine.daysOverdue}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-bold text-red-600">
                      ${fine.fine}
                    </TableCell>
                    <TableCell>
                      <Badge variant={fine.isCollected ? 'success' : 'destructive'}>
                        {fine.isCollected ? 'Collected' : 'Outstanding'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {!fine.isCollected && (
                        <Button size="sm">
                          <DollarSign className="mr-1 h-3 w-3" />
                          Collect
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
