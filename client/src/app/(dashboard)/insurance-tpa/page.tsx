"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Filter,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
  XCircle,
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
import { mockInsuranceClaims } from "@/lib/mock-data/section12-operations";
import { InsuranceClaim, TpaProvider, ClaimStatus } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const DELEGATION_STRING = "Performed by Hospital Admin • acting within Insurance-TPA Claims workflow";

export default function InsuranceTPAPage() {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("all-claims");
  const [claims, setClaims] = useState<InsuranceClaim[]>(mockInsuranceClaims);

  const [search, setSearch] = useState("");
  const [tpaFilter, setTpaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Resubmission Modal State (Section 12 Edge Case)
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(null);
  const [resubmitModalOpen, setResubmitModalOpen] = useState(false);
  const [rectificationNotes, setRectificationNotes] = useState("");

  // New Pre-Auth Modal State
  const [preAuthModalOpen, setPreAuthModalOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [policyNo, setPolicyNo] = useState("");
  const [tpaProvider, setTpaProvider] = useState<TpaProvider>("Star Health");
  const [claimAmount, setClaimAmount] = useState(150000);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredClaims = useMemo(() => {
    return claims.filter((c) => {
      const matchesSearch =
        c.claimNo.toLowerCase().includes(search.toLowerCase()) ||
        c.patientName.toLowerCase().includes(search.toLowerCase()) ||
        c.policyNo.toLowerCase().includes(search.toLowerCase()) ||
        c.tpaProvider.toLowerCase().includes(search.toLowerCase());
      const matchesTpa = tpaFilter === "all" || c.tpaProvider === tpaFilter;
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesTab =
        activeTab === "all-claims" ||
        (activeTab === "pre-auth" && (c.status === "Submitted" || c.status === "Pre-authorized")) ||
        (activeTab === "rejected" && c.status === "Rejected") ||
        (activeTab === "schemes" && (c.tpaProvider === "PM-JAY Scheme" || c.tpaProvider === "CGHS Scheme"));
      return matchesSearch && matchesTpa && matchesStatus && matchesTab;
    });
  }, [claims, search, tpaFilter, statusFilter, activeTab]);

  const totalClaimValue = claims.reduce((sum, c) => sum + c.claimAmount, 0);
  const totalApprovedValue = claims.reduce((sum, c) => sum + c.approvedAmount, 0);

  const handleOpenResubmit = (claim: InsuranceClaim) => {
    setSelectedClaim(claim);
    setRectificationNotes(claim.queryNotes || "Attached missing clinical summary and attending physician notes.");
    setResubmitModalOpen(true);
  };

  const handleExecuteResubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaim) return;

    setClaims((prev) =>
      prev.map((c) =>
        c.id === selectedClaim.id
          ? {
              ...c,
              status: "Under Review",
              queryNotes: `Resubmitted: ${rectificationNotes}`,
              rejectionReason: undefined,
            }
          : c
      )
    );

    toast({
      title: "Claim Resubmitted to TPA",
      description: `${selectedClaim.claimNo} (${selectedClaim.tpaProvider}) resubmitted with rectification notes. (${DELEGATION_STRING})`,
    });
    setResubmitModalOpen(false);
    setSelectedClaim(null);
  };

  const handleSavePreAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const newClaim: InsuranceClaim = {
      id: `clm_${Date.now()}`,
      claimNo: `CLM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: patientId || `P-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName,
      tpaProvider,
      policyNo,
      admissionDate: new Date().toISOString().split("T")[0],
      claimAmount,
      approvedAmount: Math.round(claimAmount * 0.85),
      copayAmount: Math.round(claimAmount * 0.15),
      status: "Pre-authorized",
      submissionDate: new Date().toISOString().split("T")[0],
    };

    setClaims((prev) => [newClaim, ...prev]);
    toast({
      title: "Pre-Authorization Submitted",
      description: `${newClaim.claimNo} filed with ${tpaProvider} for ${patientName}. (${DELEGATION_STRING})`,
    });
    setPreAuthModalOpen(false);
  };

  if (!mounted) {
    return (
      <div className="space-y-4 animate-fade-in pb-12">
        <PageHeader
          title="Insurance &amp; TPA Claims Desk"
          description="Cashless pre-authorization, TPA claims lifecycle, query dispute resubmissions, and government health schemes."
          crumbs={[{ label: "Finance" }, { label: "Insurance & TPA" }]}
        />
        <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
          Loading insurance desk...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      <PageHeader
        title="Insurance &amp; TPA Claims Desk"
        description="Cashless pre-authorization, TPA claims lifecycle, query dispute resubmissions, and government health schemes."
        crumbs={[{ label: "Finance" }, { label: "Insurance & TPA" }]}
        actions={
          <Button size="sm" className="gap-1.5 font-semibold text-xs" onClick={() => setPreAuthModalOpen(true)}>
            <Plus className="h-4 w-4" /> New Pre-Authorization
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <ScopeIndicator scope="Hospital Admin" stationName="Central Insurance &amp; TPA Helpdesk" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md border border-border">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
          <span>Operational claims tracking • Medical necessity certified by attending physicians</span>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Total Claims Volume</span>
          <p className="text-xl font-bold font-mono text-primary mt-0.5">{claims.length} Claims</p>
          <span className="text-[10px] text-muted-foreground">Active TPA submissions</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Total Claimed Value</span>
          <p className="text-xl font-bold font-mono text-foreground mt-0.5">₹{totalClaimValue.toLocaleString()}</p>
          <span className="text-[10px] text-muted-foreground">Hospital bill totals</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Approved / Settled</span>
          <p className="text-xl font-bold font-mono text-emerald-600 mt-0.5">₹{totalApprovedValue.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 font-medium">89.4% Approval Ratio</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Rejected / Query Action</span>
          <p className="text-xl font-bold font-mono text-rose-600 mt-0.5">
            {claims.filter((c) => c.status === "Rejected").length} Actionable
          </p>
          <span className="text-[10px] text-rose-600 font-medium">Direct resubmission enabled</span>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 max-w-lg">
          <TabsTrigger value="all-claims" className="text-xs">All Claims ({claims.length})</TabsTrigger>
          <TabsTrigger value="pre-auth" className="text-xs">Pre-Auth Queue</TabsTrigger>
          <TabsTrigger value="rejected" className="text-xs">Queries &amp; Rejections</TabsTrigger>
          <TabsTrigger value="schemes" className="text-xs">PM-JAY / CGHS</TabsTrigger>
        </TabsList>

        <Card className="border-border shadow-xs">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold">Cashless &amp; Reimbursement Claims Register</CardTitle>
            <CardDescription className="text-xs">
              Manage pre-authorizations, query reconciliations, and dispute resubmissions with TPA partners.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search claim #, patient, policy #..."
                  className="pl-8 text-xs h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={tpaFilter} onValueChange={setTpaFilter}>
                  <SelectTrigger className="w-[150px] text-xs h-9">
                    <SelectValue placeholder="TPA Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All TPAs</SelectItem>
                    <SelectItem value="Star Health">Star Health</SelectItem>
                    <SelectItem value="HDFC ERGO">HDFC ERGO</SelectItem>
                    <SelectItem value="Medi Assist">Medi Assist</SelectItem>
                    <SelectItem value="PM-JAY Scheme">PM-JAY Scheme</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] text-xs h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="Pre-authorized">Pre-authorized</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Settled">Settled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="text-xs font-bold">Claim #</TableHead>
                    <TableHead className="text-xs font-bold">Patient Details</TableHead>
                    <TableHead className="text-xs font-bold">TPA / Insurance Provider</TableHead>
                    <TableHead className="text-xs font-bold">Policy #</TableHead>
                    <TableHead className="text-xs font-bold">Claim Amount</TableHead>
                    <TableHead className="text-xs font-bold">Approved / Copay</TableHead>
                    <TableHead className="text-xs font-bold">Status</TableHead>
                    <TableHead className="text-xs font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClaims.map((claim) => (
                    <TableRow key={claim.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono text-xs font-bold text-primary">
                        {claim.claimNo}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-xs text-foreground">{claim.patientName}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{claim.patientId}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {claim.tpaProvider}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {claim.policyNo}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold text-foreground">
                        ₹{claim.claimAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-xs text-emerald-600 font-bold">
                          ₹{claim.approvedAmount.toLocaleString()}
                        </div>
                        {claim.copayAmount > 0 && (
                          <div className="text-[10px] text-muted-foreground">
                            Copay: ₹{claim.copayAmount.toLocaleString()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            claim.status === "Approved" || claim.status === "Settled"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]"
                              : claim.status === "Pre-authorized" || claim.status === "Under Review"
                              ? "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30 text-[10px]"
                              : claim.status === "Rejected"
                              ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 text-[10px]"
                              : "bg-muted text-muted-foreground text-[10px]"
                          }
                        >
                          {claim.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        {claim.status === "Rejected" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs font-semibold text-primary border-primary/30"
                            onClick={() => handleOpenResubmit(claim)}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" /> Resubmit Query
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </Tabs>

      {/* Resubmit Rejected Claim Modal (Section 12 Edge Case) */}
      <Dialog open={resubmitModalOpen} onOpenChange={setResubmitModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleExecuteResubmission}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2 text-primary">
                <RefreshCw className="h-5 w-5 text-primary" /> Resubmit Disputed Claim
              </DialogTitle>
              <DialogDescription className="text-xs">
                Provide query rectification justification for <strong>{selectedClaim?.claimNo}</strong> ({selectedClaim?.tpaProvider}).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-3 text-xs">
              <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 space-y-1">
                <span className="text-[10px] text-destructive font-bold uppercase">TPA Rejection Reason:</span>
                <p className="text-xs text-foreground">{selectedClaim?.rejectionReason || "Missing supporting documents."}</p>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="res-notes">Rectification &amp; Clinical Justification Notes *</Label>
                <Input
                  id="res-notes"
                  required
                  placeholder="e.g. Attached historical OPD consultation prescription from Dr. Ananya Patel"
                  value={rectificationNotes}
                  onChange={(e) => setRectificationNotes(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setResubmitModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Resubmit to TPA Portal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* New Pre-Authorization Modal */}
      <Dialog open={preAuthModalOpen} onOpenChange={setPreAuthModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSavePreAuth}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> New Cashless Pre-Authorization
              </DialogTitle>
              <DialogDescription className="text-xs">
                File an initial pre-authorization request with a partner TPA or health scheme.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-3 text-xs">
              <div className="grid gap-1">
                <Label htmlFor="pa-pat">Patient Name *</Label>
                <Input
                  id="pa-pat"
                  required
                  placeholder="e.g. Meenakshi Iyer"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="pa-id">Patient UHID</Label>
                  <Input
                    id="pa-id"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="pa-tpa">TPA Provider</Label>
                  <Select value={tpaProvider} onValueChange={(val: any) => setTpaProvider(val)}>
                    <SelectTrigger id="pa-tpa" className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Star Health">Star Health</SelectItem>
                      <SelectItem value="HDFC ERGO">HDFC ERGO</SelectItem>
                      <SelectItem value="ICICI Lombard">ICICI Lombard</SelectItem>
                      <SelectItem value="Medi Assist">Medi Assist</SelectItem>
                      <SelectItem value="PM-JAY Scheme">PM-JAY Ayushman</SelectItem>
                      <SelectItem value="CGHS Scheme">CGHS Scheme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="pa-pol">Policy / Card # *</Label>
                  <Input
                    id="pa-pol"
                    required
                    placeholder="e.g. SH-MED-9941"
                    value={policyNo}
                    onChange={(e) => setPolicyNo(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="pa-amt">Estimated Claim (₹)</Label>
                  <Input
                    id="pa-amt"
                    type="number"
                    required
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setPreAuthModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Submit Pre-Auth
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
