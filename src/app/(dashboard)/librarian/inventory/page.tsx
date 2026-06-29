'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { BookOpen, AlertTriangle, Package } from 'lucide-react';
import { libraryBooks, libraryIssues } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function LibrarianInventoryPage() {
  const categorySummary = useMemo(() => {
    const map: Record<string, { total: number; available: number; issued: number; damaged: number }> = {};
    libraryBooks.forEach((book) => {
      if (!map[book.category]) {
        map[book.category] = { total: 0, available: 0, issued: 0, damaged: 0 };
      }
      map[book.category].total += book.totalCopies;
      map[book.category].available += book.availableCopies;
      const issuedCount = libraryIssues.filter(
        (i) => i.bookId === book.id && (i.status === 'issued' || i.status === 'overdue')
      ).length;
      map[book.category].issued += issuedCount;
      map[book.category].damaged += Math.max(0, book.totalCopies - book.availableCopies - issuedCount);
    });
    return Object.entries(map).map(([category, data]) => ({
      category,
      ...data,
    }));
  }, []);

  const totalBooks = libraryBooks.reduce((sum, b) => sum + b.totalCopies, 0);
  const totalAvailable = libraryBooks.reduce((sum, b) => sum + b.availableCopies, 0);
  const totalIssued = libraryIssues.filter((i) => i.status === 'issued' || i.status === 'overdue').length;
  const totalDamaged = totalBooks - totalAvailable - totalIssued;

  const stockLevels = libraryBooks.map((book) => ({
    title: book.title.length > 20 ? book.title.slice(0, 20) + '...' : book.title,
    total: book.totalCopies,
    available: book.availableCopies,
    issued: book.totalCopies - book.availableCopies,
  }));

  const acquisitionRequests = [
    { id: 'REQ-001', title: 'Machine Learning Basics', author: 'Ian Goodfellow', copies: 3, status: 'pending', requestedBy: 'Science Dept' },
    { id: 'REQ-002', title: 'Advanced Calculus', author: 'Michael Spivak', copies: 2, status: 'approved', requestedBy: 'Math Dept' },
    { id: 'REQ-003', title: 'Modern Poetry Anthology', author: 'Various', copies: 5, status: 'pending', requestedBy: 'English Dept' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inventory Reports</h1>
        <p className="text-muted-foreground">Library inventory summary and stock levels</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalBooks}</div>
            <p className="text-xs text-muted-foreground">{libraryBooks.length} titles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <BookOpen className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAvailable}</div>
            <p className="text-xs text-muted-foreground">{Math.round((totalAvailable / totalBooks) * 100)}% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">On Loan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalIssued}</div>
            <p className="text-xs text-muted-foreground">Currently issued</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Damaged/Lost</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{Math.max(0, totalDamaged)}</div>
            <p className="text-xs text-muted-foreground">Requires replacement</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorySummary}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="category" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="available" name="Available" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="issued" name="Issued" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="damaged" name="Damaged/Lost" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Available</TableHead>
                  <TableHead className="text-center">Issued</TableHead>
                  <TableHead className="text-center">Damaged</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categorySummary.map((cat) => (
                  <TableRow key={cat.category}>
                    <TableCell className="font-medium">{cat.category}</TableCell>
                    <TableCell className="text-center">{cat.total}</TableCell>
                    <TableCell className="text-center text-emerald-600">{cat.available}</TableCell>
                    <TableCell className="text-center text-amber-600">{cat.issued}</TableCell>
                    <TableCell className="text-center text-red-600">{cat.damaged}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Levels by Book</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stockLevels.map((book, idx) => (
              <div key={idx} className="flex items-center gap-4 rounded-lg border p-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{book.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {book.available} of {book.total} available
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: `${(book.available / book.total) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs font-semibold">
                    {Math.round((book.available / book.total) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acquisition Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-center">Copies</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {acquisitionRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-mono text-xs">{req.id}</TableCell>
                  <TableCell className="font-medium">{req.title}</TableCell>
                  <TableCell className="text-muted-foreground">{req.author}</TableCell>
                  <TableCell className="text-center">{req.copies}</TableCell>
                  <TableCell>{req.requestedBy}</TableCell>
                  <TableCell>
                    <Badge variant={req.status === 'approved' ? 'success' : 'warning'}>
                      {req.status}
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
