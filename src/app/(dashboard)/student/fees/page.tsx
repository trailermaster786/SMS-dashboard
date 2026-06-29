'use client'

import { useMemo, useState } from 'react'
import {
  CreditCard,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { fees, payments, students } from '@/lib/mock-data'
import { useAuthStore } from '@/store/auth-store'

const feeTypeLabels: Record<string, string> = {
  tuition: 'Tuition Fee',
  exam: 'Exam Fee',
  library: 'Library Fee',
  transport: 'Transport Fee',
  lab: 'Lab Fee',
  activity: 'Activity Fee',
  other: 'Other Fee',
}

const paymentMethodLabels: Record<string, string> = {
  cash: 'Cash',
  card: 'Card',
  'bank-transfer': 'Bank Transfer',
  online: 'Online',
  cheque: 'Cheque',
}

export default function FeesPage() {
  const { user } = useAuthStore()
  const student = students.find((s) => s.id === user?.id) || students[0]
  const CURRENT_STUDENT_ID = student.id
  const [payDialogOpen, setPayDialogOpen] = useState(false)
  const [selectedFeeId, setSelectedFeeId] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [paid, setPaid] = useState<Set<string>>(new Set())

  const studentFees = useMemo(
    () => fees.filter((f) => f.studentId === CURRENT_STUDENT_ID),
    []
  )

  const studentPayments = useMemo(
    () => payments.filter((p) => p.studentId === CURRENT_STUDENT_ID),
    []
  )

  const totalAmount = useMemo(
    () => studentFees.reduce((sum, f) => sum + f.amount, 0),
    [studentFees]
  )

  const totalPaid = useMemo(
    () => studentFees.reduce((sum, f) => sum + f.paidAmount, 0),
    [studentFees]
  )

  const totalPending = totalAmount - totalPaid

  const effectivePaid = useMemo(() => {
    let extra = 0
    paid.forEach((feeId) => {
      const fee = studentFees.find((f) => f.id === feeId)
      if (fee && fee.status !== 'paid') {
        extra += fee.amount - fee.paidAmount
      }
    })
    return totalPaid + extra
  }, [totalPaid, paid, studentFees])

  const selectedFee = selectedFeeId ? studentFees.find((f) => f.id === selectedFeeId) : null

  const handlePay = () => {
    if (!selectedFeeId) return
    setProcessing(true)
    setTimeout(() => {
      setPaid((prev) => new Set(prev).add(selectedFeeId))
      setProcessing(false)
      setPayDialogOpen(false)
      setSelectedFeeId(null)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fee Status</h1>
          <p className="text-muted-foreground">
            View and manage your fee payments.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Fees
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paid
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              ${effectivePaid.toLocaleString()}
            </div>
            <Progress
              value={totalAmount > 0 ? (effectivePaid / totalAmount) * 100 : 0}
              className="mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              ${(totalAmount - effectivePaid).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="records">
        <TabsList>
          <TabsTrigger value="records">
            <CreditCard className="mr-1 h-4 w-4" />
            Fee Records
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="mr-1 h-4 w-4" />
            Payment History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fee Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fee Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Paid Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentFees.map((fee) => {
                    const isPaid = fee.status === 'paid' || paid.has(fee.id)
                    const dueDate = new Date(fee.dueDate)
                    const isOverdue =
                      !isPaid && dueDate < new Date()
                    return (
                      <TableRow key={fee.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {feeTypeLabels[fee.feeType] || fee.feeType}
                            </p>
                            {fee.semester && (
                              <p className="text-sm text-muted-foreground">
                                {fee.semester} &middot; {fee.academicYear}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          ${fee.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className={isOverdue ? 'text-destructive' : ''}>
                            {dueDate.toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              isPaid
                                ? 'success'
                                : isOverdue
                                ? 'destructive'
                                : fee.status === 'partial'
                                ? 'warning'
                                : 'secondary'
                            }
                          >
                            {isPaid ? 'Paid' : fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {isPaid ? (
                            paid.has(fee.id) ? (
                              new Date().toLocaleDateString()
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isPaid ? (
                            <Button size="sm" variant="outline">
                              <Download className="mr-1 h-3 w-3" />
                              Receipt
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedFeeId(fee.id)
                                setPayDialogOpen(true)
                              }}
                            >
                              Pay Now
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {studentPayments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Receipt</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {payment.receiptNumber}
                        </TableCell>
                        <TableCell>${payment.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {paymentMethodLabels[payment.paymentMethod]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {payment.transactionId || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline">
                            <Download className="mr-1 h-3 w-3" />
                            Receipt
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Clock className="mb-3 h-12 w-12 text-muted-foreground/40" />
                  <p className="text-lg font-medium">No payment history</p>
                  <p className="text-sm text-muted-foreground">
                    Your payment records will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              You are about to make a payment for this fee.
            </DialogDescription>
          </DialogHeader>
          {selectedFee && (
            <div className="space-y-3">
              <div className="rounded-lg border p-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Fee Type:</span>
                  <span className="font-medium">
                    {feeTypeLabels[selectedFee.feeType]}
                  </span>
                  <span className="text-muted-foreground">Amount Due:</span>
                  <span className="font-bold text-lg">
                    ${(selectedFee.amount - selectedFee.paidAmount).toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">Due Date:</span>
                  <span>{new Date(selectedFee.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                This is a simulated payment. No real transaction will be processed.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPayDialogOpen(false)
                setSelectedFeeId(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handlePay} disabled={processing}>
              {processing ? 'Processing...' : 'Confirm Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
