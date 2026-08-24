"use client";

import React from "react";
import { ShieldCheck, UserCheck, Users, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DelegationActorBadgeProps {
  actorName?: string;
  actorRole?: string;
  workflowRole: string;
  delegatedBy?: string;
  variant?: "inline" | "pill" | "ribbon" | "card";
  className?: string;
}

export function DelegationActorBadge({
  actorName = "Hospital Admin",
  actorRole = "Hospital Administrator",
  workflowRole,
  delegatedBy,
  variant = "inline",
  className = "",
}: DelegationActorBadgeProps) {
  // Verbatim phrasing requirement from PRD Section 15 & Module 15 Rules:
  // "Performed by Hospital Admin • acting within <Role> workflow"
  // "Performed by <Manager> • delegated by Hospital Admin"
  const isDirectAdmin = !delegatedBy || actorName.includes("Admin");
  
  const labelText = isDirectAdmin
    ? `Performed by ${actorName} • acting within ${workflowRole} workflow`
    : `Performed by ${actorName} • delegated by ${delegatedBy}`;

  if (variant === "pill") {
    return (
      <Badge
        variant="outline"
        className={`text-[10px] font-medium py-0.5 px-2 bg-primary/5 text-primary border-primary/20 flex items-center gap-1.5 ${className}`}
      >
        <ShieldCheck className="h-3 w-3 text-primary shrink-0" />
        <span className="truncate">{labelText}</span>
      </Badge>
    );
  }

  if (variant === "ribbon") {
    return (
      <div
        className={`p-2 rounded-md border border-primary/20 bg-primary/5 text-primary flex items-center justify-between text-xs font-medium ${className}`}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <span className="font-semibold">{labelText}</span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">Delegated Capability (PRD S15)</span>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`p-3 rounded-lg border border-border bg-card shadow-xs flex flex-col gap-1 text-xs ${className}`}
      >
        <div className="flex items-center gap-1.5 text-primary font-bold text-[11px]">
          <Workflow className="h-3.5 w-3.5" />
          <span>Operational Delegation Context</span>
        </div>
        <p className="text-foreground font-semibold">{labelText}</p>
        <p className="text-[10px] text-muted-foreground">
          Never attributed to frontline staff • full clinical and audit accountability retained.
        </p>
      </div>
    );
  }

  // Default: inline
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 ${className}`}
    >
      <ShieldCheck className="h-3 w-3 text-primary shrink-0" />
      <span>{labelText}</span>
    </span>
  );
}
