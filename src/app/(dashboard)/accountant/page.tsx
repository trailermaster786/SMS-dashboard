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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { dashboardStats, payments, students, fees } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function AccountantDashboardPage() {
  const totalRevenue = dashboardStats.totalRevenue;
  const pendingFees = dashboardStats.pendingFees;
  const monthlyCollection = dashboardStats.monthlyRevenue[dashboardStats.monthlyRevenue.length - 1]?.amount || 0;
  const prevMonth = dashboardStats.monthlyRevenue[dashboardStats.monthlyRevenue.length - 2]?.amount || 0;
  const monthlyChange = prevMonth > 0 ? Math.round(((monthlyCollection - prevMonth) / prevMonth) * 100) : 0;

  const expenses = 45000;
  const netRevenue = totalRevenue - expenses;

  const classRevenue = [
    { class: 'Grade 8', amount: 320000 },
    { class: 'Grade 9', amount: 410000 },
    { class: 'Grade 10', amount: 520000 },
    { class: 'Grade 11', amount: 480000 },
    { class: 'Grade 12', amount: 440000 },
  ];

  const recentTransactions = payments.slice(0, 5);

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      'bank-transfer': 'Bank Transfer',
      online: 'Online',
      cash: 'Cash',
      card: 'Card',
      cheque: 'Cheque',
    };
    return labels[method] || method;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Accountant Dashboard</h1>
        <p className="text-muted-foreground">Financial overview and management</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-emerald-500">+12.5% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <CreditCard className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${pendingFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">7.5% of total revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${monthlyCollection.toLocaleString()}</div>
            <p className={cn('text-xs', monthlyChange >= 0 ? 'text-emerald-500' : 'text-red-500')}>
              {monthlyChange >= 0 ? '+' : ''}{monthlyChange}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${expenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Monthly expenses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardStats.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    name="Revenue"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fee Collection by Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classRevenue.map((cr) => {
                const maxAmount = Math.max(...classRevenue.map((c) => c.amount));
                const percentage = Math.round((cr.amount / maxAmount) * 100);
                return (
                  <div key={cr.class} className="flex items-center gap-4">
                    <span className="w-20 text-sm font-medium">{cr.class}</span>
                    <div className="flex-1">
                      <div className="h-3 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-24 text-right text-sm font-semibold">
                      ${cr.amount.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((tx) => {
                  const student = students.find((s) => s.id === tx.studentId);
                  return (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium">{tx.receiptNumber}</TableCell>
                      <TableCell>{student?.name || 'Unknown'}</TableCell>
                      <TableCell>{getPaymentMethodLabel(tx.paymentMethod)}</TableCell>
                      <TableCell className="text-right font-semibold text-emerald-600">
                        ${tx.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start gap-3" variant="outline">
              <Plus className="h-4 w-4" />
              Create Invoice
            </Button>
            <Button className="w-full justify-start gap-3" variant="outline">
              <Receipt className="h-4 w-4" />
              Record Payment
            </Button>
            <Button className="w-full justify-start gap-3" variant="outline">
              <CreditCard className="h-4 w-4" />
              Process Refund
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
