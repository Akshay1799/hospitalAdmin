"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { MoreHorizontal } from "lucide-react";
import { RootState } from "@/store/store";
import { NurseStationEntity } from "@/lib/types/nursing-module";
import { setStationStatus } from "@/store/slices/nursingOperationsSlice";
import { RoleGate } from "@/components/nursing/role-gate";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ScopeIndicator } from "@/components/shared/ScopeIndicator";
import { NurseStationForm } from "@/components/nurse-stations/NurseStationForm";

export default function NurseStationsPage() {
  const dispatch = useDispatch();
  const { stations, nurses, supportStaff, currentUserName } = useSelector((state: RootState) => state.nursingOperations);
  const [query, setQuery] = useState(""); const [formOpen, setFormOpen] = useState(false); const [editing, setEditing] = useState<NurseStationEntity | null>(null);
  const rows = useMemo(() => stations.filter((station) => `${station.name} ${station.department_name} ${station.location_name}`.toLowerCase().includes(query.toLowerCase())), [stations, query]);
  return <RoleGate allowed={["admin"]}><div className="space-y-6"><div className="flex justify-between items-center"><div><h1 className="text-3xl font-bold tracking-tight">Nurse Stations</h1><p className="text-muted-foreground mt-1">Manage station configuration, leaders and scoped nursing workforce.</p></div><ScopeIndicator scope="Hospital Admin" /></div><div className="flex justify-between items-center bg-background p-4 rounded-md border gap-3"><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search station, department or location..." className="max-w-sm" /><Button onClick={() => { setEditing(null); setFormOpen(true); }}>Create Nurse Station</Button></div><div className="rounded-md border bg-background"><Table><TableHeader><TableRow><TableHead>Station Name</TableHead><TableHead>Department / Location</TableHead><TableHead>Station Lead</TableHead><TableHead className="text-center">Nurses</TableHead><TableHead className="text-center">Support</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{rows.map((station) => <TableRow key={station.station_id}><TableCell className="font-medium">{station.name}</TableCell><TableCell><div>{station.department_name}</div><div className="text-xs text-muted-foreground">{station.location_name}</div></TableCell><TableCell>{station.lead_name || "Unassigned"}</TableCell><TableCell className="text-center">{nurses.filter((item) => item.station_id === station.station_id && item.status === "Active").length}</TableCell><TableCell className="text-center">{supportStaff.filter((item) => item.station_id === station.station_id && item.status === "Active").length}</TableCell><TableCell><StatusBadge status={station.status} /></TableCell><TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem asChild><Link href="/nurse-station">Open station workspace</Link></DropdownMenuItem><DropdownMenuItem onClick={() => { setEditing(station); setFormOpen(true); }}>Edit station</DropdownMenuItem><DropdownMenuItem className="text-destructive" onClick={() => dispatch(setStationStatus({ stationId: station.station_id, status: station.status === "Active" ? "Inactive" : "Active", actor: currentUserName, reason: "Station administration update" }))}>{station.status === "Active" ? "Deactivate" : "Activate"}</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}</TableBody></Table></div><NurseStationForm isOpen={formOpen} onClose={() => setFormOpen(false)} station={editing} /></div></RoleGate>;
}
