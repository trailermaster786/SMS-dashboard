"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, CheckCircle, Shield, Lock } from "lucide-react";
import { fees } from "@/lib/mock-data";
import { toast } from "sonner";

const CURRENT_STUDENT_ID = "usr-student-001";

export default function PaymentPage() {
  const [selectedFee, setSelectedFee] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processingDialogOpen, setProcessingDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const pendingFees = fees.filter(
    (f) =>
      f.studentId === CURRENT_STUDENT_ID &&
      (f.status === "pending" || f.status === "partial" || f.status === "overdue")
  );

  const selectedFeeData = pendingFees.find((f) => f.id === selectedFee);
  const remainingAmount = selectedFeeData
    ? selectedFeeData.amount - selectedFeeData.paidAmount
    : 0;

  const handlePayment = () => {
    if (!selectedFee || !paymentMethod) {
      toast.error("Please select a fee and payment method");
      return;
    }
    if (paymentMethod === "card" && (!cardNumber || !expiry || !cvv)) {
      toast.error("Please fill in card details");
      return;
    }
    setProcessingDialogOpen(true);
    setTimeout(() => {
      setProcessingDialogOpen(false);
      setSuccessDialogOpen(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Online Fee Payment</h1>
        <p className="text-muted-foreground">Pay your school fees securely online</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Select Fee to Pay
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingFees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="mb-3 h-12 w-12 text-emerald-500" />
                <p className="text-lg font-medium">All fees are paid!</p>
                <p className="text-sm text-muted-foreground">No pending fees found.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingFees.map((fee) => (
                  <div
                    key={fee.id}
                    className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                      selectedFee === fee.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedFee(fee.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium capitalize">{fee.feeType} Fee</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(fee.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          ${fee.amount - fee.paidAmount}
                        </p>
                        {fee.paidAmount > 0 && (
                          <p className="text-xs text-muted-foreground">
                            ${fee.paidAmount} paid of ${fee.amount}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={
                        fee.status === "overdue"
                          ? "destructive"
                          : fee.status === "partial"
                          ? "warning"
                          : "default"
                      }
                      className="mt-2"
                    >
                      {fee.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedFee ? (
              <div className="flex flex-col items-center justify-center py-8">
                <CreditCard className="mb-3 h-12 w-12 text-muted-foreground/40" />
                <p className="text-muted-foreground">Select a fee to proceed</p>
              </div>
            ) : (
              <>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Amount to Pay</p>
                  <p className="text-3xl font-bold">${remainingAmount}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {selectedFeeData?.feeType} Fee
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Payment Method *</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="netbanking">Net Banking</SelectItem>
                      <SelectItem value="wallet">Digital Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Card Number</Label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Expiry</Label>
                        <Input
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>CVV</Label>
                        <Input
                          type="password"
                          placeholder="***"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="space-y-2">
                    <Label>UPI ID</Label>
                    <Input placeholder="yourname@upi" />
                  </div>
                )}

                {paymentMethod && (
                  <Button className="w-full" size="lg" onClick={handlePayment}>
                    <Lock className="mr-2 h-4 w-4" />
                    Pay ${remainingAmount}
                  </Button>
                )}

                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 shrink-0" />
                  <span>Your payment information is encrypted and secure.</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={processingDialogOpen} onOpenChange={setProcessingDialogOpen}>
        <DialogContent className="max-w-sm">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-lg font-medium">Processing Payment...</p>
            <p className="text-sm text-muted-foreground">Please do not close this window</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="max-w-sm">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-lg font-medium">Payment Successful!</p>
            <p className="text-sm text-muted-foreground">
              Transaction ID: TXN-{Date.now().toString().slice(-8)}
            </p>
            <Button
              className="mt-6"
              onClick={() => {
                setSuccessDialogOpen(false);
                setSelectedFee("");
                setPaymentMethod("");
              }}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}