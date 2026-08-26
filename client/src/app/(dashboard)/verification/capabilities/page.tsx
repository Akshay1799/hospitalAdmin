"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Ambulance,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Droplet,
  Eye,
  FileCheck2,
  Globe,
  HeartPulse,
  Lock,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Upload,
  Zap,
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
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/page-header";
import { ScopeIndicator } from "@/components/shared/ScopeIndicator";
import { VerificationNav } from "@/components/verification/verification-nav";
import { useToast } from "@/hooks/use-toast";
import { mockCapabilityVerifications } from "@/lib/mock-data/verification-cases";
import { CapabilityVerification } from "@/lib/types";

const DELEGATION_STRING = "Performed by Hospital Admin • acting within Capability Verification workflow";

export default function CapabilitiesVerificationPage() {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  const [capabilities, setCapabilities] = useState<CapabilityVerification[]>(mockCapabilityVerifications);

  // Submit Capability Evidence Modal State
  const [capModalOpen, setCapModalOpen] = useState(false);
  const [capTitle, setCapTitle] = useState("");
  const [capType, setCapType] = useState<any>("Ambulance Fleet");
  const [capDetails, setCapDetails] = useState("");
  const [capHours, setCapHours] = useState("24 Hours / 7 Days");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenSubmit = (cap: CapabilityVerification) => {
    setCapTitle(cap.title);
    setCapType(cap.capabilityType);
    setCapDetails(cap.serviceDetails);
    setCapHours(cap.operatingHours);
    setCapModalOpen(true);
  };

  const handleSaveCapability = (e: React.FormEvent) => {
    e.preventDefault();
    setCapabilities((prev) =>
      prev.map((c) =>
        c.capabilityType === capType
          ? {
              ...c,
              title: capTitle,
              serviceDetails: capDetails,
              operatingHours: capHours,
              status: "Under Review",
              publicBadgeActive: false,
            }
          : c
      )
    );

    toast({
      title: "Capability Evidence Updated",
      description: `Submitted evidence for ${capTitle}. Case queued for platform transport/trauma inspection. (${DELEGATION_STRING})`,
    });

    setCapModalOpen(false);
  };

  if (!mounted) {
    return (
      <div className="space-y-4 animate-fade-in pb-12">
        <PageHeader
          title="Ambulance &amp; Emergency Capability Verification"
          description="Verification of ambulance fleet, emergency operating hours, and trauma capabilities prior to public capability badge activation."
          crumbs={[{ label: "Administration" }, { label: "Verifications", href: "/verification" }, { label: "Capabilities" }]}
        />
        <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
          Loading capabilities...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      <PageHeader
        title="Ambulance &amp; Emergency Capability Verification"
        description="Verification of ambulance fleet, emergency operating hours, and trauma capabilities prior to public capability badge activation."
        crumbs={[{ label: "Administration" }, { label: "Verifications", href: "/verification" }, { label: "Capabilities" }]}
      />

      <VerificationNav />

      {/* Scope Indicator & Rule 13-CANNOT-10 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <ScopeIndicator scope="Hospital Admin" stationName="Emergency &amp; Fleet Capability Gate" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md border border-border">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
          <span>Emergency Accreditation Policy: Ambulance &amp; trauma capabilities cannot be displayed publicly until verified</span>
        </div>
      </div>

      {/* Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {capabilities.map((cap) => (
          <Card key={cap.id} className="border-border shadow-xs flex flex-col justify-between">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {cap.capabilityType === "Ambulance Fleet" && <Ambulance className="h-5 w-5" />}
                    {cap.capabilityType === "24/7 Emergency & Trauma" && <HeartPulse className="h-5 w-5 text-rose-600" />}
                    {cap.capabilityType === "ICU Critical Care" && <Activity className="h-5 w-5 text-cyan-600" />}
                    {cap.capabilityType === "Blood Bank Storage" && <Droplet className="h-5 w-5 text-rose-600" />}
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-foreground">{cap.title}</CardTitle>
                    <CardDescription className="text-xs font-mono">{cap.capabilityType}</CardDescription>
                  </div>
                </div>

                <Badge
                  className={
                    cap.status === "Verified"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]"
                      : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px]"
                  }
                >
                  {cap.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-2 text-xs space-y-3">
              <p className="text-muted-foreground leading-relaxed">{cap.serviceDetails}</p>

              <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-sans">Operating Hours:</span>
                  <span className="font-bold text-foreground">{cap.operatingHours}</span>
                </div>
                {cap.fleetCount && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-sans">Verified Fleet Count:</span>
                    <span className="font-bold text-primary">{cap.fleetCount} ALS Ambulances</span>
                  </div>
                )}
                {cap.traumaLevel && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-sans">Trauma Accreditation:</span>
                    <span className="font-bold text-emerald-600">{cap.traumaLevel}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-sans">Public Badge Status:</span>
                  {cap.publicBadgeActive ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1 font-sans">
                      <Globe className="h-3 w-3" /> Live on Public Profile
                    </span>
                  ) : (
                    <span className="text-muted-foreground font-semibold flex items-center gap-1 font-sans">
                      <Lock className="h-3 w-3" /> Blocked from Public Display
                    </span>
                  )}
                </div>
              </div>

              {/* Compliance note */}
              <div className="text-[11px] text-muted-foreground italic border-l-2 border-primary/40 pl-2">
                &ldquo;{cap.complianceNotes}&rdquo;
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-mono">
                  {cap.evidenceDocs.length} Compliance Docs Uploaded
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs font-semibold text-primary hover:bg-primary/10"
                  onClick={() => handleOpenSubmit(cap)}
                >
                  <Upload className="h-3 w-3 mr-1" /> Update Evidence
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MODAL: UPDATE CAPABILITY EVIDENCE */}
      <Dialog open={capModalOpen} onOpenChange={setCapModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSaveCapability}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" /> Update Capability Evidence
              </DialogTitle>
              <DialogDescription className="text-xs">
                Submit updated certificates or operating hours configuration for {capTitle}.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 py-3 text-xs">
              <div className="grid gap-1">
                <Label htmlFor="cap-t">Capability Title *</Label>
                <Input
                  id="cap-t"
                  required
                  value={capTitle}
                  onChange={(e) => setCapTitle(e.target.value)}
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="cap-h">Verified Operating Hours *</Label>
                <Input
                  id="cap-h"
                  required
                  value={capHours}
                  onChange={(e) => setCapHours(e.target.value)}
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="cap-d">Service Specifications &amp; Equipment Manifest *</Label>
                <Textarea
                  id="cap-d"
                  required
                  rows={3}
                  value={capDetails}
                  onChange={(e) => setCapDetails(e.target.value)}
                />
              </div>

              <div className="p-3 border-2 border-dashed border-primary/40 rounded-lg text-center bg-primary/5 space-y-1">
                <Upload className="h-5 w-5 text-primary mx-auto" />
                <span className="font-bold text-xs text-primary block">Attach Calibration / Accreditation PDF</span>
                <span className="text-[10px] text-muted-foreground">NABH, RTO, or Device Annual Maintenance Log</span>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setCapModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-semibold">
                Submit Capability Audit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
