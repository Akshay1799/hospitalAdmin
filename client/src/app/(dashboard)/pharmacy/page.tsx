"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  AlertOctagon,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Layers,
  Pill,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShoppingCart,
  Sparkles,
  User,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { ScopeIndicator } from "@/components/shared/ScopeIndicator";
import {
  mockMedicineInventory,
  mockDispensingLogs,
  mockPharmacyAlerts,
} from "@/lib/mock-data/section12-operations";
import { MedicineItem, DispensingRecord, PharmacyAlert } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const DELEGATION_STRING = "Performed by Hospital Admin • acting within Pharmacy Operational workflow";

export default function PharmacyPage() {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("inventory");
  const [medicines, setMedicines] = useState<MedicineItem[]>(mockMedicineInventory);
  const [dispensingLogs] = useState<DispensingRecord[]>(mockDispensingLogs);
  const [alerts] = useState<PharmacyAlert[]>(mockPharmacyAlerts);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Add Medicine Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [medName, setMedName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [category, setCategory] = useState<any>("Antibiotics");
  const [dosageForm, setDosageForm] = useState<any>("Tablet");
  const [stockLevel, setStockLevel] = useState(100);
  const [minThreshold, setMinThreshold] = useState(30);
  const [rackLocation, setRackLocation] = useState("Rack A-01");
  const [unitPrice, setUnitPrice] = useState(150);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.genericName.toLowerCase().includes(search.toLowerCase()) ||
        m.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
        m.rackLocation.toLowerCase().includes(search.toLowerCase());
      const matchesCat = categoryFilter === "all" || m.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || m.status === statusFilter;
      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [medicines, search, categoryFilter, statusFilter]);

  const zeroStockCritical = useMemo(
    () => medicines.filter((m) => m.stockLevel === 0 && m.category === "Critical Emergency"),
    [medicines]
  );

  const handleSaveMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    const newMed: MedicineItem = {
      id: `med_${Date.now()}`,
      name: medName,
      genericName,
      category,
      dosageForm,
      stockLevel,
      unit: "Units",
      minThreshold,
      expiryDate: "2027-12-31",
      batchNumber: `BAT-${Date.now().toString().slice(-5)}`,
      rackLocation,
      status: stockLevel === 0 ? "Out of Stock" : stockLevel <= minThreshold ? "Low Stock" : "In Stock",
      unitPrice,
    };

    setMedicines((prev) => [newMed, ...prev]);
    toast({
      title: "Medicine Registered",
      description: `${medName} (${dosageForm}) added to inventory. (${DELEGATION_STRING})`,
    });
    setAddModalOpen(false);
  };

  if (!mounted) {
    return (
      <div className="space-y-4 animate-fade-in pb-12">
        <PageHeader
          title="Hospital Pharmacy &amp; Dispensing"
          description="Central medicine inventory, batch expiry management, stock replenishment alerts, and operational dispensing logs."
          crumbs={[{ label: "Clinical Operations" }, { label: "Pharmacy" }]}
        />
        <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
          Loading pharmacy inventory...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      <PageHeader
        title="Hospital Pharmacy &amp; Dispensing"
        description="Central medicine inventory, batch expiry management, stock replenishment alerts, and operational dispensing logs."
        crumbs={[{ label: "Clinical Operations" }, { label: "Pharmacy" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" asChild className="gap-1.5 font-semibold text-xs">
              <Link href="/procurement/create">
                <ShoppingCart className="h-4 w-4 text-primary" /> Create Purchase Order
              </Link>
            </Button>
            <Button size="sm" className="gap-1.5 font-semibold text-xs" onClick={() => setAddModalOpen(true)}>
              <Plus className="h-4 w-4" /> Add Medicine
            </Button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <ScopeIndicator scope="Hospital Admin" stationName="Central Hospital Pharmacy" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md border border-border">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
          <span>Operational oversight &amp; restock • Drug dispensing stays with licensed pharmacists</span>
        </div>
      </div>

      {/* Critical Zero-Stock Emergency Alert Banner (Section 12 Edge Case) */}
      {zeroStockCritical.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/10 shadow-xs">
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5">
            <div className="flex items-center gap-3">
              <AlertOctagon className="h-6 w-6 text-destructive shrink-0" />
              <div>
                <p className="text-xs font-bold text-destructive">
                  EMERGENCY ALERT: {zeroStockCritical.length} Critical Life-Saving Medicine(s) at ZERO Stock
                </p>
                <p className="text-[11px] text-foreground mt-0.5">
                  {zeroStockCritical.map((m) => `${m.name} (${m.genericName})`).join(", ")} — Immediate emergency stock procurement required.
                </p>
              </div>
            </div>
            <Button size="sm" variant="destructive" asChild className="text-xs shrink-0">
              <Link href="/procurement/create">
                <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Expedite Purchase Order
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Total Catalog SKUs</span>
          <p className="text-xl font-bold font-mono text-primary mt-0.5">{medicines.length} Medicines</p>
          <span className="text-[10px] text-muted-foreground">Active hospital formulary</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Low / Out of Stock</span>
          <p className="text-xl font-bold font-mono text-rose-600 mt-0.5">
            {medicines.filter((m) => m.status === "Low Stock" || m.status === "Out of Stock").length} SKUs
          </p>
          <span className="text-[10px] text-rose-600 font-medium">Breached reorder threshold</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Expiring &lt; 30 Days</span>
          <p className="text-xl font-bold font-mono text-amber-600 mt-0.5">
            {medicines.filter((m) => m.status === "Expiring Soon").length} Batches
          </p>
          <span className="text-[10px] text-amber-600 font-medium">Prioritize FEFO dispatch</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Today's Dispensing</span>
          <p className="text-xl font-bold font-mono text-emerald-600 mt-0.5">{dispensingLogs.length} Prescriptions</p>
          <span className="text-[10px] text-emerald-600 font-medium">Inpatient &amp; OPD fulfillment</span>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="inventory" className="text-xs">Medicine Inventory</TabsTrigger>
          <TabsTrigger value="alerts" className="text-xs">Stock Alerts Panel ({alerts.length})</TabsTrigger>
          <TabsTrigger value="dispensing" className="text-xs">Dispensing Activity</TabsTrigger>
        </TabsList>

        {/* TAB 1: MEDICINE INVENTORY */}
        <TabsContent value="inventory" className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold">Formulary &amp; Stock Levels</CardTitle>
              <CardDescription className="text-xs">
                Review batch details, shelf locations, unit pricing, and schedule compliance.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search medicine, generic, batch, or rack..."
                    className="pl-8 text-xs h-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[140px] text-xs h-9">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                      <SelectItem value="Critical Emergency">Critical Emergency</SelectItem>
                      <SelectItem value="Cardiovascular">Cardiovascular</SelectItem>
                      <SelectItem value="Anesthetics">Anesthetics</SelectItem>
                      <SelectItem value="Gastrointestinal">Gastrointestinal</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px] text-xs h-9">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Low Stock">Low Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                      <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-xs font-bold">Medicine Name &amp; Generic</TableHead>
                      <TableHead className="text-xs font-bold">Category &amp; Form</TableHead>
                      <TableHead className="text-xs font-bold">Batch &amp; Expiry</TableHead>
                      <TableHead className="text-xs font-bold">Rack Location</TableHead>
                      <TableHead className="text-xs font-bold">Stock Level</TableHead>
                      <TableHead className="text-xs font-bold">Reorder Min</TableHead>
                      <TableHead className="text-xs font-bold">Unit Price</TableHead>
                      <TableHead className="text-xs font-bold">Status</TableHead>
                      <TableHead className="text-xs font-bold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedicines.map((med) => (
                      <TableRow key={med.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                            {med.name}
                            {med.scheduleH1 && (
                              <Badge variant="destructive" className="text-[9px] px-1 py-0 h-4">
                                Sch H1
                              </Badge>
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground">{med.genericName}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-medium">{med.category}</div>
                          <div className="text-[10px] text-muted-foreground">{med.dosageForm}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-mono">{med.batchNumber}</div>
                          <div className="text-[10px] text-muted-foreground">{med.expiryDate}</div>
                        </TableCell>
                        <TableCell className="text-xs font-mono">{med.rackLocation}</TableCell>
                        <TableCell className="font-mono text-xs font-bold">
                          <span
                            className={
                              med.stockLevel === 0
                                ? "text-destructive font-bold"
                                : med.stockLevel <= med.minThreshold
                                ? "text-amber-600 font-bold"
                                : "text-emerald-600"
                            }
                          >
                            {med.stockLevel} {med.unit}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {med.minThreshold}
                        </TableCell>
                        <TableCell className="font-mono text-xs font-semibold">₹{med.unitPrice}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              med.status === "In Stock"
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]"
                                : med.status === "Low Stock"
                                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px]"
                                : med.status === "Out of Stock"
                                ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 text-[10px]"
                                : "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30 text-[10px]"
                            }
                          >
                            {med.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {(med.status === "Low Stock" || med.status === "Out of Stock") && (
                            <Button size="sm" variant="outline" asChild className="h-7 text-xs font-semibold">
                              <Link href="/procurement/create">
                                <ShoppingCart className="h-3 w-3 mr-1" /> Restock
                              </Link>
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
        </TabsContent>

        {/* TAB 2: STOCK ALERTS PANEL */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alerts.map((alert) => (
              <Card
                key={alert.id}
                className={`border shadow-xs ${
                  alert.severity === "Critical"
                    ? "border-destructive/40 bg-destructive/5"
                    : alert.severity === "High"
                    ? "border-amber-500/40 bg-amber-500/5"
                    : "border-cyan-500/40 bg-cyan-500/5"
                }`}
              >
                <CardHeader className="p-3.5 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-bold text-foreground">{alert.medicineName}</CardTitle>
                    <Badge
                      variant="outline"
                      className={
                        alert.severity === "Critical"
                          ? "bg-destructive text-destructive-foreground text-[10px]"
                          : "text-[10px]"
                      }
                    >
                      {alert.type}
                    </Badge>
                  </div>
                  <CardDescription className="text-[10px] font-mono mt-0.5">
                    {alert.thresholdOrExpiry}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3.5 pt-1 space-y-3">
                  <p className="text-xs text-foreground leading-relaxed">{alert.actionRequired}</p>
                  <Button size="sm" className="w-full text-xs font-semibold" asChild>
                    <Link href="/procurement/create">
                      <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Create Purchase Order
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 3: DISPENSING LOG (READ-ONLY OPERATIONAL VIEW) */}
        <TabsContent value="dispensing" className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold">Operational Prescription Dispensing Activity</CardTitle>
              <CardDescription className="text-xs">
                Read-only operational tracking of fulfilled medications, verifying pharmacist delivery logs.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-xs font-bold">Prescription #</TableHead>
                      <TableHead className="text-xs font-bold">Patient Details</TableHead>
                      <TableHead className="text-xs font-bold">Prescribing Doctor</TableHead>
                      <TableHead className="text-xs font-bold">Dispensed Medications &amp; Dosage</TableHead>
                      <TableHead className="text-xs font-bold">Dispensed By</TableHead>
                      <TableHead className="text-xs font-bold">Timestamp</TableHead>
                      <TableHead className="text-xs font-bold">Billed Amount</TableHead>
                      <TableHead className="text-xs font-bold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dispensingLogs.map((disp) => (
                      <TableRow key={disp.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono text-xs font-bold text-primary">
                          {disp.prescriptionNo}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-xs text-foreground">{disp.patientName}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{disp.patientId}</div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-medium">
                          {disp.doctorName}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            {disp.items.map((it, idx) => (
                              <div key={idx} className="text-xs">
                                <span className="font-semibold">{it.medicineName}</span> ({it.quantity}x) —{" "}
                                <span className="text-[11px] text-muted-foreground">{it.dosage}</span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-medium">{disp.pharmacistName}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {new Date(disp.dispensedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </TableCell>
                        <TableCell className="font-mono text-xs font-bold text-foreground">
                          ₹{disp.totalAmount}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]">
                            {disp.status}
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
      </Tabs>

      {/* Add Medicine Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSaveMedicine}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" /> Register New Formulary Medicine
              </DialogTitle>
              <DialogDescription className="text-xs">
                Add an active pharmaceutical product with inventory thresholds.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-3 text-xs">
              <div className="grid gap-1">
                <Label htmlFor="m-name">Medicine Brand Name *</Label>
                <Input
                  id="m-name"
                  required
                  placeholder="e.g. Ciprofloxacin 500mg"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="m-gen">Generic Salt / Composition</Label>
                <Input
                  id="m-gen"
                  required
                  placeholder="e.g. Ciprofloxacin Hydrochloride"
                  value={genericName}
                  onChange={(e) => setGenericName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="m-cat">Therapeutic Category</Label>
                  <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                    <SelectTrigger id="m-cat" className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                      <SelectItem value="Critical Emergency">Critical Emergency</SelectItem>
                      <SelectItem value="Cardiovascular">Cardiovascular</SelectItem>
                      <SelectItem value="Analgesics">Analgesics</SelectItem>
                      <SelectItem value="Gastrointestinal">Gastrointestinal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="m-form">Dosage Form</Label>
                  <Select value={dosageForm} onValueChange={(val: any) => setDosageForm(val)}>
                    <SelectTrigger id="m-form" className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tablet">Tablet</SelectItem>
                      <SelectItem value="Capsule">Capsule</SelectItem>
                      <SelectItem value="Injection / Vial">Injection / Vial</SelectItem>
                      <SelectItem value="IV Infusion">IV Infusion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="m-stock">Opening Stock</Label>
                  <Input
                    id="m-stock"
                    type="number"
                    required
                    value={stockLevel}
                    onChange={(e) => setStockLevel(Number(e.target.value))}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="m-min">Reorder Min</Label>
                  <Input
                    id="m-min"
                    type="number"
                    required
                    value={minThreshold}
                    onChange={(e) => setMinThreshold(Number(e.target.value))}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="m-price">Unit Price (₹)</Label>
                  <Input
                    id="m-price"
                    type="number"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="m-rack">Storage / Rack Location</Label>
                <Input
                  id="m-rack"
                  required
                  value={rackLocation}
                  onChange={(e) => setRackLocation(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Register SKU
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
