"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Layers,
  Plus,
  QrCode,
  Receipt,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { ScopeIndicator } from "@/components/shared/ScopeIndicator";
import {
  mockPaymentTransactions,
  mockCashDrawerReports,
} from "@/lib/mock-data/section12-operations";
import { PaymentTransaction, CashDrawerReport, PaymentMethod } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const DELEGATION_STRING = "Performed by Hospital Admin • acting within Billing Counter Reconciliation workflow";

export default function PaymentsPage() {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("transactions");
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(mockPaymentTransactions);
  const [drawerReports, setDrawerReports] = useState<CashDrawerReport[]>(mockCashDrawerReports);

  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [counterFilter, setCounterFilter] = useState("all");

  // Reconciliation Drawer State
  const [selectedDrawer, setSelectedDrawer] = useState<CashDrawerReport | null>(null);
  const [reconcileModalOpen, setReconcileModalOpen] = useState(false);
  const [countedCash, setCountedCash] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.receiptNo.toLowerCase().includes(search.toLowerCase()) ||
        t.patientName.toLowerCase().includes(search.toLowerCase()) ||
        t.invoiceId.toLowerCase().includes(search.toLowerCase()) ||
        t.cashierName.toLowerCase().includes(search.toLowerCase());
      const matchesMethod = methodFilter === "all" || t.paymentMethod === methodFilter;
      const matchesCounter = counterFilter === "all" || t.counterNo.includes(counterFilter);
      return matchesSearch && matchesMethod && matchesCounter;
    });
  }, [transactions, search, methodFilter, counterFilter]);

  const totalCollectedToday = useMemo(
    () => transactions.reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalCash = useMemo(
    () => transactions.filter((t) => t.paymentMethod === "Cash").reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalDigital = useMemo(
    () => transactions.filter((t) => t.paymentMethod !== "Cash").reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const handleOpenReconcile = (drawer: CashDrawerReport) => {
    setSelectedDrawer(drawer);
    setCountedCash(drawer.closingBalance);
    setReconcileModalOpen(true);
  };

  const handleConfirmReconciliation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDrawer) return;

    const diff = countedCash - selectedDrawer.closingBalance;
    setDrawerReports((prev) =>
      prev.map((d) =>
        d.counterId === selectedDrawer.counterId
          ? {
              ...d,
              status: diff === 0 ? "Balanced" : "Variance Detected",
              variance: diff,
            }
          : d
      )
    );

    toast({
      title: "Counter Reconciled",
      description: `${selectedDrawer.counterName} shift closed with ${diff === 0 ? "Zero Variance (Balanced)" : `₹${diff} Variance`}. (${DELEGATION_STRING})`,
    });
    setReconcileModalOpen(false);
  };

  if (!mounted) {
    return (
      <div className="space-y-4 animate-fade-in pb-12">
        <PageHeader
          title="Payments &amp; Daily Collections"
          description="Daily cash counter balancing, POS/card settlement reconciliation, digital payment ledgers, and cashier shift handovers."
          crumbs={[{ label: "Finance" }, { label: "Payments" }]}
        />
        <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
          Loading payment ledger...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      <PageHeader
        title="Payments &amp; Daily Collections"
        description="Daily cash counter balancing, POS/card settlement reconciliation, digital payment ledgers, and cashier shift handovers."
        crumbs={[{ label: "Finance" }, { label: "Payments" }]}
        actions={
          <Button size="sm" variant="outline" asChild className="gap-1.5 font-semibold text-xs">
            <Link href="/billing">
              <Receipt className="h-4 w-4 text-primary" /> View Invoices Suite
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <ScopeIndicator scope="Hospital Admin" stationName="Central Cash Office &amp; Billing Desk" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md border border-border">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
          <span>Operational counter reconciliation • Audit ledger verified against bank settlement batches</span>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Total Collected Today</span>
          <p className="text-xl font-bold font-mono text-primary mt-0.5">₹{totalCollectedToday.toLocaleString()}</p>
          <span className="text-[10px] text-muted-foreground">Across all billing desks</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Cash in Hand (Drawers)</span>
          <p className="text-xl font-bold font-mono text-emerald-600 mt-0.5">₹{totalCash.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Physical currency at counters</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Digital / POS / UPI</span>
          <p className="text-xl font-bold font-mono text-cyan-600 mt-0.5">₹{totalDigital.toLocaleString()}</p>
          <span className="text-[10px] text-cyan-600 font-medium">Auto-settled via gateway</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Shift Balancing</span>
          <p className="text-xl font-bold font-mono text-emerald-600 mt-0.5">100%</p>
          <span className="text-[10px] text-emerald-600 font-medium">Zero variance detected</span>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 max-w-xs">
          <TabsTrigger value="transactions" className="text-xs">Payment Transactions</TabsTrigger>
          <TabsTrigger value="drawers" className="text-xs">Cash Drawers Balancing</TabsTrigger>
        </TabsList>

        {/* TAB 1: TRANSACTIONS LEDGER */}
        <TabsContent value="transactions" className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold">Hospital Collection Ledger</CardTitle>
              <CardDescription className="text-xs">
                Real-time collection feed across OPD, IPD, Diagnostics, and Emergency billing counters.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search receipt #, patient, invoice..."
                    className="pl-8 text-xs h-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={methodFilter} onValueChange={setMethodFilter}>
                    <SelectTrigger className="w-[150px] text-xs h-9">
                      <SelectValue placeholder="Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Credit/Debit Card">Credit/Debit Card</SelectItem>
                      <SelectItem value="UPI/QR">UPI / QR Code</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={counterFilter} onValueChange={setCounterFilter}>
                    <SelectTrigger className="w-[140px] text-xs h-9">
                      <SelectValue placeholder="Counter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Counters</SelectItem>
                      <SelectItem value="Counter 1">Counter 1 (OPD)</SelectItem>
                      <SelectItem value="Counter 2">Counter 2 (Lab)</SelectItem>
                      <SelectItem value="Counter 3">Counter 3 (IPD)</SelectItem>
                      <SelectItem value="Counter 4">Counter 4 (Emergency)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-xs font-bold">Receipt #</TableHead>
                      <TableHead className="text-xs font-bold">Patient Details</TableHead>
                      <TableHead className="text-xs font-bold">Linked Invoice</TableHead>
                      <TableHead className="text-xs font-bold">Payment Method</TableHead>
                      <TableHead className="text-xs font-bold">Billing Desk &amp; Cashier</TableHead>
                      <TableHead className="text-xs font-bold">Timestamp</TableHead>
                      <TableHead className="text-xs font-bold">Amount Paid</TableHead>
                      <TableHead className="text-xs font-bold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((tx) => (
                      <TableRow key={tx.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono text-xs font-bold text-primary">
                          {tx.receiptNo}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-xs text-foreground">{tx.patientName}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{tx.patientId}</div>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {tx.invoiceId}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] flex items-center gap-1 w-fit">
                            {tx.paymentMethod === "Cash" ? (
                              <Banknote className="h-3 w-3 text-emerald-600" />
                            ) : tx.paymentMethod === "UPI/QR" ? (
                              <QrCode className="h-3 w-3 text-cyan-600" />
                            ) : (
                              <CreditCard className="h-3 w-3 text-primary" />
                            )}
                            {tx.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-medium">{tx.counterNo}</div>
                          <div className="text-[10px] text-muted-foreground">{tx.cashierName}</div>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </TableCell>
                        <TableCell className="font-mono text-xs font-bold text-foreground">
                          ₹{tx.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]">
                            {tx.reconciliationStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: CASH DRAWERS BALANCING */}
        <TabsContent value="drawers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drawerReports.map((drawer) => (
              <Card key={drawer.counterId} className="border-border shadow-xs">
                <CardHeader className="p-3.5 pb-2 border-b border-border/60 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xs font-bold text-foreground">{drawer.counterName}</CardTitle>
                      <CardDescription className="text-[10px]">Cashier: {drawer.cashierName}</CardDescription>
                    </div>
                    <Badge
                      className={
                        drawer.status === "Balanced"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]"
                          : "bg-destructive/15 text-destructive border-destructive/30 text-[10px]"
                      }
                    >
                      {drawer.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3.5 space-y-2.5 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-md bg-muted/30">
                      <span className="text-muted-foreground block text-[10px]">Opening Float:</span>
                      <span className="font-mono font-semibold">₹{drawer.openingFloat.toLocaleString()}</span>
                    </div>
                    <div className="p-2 rounded-md bg-emerald-500/5 border border-emerald-500/20">
                      <span className="text-emerald-700 dark:text-emerald-300 block text-[10px]">Cash Inflow:</span>
                      <span className="font-mono font-semibold text-emerald-600">₹{drawer.cashCollected.toLocaleString()}</span>
                    </div>
                    <div className="p-2 rounded-md bg-cyan-500/5 border border-cyan-500/20">
                      <span className="text-cyan-700 dark:text-cyan-300 block text-[10px]">POS / Card Batch:</span>
                      <span className="font-mono font-semibold text-cyan-600">₹{drawer.posCollected.toLocaleString()}</span>
                    </div>
                    <div className="p-2 rounded-md bg-primary/5 border border-primary/20">
                      <span className="text-primary block text-[10px]">UPI / QR Ledger:</span>
                      <span className="font-mono font-semibold text-primary">₹{drawer.upiCollected.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase">Net Physical Cash Balance:</span>
                      <p className="font-mono text-sm font-bold text-foreground">₹{drawer.closingBalance.toLocaleString()}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs font-semibold"
                      onClick={() => handleOpenReconcile(drawer)}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Reconcile Shift
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Shift Reconciliation Modal */}
      <Dialog open={reconcileModalOpen} onOpenChange={setReconcileModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleConfirmReconciliation}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Reconcile Cash Drawer
              </DialogTitle>
              <DialogDescription className="text-xs">
                Count physical currency in drawer for {selectedDrawer?.counterName}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-3 text-xs">
              <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Expected Physical Cash:</span>
                  <span className="font-mono font-bold text-foreground">₹{selectedDrawer?.closingBalance.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duty Cashier:</span>
                  <span className="font-semibold text-foreground">{selectedDrawer?.cashierName}</span>
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="rec-cash">Counted Physical Cash in Drawer (₹)</Label>
                <Input
                  id="rec-cash"
                  type="number"
                  required
                  value={countedCash}
                  onChange={(e) => setCountedCash(Number(e.target.value))}
                />
              </div>

              {countedCash !== (selectedDrawer?.closingBalance || 0) && (
                <div className="p-2 rounded-md border border-destructive/40 bg-destructive/10 text-destructive text-[11px]">
                  Variance of ₹{countedCash - (selectedDrawer?.closingBalance || 0)} will be flagged in the audit register.
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setReconcileModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Confirm &amp; Close Shift
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
