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
import { Download, FileText, Users, CheckCircle, Clock } from 'lucide-react';
import { teachers } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const staffPayroll = teachers.map((t, idx) => ({
  id: `PAY-${String(idx + 1).padStart(4, '0')}`,
  name: t.name,
  role: t.specialization || 'Teacher',
  basic: t.salary,
  deductions: Math.round(t.salary * 0.15),
  netPay: Math.round(t.salary * 0.85),
  status: idx < 3 ? 'processed' : 'pending',
  month: 'June 2026',
}));

export default function AccountantPayrollPage() {
  const [selectedTab, setSelectedTab] = useState('current');
  const [processDialogOpen, setProcessDialogOpen] = useState(false);

  const totalBasic = staffPayroll.reduce((sum, s) => sum + s.basic, 0);
  const totalDeductions = staffPayroll.reduce((sum, s) => sum + s.deductions, 0);
  const totalNetPay = staffPayroll.reduce((sum, s) => sum + s.netPay, 0);
  const processedCount = staffPayroll.filter((s) => s.status === 'processed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payroll Processing</h1>
          <p className="text-muted-foreground">Manage staff payroll and generate payslips</p>
        </div>
        <Dialog open={processDialogOpen} onOpenChange={setProcessDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Process Payroll
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Process Payroll for June 2026</DialogTitle>
              <DialogDescription>
                This will process payroll for {staffPayroll.length} staff members.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Total Basic</p>
                  <p className="text-lg font-bold">${totalBasic.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Deductions</p>
                  <p className="text-lg font-bold text-red-600">-${totalDeductions.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Net Pay</p>
                  <p className="text-lg font-bold text-emerald-600">${totalNetPay.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setProcessDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setProcessDialogOpen(false)}>Confirm Processing</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{staffPayroll.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Basic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalBasic.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">${totalDeductions.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Pay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">${totalNetPay.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="current">Current Month</TabsTrigger>
          <TabsTrigger value="history">Payroll History</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Basic</TableHead>
                    <TableHead className="text-right">Deductions</TableHead>
                    <TableHead className="text-right">Net Pay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffPayroll.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell className="text-muted-foreground">{staff.role}</TableCell>
                      <TableCell className="text-right">${staff.basic.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-red-600">
                        ${staff.deductions.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-emerald-600">
                        ${staff.netPay.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={staff.status === 'processed' ? 'success' : 'warning'}>
                          {staff.status === 'processed' ? (
                            <><CheckCircle className="mr-1 h-3 w-3" /> Processed</>
                          ) : (
                            <><Clock className="mr-1 h-3 w-3" /> Pending</>
                          )}
                        </Badge>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-2 h-8 w-8 text-muted-foreground/50" />
              <p className="text-muted-foreground">Payroll history will appear here after processing.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
