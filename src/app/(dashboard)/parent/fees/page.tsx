'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DollarSign,
  Download,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Receipt,
} from 'lucide-react';
import { students, fees, payments } from '@/lib/mock-data';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

export default function ParentFeesPage() {
  const { user } = useAuthStore()
  const parentChildren = students.filter(
    (s) => s.parentId === user?.id
  );
  const [selectedChildId, setSelectedChildId] = useState(parentChildren[0]?.id || '');

  const selectedChild = students.find((s) => s.id === selectedChildId);
  const childFees = fees.filter((f) => f.studentId === selectedChildId);
  const childPayments = payments.filter((p) => p.studentId === selectedChildId);

  const totalFee = childFees.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = childFees.filter((f) => f.status === 'paid').reduce((sum, f) => sum + f.paidAmount, 0);
  const totalPending = childFees.filter((f) => f.status === 'pending' || f.status === 'partial').reduce(
    (sum, f) => sum + (f.amount - f.paidAmount),
    0
  );
  const totalOverdue = childFees.filter((f) => f.status === 'overdue').reduce(
    (sum, f) => sum + (f.amount - f.paidAmount),
    0
  );

  const outstandingFees = childFees.filter((f) => f.status !== 'paid');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Paid</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'partial':
        return <Badge variant="outline">Partial</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fee Payment & History</h1>
          <p className="text-muted-foreground">Manage fees and view payment history</p>
        </div>
        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select child" />
          </SelectTrigger>
          <SelectContent>
            {parentChildren.map((child) => (
              <SelectItem key={child.id} value={child.id}>
                {child.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalFee.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current academic year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">${totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {totalFee > 0 ? Math.round((totalPaid / totalFee) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">${totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Due soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">${totalOverdue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {outstandingFees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Outstanding Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Due</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outstandingFees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell className="font-medium capitalize">{fee.feeType}</TableCell>
                    <TableCell className="text-muted-foreground">{fee.semester || '-'}</TableCell>
                    <TableCell className="text-right">${fee.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${fee.paidAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-semibold text-red-600">
                      ${(fee.amount - fee.paidAmount).toLocaleString()}
                    </TableCell>
                    <TableCell>{fee.dueDate}</TableCell>
                    <TableCell>{getStatusBadge(fee.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm">
                        <CreditCard className="mr-1 h-3 w-3" />
                        Pay
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payment History</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          {childPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Receipt className="mb-2 h-8 w-8 text-muted-foreground/50" />
              <p className="text-muted-foreground">No payment history available.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {childPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.receiptNumber}</TableCell>
                    <TableCell>{payment.paymentDate}</TableCell>
                    <TableCell>{getPaymentMethodLabel(payment.paymentMethod)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.transactionId || '-'}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-emerald-600">
                      ${payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
