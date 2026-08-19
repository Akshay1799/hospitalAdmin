"use client";

import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RootState } from "@/store/store";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AmbulanceHistoryPage() {
  const history = useSelector((state: RootState) => state.ambulance.dispatchHistory);
  const ambulances = useSelector((state: RootState) => state.ambulance.fleet);
  const [search, setSearch] = useState("");

  const filteredHistory = history
    .filter(log => 
      log.id.toLowerCase().includes(search.toLowerCase()) || 
      (log.caseId && log.caseId.toLowerCase().includes(search.toLowerCase())) ||
      log.destinationHospital.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/ambulance">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          title="Dispatch History Log"
          description="Record of all ambulance runs, origins, destinations, and timestamps."
        />
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4 w-full md:w-1/3">
          <Search className="h-4 w-4 text-muted-foreground absolute ml-3" />
          <Input 
            placeholder="Search by Dispatch ID, Case ID, or Destination..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>Dispatch ID</TableHead>
                <TableHead>Ambulance</TableHead>
                <TableHead>Linked Case</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map(log => {
                const amb = ambulances.find(a => a.id === log.ambulanceId);
                return (
                  <TableRow key={log.id}>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">{log.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{amb?.vehicleNo || log.ambulanceId}</div>
                    </TableCell>
                    <TableCell>
                      {log.caseId ? (
                        <Link href={`/emergency/${log.caseId}`} className="text-primary hover:underline font-medium">
                          {log.caseId}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.caseId ? <span className="text-sm">Patient Location</span> : <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell>{log.destinationHospital}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === 'Completed' ? 'success' : log.status === 'In Progress' ? 'warning' : 'secondary'}>
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No dispatch records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
