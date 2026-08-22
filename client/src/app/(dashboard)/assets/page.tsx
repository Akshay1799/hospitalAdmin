"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Cpu,
  Download,
  Eye,
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
  Wrench,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { ScopeIndicator } from "@/components/shared/ScopeIndicator";
import { mockBiomedicalAssets } from "@/lib/mock-data/section12-operations";
import { BiomedicalAsset, AssetCategory, AssetMaintenanceStatus } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const DELEGATION_STRING = "Performed by Hospital Admin • acting within Biomedical Engineering workflow";

export default function AssetsPage() {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  const [assets, setAssets] = useState<BiomedicalAsset[]>(mockBiomedicalAssets);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // PPM Maintenance Modal State
  const [selectedAsset, setSelectedAsset] = useState<BiomedicalAsset | null>(null);
  const [ppmModalOpen, setPpmModalOpen] = useState(false);
  const [technicianName, setTechnicianName] = useState("Biomedical Engineer");
  const [nextPpmDate, setNextPpmDate] = useState("2026-11-25");

  // Add Asset Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [assetName, setAssetName] = useState("");
  const [assetCode, setAssetCode] = useState("");
  const [category, setCategory] = useState<AssetCategory>("Diagnostic & Imaging");
  const [model, setModel] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [department, setDepartment] = useState("Radiology & Imaging");
  const [floor, setFloor] = useState("Ground Floor");
  const [purchaseCost, setPurchaseCost] = useState(1500000);
  const [vendorName, setVendorName] = useState("Siemens Healthcare Pvt Ltd");

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.assetCode.toLowerCase().includes(search.toLowerCase()) ||
        a.serialNo.toLowerCase().includes(search.toLowerCase()) ||
        a.department.toLowerCase().includes(search.toLowerCase()) ||
        a.vendorName.toLowerCase().includes(search.toLowerCase());
      const matchesCat = categoryFilter === "all" || a.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || a.maintenanceStatus === statusFilter;
      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [assets, search, categoryFilter, statusFilter]);

  const calibrationDueCount = useMemo(
    () => assets.filter((a) => a.maintenanceStatus === "Calibration Due").length,
    [assets]
  );

  const handleOpenPPM = (asset: BiomedicalAsset) => {
    setSelectedAsset(asset);
    setPpmModalOpen(true);
  };

  const handleConfirmPPM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    setAssets((prev) =>
      prev.map((a) =>
        a.id === selectedAsset.id
          ? {
              ...a,
              maintenanceStatus: "Operational",
              lastCalibrationDate: new Date().toISOString().split("T")[0],
              nextPPMDate: nextPpmDate,
            }
          : a
      )
    );

    toast({
      title: "Calibration & PPM Certified",
      description: `${selectedAsset.assetCode} certified operational by ${technicianName}. Next PPM: ${nextPpmDate}. (${DELEGATION_STRING})`,
    });
    setPpmModalOpen(false);
    setSelectedAsset(null);
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const newAsset: BiomedicalAsset = {
      id: `ast_${Date.now()}`,
      assetCode: assetCode || `BIO-${Date.now().toString().slice(-4)}`,
      name: assetName,
      category,
      model,
      serialNo,
      department,
      floor,
      purchaseDate: new Date().toISOString().split("T")[0],
      purchaseCost,
      warrantyExpiry: "2027-12-31",
      amcCmcContract: "Active",
      vendorName,
      nextPPMDate: "2026-12-01",
      maintenanceStatus: "Operational",
      lastCalibrationDate: new Date().toISOString().split("T")[0],
    };

    setAssets((prev) => [newAsset, ...prev]);
    toast({
      title: "Biomedical Asset Registered",
      description: `${assetName} registered in ${department}. (${DELEGATION_STRING})`,
    });
    setAddModalOpen(false);
  };

  if (!mounted) {
    return (
      <div className="space-y-4 animate-fade-in pb-12">
        <PageHeader
          title="Biomedical &amp; Facility Asset Management"
          description="Biomedical equipment lifecycle, AMC/CMC maintenance contracts, calibration logs, and preventive maintenance."
          crumbs={[{ label: "Supply & Assets" }, { label: "Assets Registry" }]}
        />
        <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
          Loading biomedical assets...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      <PageHeader
        title="Biomedical &amp; Facility Asset Management"
        description="Biomedical equipment lifecycle, AMC/CMC maintenance contracts, calibration logs, and preventive maintenance."
        crumbs={[{ label: "Supply & Assets" }, { label: "Assets Registry" }]}
        actions={
          <Button size="sm" className="gap-1.5 font-semibold text-xs" onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4" /> Register Asset
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <ScopeIndicator scope="Hospital Admin" stationName="Central Biomedical Engineering &amp; Assets" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md border border-border">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
          <span>Operational maintenance scheduling • Calibration testing certified by biomedical engineers</span>
        </div>
      </div>

      {/* Calibration Due Banner */}
      {calibrationDueCount > 0 && (
        <Card className="border-amber-500/40 bg-amber-500/5 shadow-xs">
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  {calibrationDueCount} Critical Biomedical Device(s) Due for Scheduled Calibration / PPM
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Hamilton C6 Intensive Care Ventilator (ICU) requires bi-annual flow sensor calibration.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-xs shrink-0 text-amber-700 dark:text-amber-300 border-amber-500/30"
              onClick={() => handleOpenPPM(assets.find((a) => a.maintenanceStatus === "Calibration Due") || assets[0])}
            >
              <Wrench className="h-3.5 w-3.5 mr-1" /> Log Calibration PPM
            </Button>
          </CardContent>
        </Card>
      )}

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Total Capital Assets</span>
          <p className="text-xl font-bold font-mono text-primary mt-0.5">{assets.length} Units</p>
          <span className="text-[10px] text-muted-foreground">Across clinical departments</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Total Asset Valuation</span>
          <p className="text-xl font-bold font-mono text-foreground mt-0.5">
            ₹{(assets.reduce((sum, a) => sum + a.purchaseCost, 0) / 10000000).toFixed(2)} Cr
          </p>
          <span className="text-[10px] text-muted-foreground">Original acquisition cost</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Active AMC / CMC</span>
          <p className="text-xl font-bold font-mono text-emerald-600 mt-0.5">
            {assets.filter((a) => a.amcCmcContract === "Active").length} Active
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">OEM warranty coverage</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Operational Uptime</span>
          <p className="text-xl font-bold font-mono text-cyan-600 mt-0.5">98.5%</p>
          <span className="text-[10px] text-cyan-600 font-medium">Biomedical reliability index</span>
        </Card>
      </div>

      {/* Assets Registry Table */}
      <Card className="border-border shadow-xs">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold">Biomedical &amp; Facility Equipment Registry</CardTitle>
          <CardDescription className="text-xs">
            Review equipment parameters, track warranty dates, and certify preventive maintenance schedules.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search asset #, model, serial #..."
                className="pl-8 text-xs h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[170px] text-xs h-9">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Diagnostic & Imaging">Diagnostic &amp; Imaging</SelectItem>
                  <SelectItem value="Life Support">Life Support</SelectItem>
                  <SelectItem value="OT Equipment">OT Equipment</SelectItem>
                  <SelectItem value="Monitoring">Monitoring</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] text-xs h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Operational">Operational</SelectItem>
                  <SelectItem value="Calibration Due">Calibration Due</SelectItem>
                  <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs font-bold">Asset Code</TableHead>
                  <TableHead className="text-xs font-bold">Equipment Name &amp; Model</TableHead>
                  <TableHead className="text-xs font-bold">Department &amp; Floor</TableHead>
                  <TableHead className="text-xs font-bold">Serial Number</TableHead>
                  <TableHead className="text-xs font-bold">AMC / Warranty</TableHead>
                  <TableHead className="text-xs font-bold">Next PPM Date</TableHead>
                  <TableHead className="text-xs font-bold">Status</TableHead>
                  <TableHead className="text-xs font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-xs font-bold text-primary">
                      {asset.assetCode}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-xs text-foreground">{asset.name}</div>
                      <div className="text-[10px] text-muted-foreground">{asset.model} • {asset.category}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-medium">{asset.department}</div>
                      <div className="text-[10px] text-muted-foreground">{asset.floor}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {asset.serialNo}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          asset.amcCmcContract === "Active"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]"
                            : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px]"
                        }
                      >
                        {asset.amcCmcContract}
                      </Badge>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{asset.vendorName}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-foreground font-semibold">
                      {asset.nextPPMDate}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          asset.maintenanceStatus === "Operational"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]"
                            : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px]"
                        }
                      >
                        {asset.maintenanceStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs font-semibold"
                        onClick={() => handleOpenPPM(asset)}
                      >
                        <Wrench className="h-3 w-3 mr-1" /> Log PPM
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Log PPM Maintenance Modal */}
      <Dialog open={ppmModalOpen} onOpenChange={setPpmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleConfirmPPM}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" /> Log Preventive Maintenance (PPM)
              </DialogTitle>
              <DialogDescription className="text-xs">
                Certify calibration testing and preventive servicing for <strong>{selectedAsset?.name}</strong>.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-3 text-xs">
              <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Asset Code &amp; Serial:</span>
                  <span className="font-mono font-semibold text-foreground">{selectedAsset?.assetCode} ({selectedAsset?.serialNo})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-medium text-foreground">{selectedAsset?.department}</span>
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="ppm-tech">Certified Biomedical Engineer / Technician</Label>
                <Input
                  id="ppm-tech"
                  required
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="ppm-next">Next Scheduled PPM / Calibration Date</Label>
                <Input
                  id="ppm-next"
                  type="date"
                  required
                  value={nextPpmDate}
                  onChange={(e) => setNextPpmDate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setPpmModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Sign-Off &amp; Certify PPM
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Asset Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSaveAsset}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" /> Register Capital Asset
              </DialogTitle>
              <DialogDescription className="text-xs">
                Add biomedical equipment or facility infrastructure to the asset registry.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-3 text-xs">
              <div className="grid gap-1">
                <Label htmlFor="ast-name">Equipment Name *</Label>
                <Input
                  id="ast-name"
                  required
                  placeholder="e.g. Philips Affinity 70 Ultrasound System"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="ast-code">Asset Code</Label>
                  <Input
                    id="ast-code"
                    placeholder="e.g. BIO-US-03"
                    value={assetCode}
                    onChange={(e) => setAssetCode(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="ast-cat">Category</Label>
                  <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                    <SelectTrigger id="ast-cat" className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Diagnostic & Imaging">Diagnostic &amp; Imaging</SelectItem>
                      <SelectItem value="Life Support">Life Support</SelectItem>
                      <SelectItem value="OT Equipment">OT Equipment</SelectItem>
                      <SelectItem value="Monitoring">Monitoring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="ast-model">Model</Label>
                  <Input
                    id="ast-model"
                    required
                    placeholder="e.g. Affinity 70"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="ast-sn">Serial Number</Label>
                  <Input
                    id="ast-sn"
                    required
                    placeholder="e.g. SN-PHIL-881920"
                    value={serialNo}
                    onChange={(e) => setSerialNo(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="ast-dept">Department</Label>
                  <Input
                    id="ast-dept"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="ast-cost">Purchase Cost (₹)</Label>
                  <Input
                    id="ast-cost"
                    type="number"
                    required
                    value={purchaseCost}
                    onChange={(e) => setPurchaseCost(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="ast-ven">OEM Vendor / Supplier</Label>
                <Input
                  id="ast-ven"
                  required
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Register Capital Asset
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
