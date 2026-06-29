'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Search, CheckCircle, XCircle, RefreshCw, Eye } from 'lucide-react';
import { payments, students } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const paymentMethods = ['all', 'bank-transfer', 'online', 'cash', 'card', 'cheque'];
const reconciliationStatuses = ['all', 'reconciled', 'pending', 'mismatched'];

export default function AccountantPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);

  const paymentData = payments.map((p, idx) => ({
    ...p,
    invoiceNumber: `INV-${String(idx + 1).padStart(4, '0')}`,
    gatewayRef: p.transactionId || `GW-${p.id.toUpperCase()}`,
    reconcileStatus: idx % 5 === 0 ? 'pending' : idx % 7 === 0 ? 'mismatched' : 'reconciled',
  }));

  const filteredPayments = paymentData.filter((p) => {
    const student = students.find((s) => s.id === p.studentId);
    const matchesSearch =
      student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.gatewayRef.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = methodFilter === 'all' || p.paymentMethod === methodFilter;
    const matchesStatus = statusFilter === 'all' || p.reconcileStatus === statusFilter;
    return matchesSearch && matchesMethod && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'reconciled':
        return <Badge variant="success">Reconciled</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'mismatched':
        return <Badge variant="destructive">Mismatched</Badge>;
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payment Gateway Reconciliation</h1>
        <p className="text-muted-foreground">Match and reconcile payment gateway transactions</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reconciled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {paymentData.filter((p) => p.reconcileStatus === 'reconciled').length}
            </div>
            <p className="text-xs text-muted-foreground">Matched successfully</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending/Mismatched</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {paymentData.filter((p) => p.reconcileStatus !== 'reconciled').length}
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by receipt, gateway ref, or student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m === 'all' ? 'All Methods' : getPaymentMethodLabel(m)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {reconciliationStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Receipt #</TableHead>
                <TableHead>Gateway Ref</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Reconciliation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    No payments found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((p) => {
                  const student = students.find((s) => s.id === p.studentId);
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.id.toUpperCase()}</TableCell>
                      <TableCell>{student?.name || 'Unknown'}</TableCell>
                      <TableCell>{p.receiptNumber}</TableCell>
                      <TableCell className="font-mono text-xs">{p.gatewayRef}</TableCell>
                      <TableCell>{getPaymentMethodLabel(p.paymentMethod)}</TableCell>
                      <TableCell className="text-right font-semibold">${p.amount.toLocaleString()}</TableCell>
                      <TableCell>{p.paymentDate}</TableCell>
                      <TableCell>{getStatusBadge(p.reconcileStatus)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {p.reconcileStatus !== 'reconciled' && (
                            <Button variant="ghost" size="sm" onClick={() => setMatchDialogOpen(true)}>
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={matchDialogOpen} onOpenChange={setMatchDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Match Payment</DialogTitle>
            <DialogDescription>
              Match this payment with the gateway transaction to reconcile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Payment ID</p>
              <p className="font-semibold">PAY-001</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Gateway Reference</p>
              <p className="font-semibold">TXN-20260110-001</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-semibold">$15,000</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMatchDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setMatchDialogOpen(false)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm Match
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
