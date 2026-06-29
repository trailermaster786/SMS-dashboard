'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Plus, TrendingDown, DollarSign } from 'lucide-react';

const expenseCategories = [
  { category: 'Salaries', amount: 125000, color: '#3b82f6' },
  { category: 'Utilities', amount: 15000, color: '#10b981' },
  { category: 'Maintenance', amount: 12000, color: '#f59e0b' },
  { category: 'Supplies', amount: 8000, color: '#8b5cf6' },
  { category: 'Transport', amount: 18000, color: '#ef4444' },
  { category: 'Events', amount: 7000, color: '#06b6d4' },
];

const expenseList = [
  { id: 'EXP-001', category: 'Salaries', description: 'June 2026 Staff Salaries', amount: 125000, date: '2026-06-28', status: 'approved' },
  { id: 'EXP-002', category: 'Utilities', description: 'Electricity Bill - June', amount: 8500, date: '2026-06-25', status: 'approved' },
  { id: 'EXP-003', category: 'Utilities', description: 'Water Bill - June', amount: 3200, date: '2026-06-25', status: 'approved' },
  { id: 'EXP-004', category: 'Maintenance', description: 'AC Repair - Admin Block', amount: 4500, date: '2026-06-22', status: 'approved' },
  { id: 'EXP-005', category: 'Supplies', description: 'Office Supplies Order', amount: 2800, date: '2026-06-20', status: 'pending' },
  { id: 'EXP-006', category: 'Transport', description: 'Bus Fuel - June', amount: 12000, date: '2026-06-18', status: 'approved' },
  { id: 'EXP-007', category: 'Events', description: 'Annual Day Preparations', amount: 7000, date: '2026-06-15', status: 'pending' },
  { id: 'EXP-008', category: 'Maintenance', description: 'Plumbing Repair', amount: 7500, date: '2026-06-12', status: 'approved' },
];

const monthData = [
  { month: 'Jan', expenses: 42000 },
  { month: 'Feb', expenses: 38000 },
  { month: 'Mar', expenses: 45000 },
  { month: 'Apr', expenses: 41000 },
  { month: 'May', expenses: 48000 },
  { month: 'Jun', expenses: 45000 },
];

export default function AccountantExpensesPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const totalExpenses = expenseList.reduce((sum, e) => sum + e.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expense Tracking</h1>
          <p className="text-muted-foreground">Track and manage school expenses</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>Record a new expense entry.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Salaries', 'Utilities', 'Maintenance', 'Supplies', 'Transport', 'Events'].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Enter description" />
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input type="number" placeholder="Enter amount" />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setAddDialogOpen(false)}>Add Expense</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses (June)</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${totalExpenses.toLocaleString()}</div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="amount"
                    nameKey="category"
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Expense Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenseList.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-mono text-xs">{expense.id}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell className="text-right font-semibold">${expense.amount.toLocaleString()}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{getStatusBadge(expense.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
