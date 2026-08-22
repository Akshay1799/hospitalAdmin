"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Layers,
  Package,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  ShoppingCart,
  Sparkles,
  Truck,
  User,
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
  mockInventoryCatalog,
  mockStockIndents,
} from "@/lib/mock-data/section12-operations";
import { InventoryItem, StockIndent } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const DELEGATION_STRING = "Performed by Hospital Admin • acting within Central Store Management workflow";

export default function InventoryPage() {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("catalog");
  const [catalog, setCatalog] = useState<InventoryItem[]>(mockInventoryCatalog);
  const [indents, setIndents] = useState<StockIndent[]>(mockStockIndents);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Add Item Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [category, setCategory] = useState<any>("Surgical Consumables");
  const [stockLevel, setStockLevel] = useState(500);
  const [unit, setUnit] = useState("Pieces");
  const [reorderLevel, setReorderLevel] = useState(150);
  const [supplierName, setSupplierName] = useState("3M India Ltd.");
  const [unitCost, setUnitCost] = useState(85);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredCatalog = useMemo(() => {
    return catalog.filter((it) => {
      const matchesSearch =
        it.name.toLowerCase().includes(search.toLowerCase()) ||
        it.itemCode.toLowerCase().includes(search.toLowerCase()) ||
        it.supplierName.toLowerCase().includes(search.toLowerCase());
      const matchesCat = categoryFilter === "all" || it.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || it.status === statusFilter;
      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [catalog, search, categoryFilter, statusFilter]);

  const handleApproveIndent = (indent: StockIndent) => {
    setIndents((prev) =>
      prev.map((ind) => (ind.id === indent.id ? { ...ind, status: "Dispatched" } : ind))
    );

    toast({
      title: "Stock Indent Dispatched",
      description: `${indent.indentNo} dispatched to ${indent.department}. (${DELEGATION_STRING})`,
    });
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: InventoryItem = {
      id: `inv_${Date.now()}`,
      itemCode: itemCode || `ITM-${Date.now().toString().slice(-4)}`,
      name: itemName,
      category,
      stockLevel,
      unit,
      reorderLevel,
      leadTimeDays: 3,
      supplierName,
      unitCost,
      status: stockLevel <= reorderLevel ? "Low Stock" : "Adequate",
    };

    setCatalog((prev) => [newItem, ...prev]);
    toast({
      title: "Consumable Stock Registered",
      description: `${itemName} added to store catalog. (${DELEGATION_STRING})`,
    });
    setAddModalOpen(false);
  };

  if (!mounted) {
    return (
      <div className="space-y-4 animate-fade-in pb-12">
        <PageHeader
          title="Hospital Central Inventory &amp; Stock"
          description="Consumables stock tracking, department indents dispatch, reorder thresholds, and procurement links."
          crumbs={[{ label: "Supply & Assets" }, { label: "Inventory" }]}
        />
        <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
          Loading central store inventory...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      <PageHeader
        title="Hospital Central Inventory &amp; Stock"
        description="Consumables stock tracking, department indents dispatch, reorder thresholds, and procurement links."
        crumbs={[{ label: "Supply & Assets" }, { label: "Inventory" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" asChild className="gap-1.5 font-semibold text-xs">
              <Link href="/procurement/create">
                <ShoppingCart className="h-4 w-4 text-primary" /> Create Purchase Order
              </Link>
            </Button>
            <Button size="sm" className="gap-1.5 font-semibold text-xs" onClick={() => setAddModalOpen(true)}>
              <Plus className="h-4 w-4" /> Add Consumable
            </Button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <ScopeIndicator scope="Hospital Admin" stationName="Central General Stores &amp; Supply Chain" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md border border-border">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
          <span>Operational inventory management • Reorders feed directly into Vendor Procurement</span>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Total Store SKUs</span>
          <p className="text-xl font-bold font-mono text-primary mt-0.5">{catalog.length} Items</p>
          <span className="text-[10px] text-muted-foreground">Active supply catalog</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Low Stock Items</span>
          <p className="text-xl font-bold font-mono text-amber-600 mt-0.5">
            {catalog.filter((i) => i.status === "Low Stock").length} Consumables
          </p>
          <span className="text-[10px] text-amber-600 font-medium">Reorder indent triggered</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Pending Ward Indents</span>
          <p className="text-xl font-bold font-mono text-cyan-600 mt-0.5">
            {indents.filter((i) => i.status === "Pending Approval").length} Indents
          </p>
          <span className="text-[10px] text-cyan-600 font-medium">Awaiting dispatch sign-off</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Store Lead Time</span>
          <p className="text-xl font-bold font-mono text-emerald-600 mt-0.5">2.5 Days</p>
          <span className="text-[10px] text-emerald-600 font-medium">Average supplier fulfillment</span>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 max-w-xs">
          <TabsTrigger value="catalog" className="text-xs">Supplies Catalog</TabsTrigger>
          <TabsTrigger value="indents" className="text-xs">Department Indents ({indents.length})</TabsTrigger>
        </TabsList>

        {/* TAB 1: CATALOG */}
        <TabsContent value="catalog" className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold">Medical Supplies &amp; Consumables Directory</CardTitle>
              <CardDescription className="text-xs">
                Track stock quantities, reorder thresholds, and active supplier partnerships.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search item code, name, supplier..."
                    className="pl-8 text-xs h-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[160px] text-xs h-9">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Surgical Consumables">Surgical Consumables</SelectItem>
                      <SelectItem value="PPE & Hygiene">PPE &amp; Hygiene</SelectItem>
                      <SelectItem value="Diagnostic Reagents">Diagnostic Reagents</SelectItem>
                      <SelectItem value="Wound Care">Wound Care</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px] text-xs h-9">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Adequate">Adequate</SelectItem>
                      <SelectItem value="Low Stock">Low Stock</SelectItem>
                      <SelectItem value="Reorder Placed">Reorder Placed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-xs font-bold">Item Code</TableHead>
                      <TableHead className="text-xs font-bold">Consumable Item Name</TableHead>
                      <TableHead className="text-xs font-bold">Category</TableHead>
                      <TableHead className="text-xs font-bold">Stock In Hand</TableHead>
                      <TableHead className="text-xs font-bold">Reorder Level</TableHead>
                      <TableHead className="text-xs font-bold">Primary Supplier</TableHead>
                      <TableHead className="text-xs font-bold">Unit Cost</TableHead>
                      <TableHead className="text-xs font-bold">Status</TableHead>
                      <TableHead className="text-xs font-bold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCatalog.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono text-xs font-bold text-primary">
                          {item.itemCode}
                        </TableCell>
                        <TableCell className="font-semibold text-xs text-foreground">
                          {item.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs font-bold">
                          <span className={item.status === "Low Stock" ? "text-amber-600 font-bold" : "text-emerald-600"}>
                            {item.stockLevel} {item.unit}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {item.reorderLevel} {item.unit}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{item.supplierName}</TableCell>
                        <TableCell className="font-mono text-xs font-semibold">₹{item.unitCost}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              item.status === "Adequate"
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]"
                                : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px]"
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.status === "Low Stock" && (
                            <Button size="sm" variant="outline" asChild className="h-7 text-xs font-semibold">
                              <Link href="/procurement/create">
                                <ShoppingCart className="h-3 w-3 mr-1" /> Reorder
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

        {/* TAB 2: DEPARTMENT INDENTS */}
        <TabsContent value="indents" className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold">Department Stock Indent Requisitions</CardTitle>
              <CardDescription className="text-xs">
                Review supply requisitions submitted by OT, ICU, Emergency, and Wards.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-xs font-bold">Indent #</TableHead>
                      <TableHead className="text-xs font-bold">Requesting Department</TableHead>
                      <TableHead className="text-xs font-bold">Requested Items</TableHead>
                      <TableHead className="text-xs font-bold">Authorizing Staff</TableHead>
                      <TableHead className="text-xs font-bold">Requested Time</TableHead>
                      <TableHead className="text-xs font-bold">Status</TableHead>
                      <TableHead className="text-xs font-bold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {indents.map((ind) => (
                      <TableRow key={ind.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono text-xs font-bold text-primary">
                          {ind.indentNo}
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-foreground">{ind.department}</TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            {ind.items.map((it, idx) => (
                              <div key={idx} className="text-xs">
                                <span className="font-medium text-foreground">{it.itemName}</span> —{" "}
                                <span className="font-mono font-bold text-primary">{it.quantity} Units</span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-medium">
                          {ind.requestedBy}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {new Date(ind.requestedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              ind.status === "Dispatched"
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]"
                                : "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30 text-[10px]"
                            }
                          >
                            {ind.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {ind.status === "Pending Approval" ? (
                            <Button
                              size="sm"
                              className="h-7 text-xs font-semibold"
                              onClick={() => handleApproveIndent(ind)}
                            >
                              <Send className="h-3.5 w-3.5 mr-1" /> Approve &amp; Dispatch
                            </Button>
                          ) : (
                            <span className="text-[11px] text-muted-foreground font-mono">Dispatched</span>
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
      </Tabs>

      {/* Add Consumable Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSaveItem}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Add Medical Consumable / Item
              </DialogTitle>
              <DialogDescription className="text-xs">
                Register a new consumable SKU with reorder parameters.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-3 text-xs">
              <div className="grid gap-1">
                <Label htmlFor="i-name">Item Name *</Label>
                <Input
                  id="i-name"
                  required
                  placeholder="e.g. Endotracheal Tube Size 7.5"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="i-code">Item Code</Label>
                  <Input
                    id="i-code"
                    placeholder="e.g. SURG-ET-75"
                    value={itemCode}
                    onChange={(e) => setItemCode(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="i-cat">Category</Label>
                  <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                    <SelectTrigger id="i-cat" className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Surgical Consumables">Surgical Consumables</SelectItem>
                      <SelectItem value="PPE & Hygiene">PPE &amp; Hygiene</SelectItem>
                      <SelectItem value="Diagnostic Reagents">Diagnostic Reagents</SelectItem>
                      <SelectItem value="Wound Care">Wound Care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="i-stock">Initial Stock</Label>
                  <Input
                    id="i-stock"
                    type="number"
                    required
                    value={stockLevel}
                    onChange={(e) => setStockLevel(Number(e.target.value))}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="i-unit">Unit</Label>
                  <Input
                    id="i-unit"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="i-reorder">Reorder Min</Label>
                  <Input
                    id="i-reorder"
                    type="number"
                    required
                    value={reorderLevel}
                    onChange={(e) => setReorderLevel(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="i-sup">Primary Supplier</Label>
                  <Input
                    id="i-sup"
                    required
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="i-cost">Unit Cost (₹)</Label>
                  <Input
                    id="i-cost"
                    type="number"
                    required
                    value={unitCost}
                    onChange={(e) => setUnitCost(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Register Consumable
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
