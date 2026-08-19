"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Building2,
  ChevronDown,
  CreditCard,
  FileText,
  FlaskConical,
  Search,
  Stethoscope,
  User,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { patients } from "@/lib/mock-data/patients";
import { doctors } from "@/lib/mock-data/doctors";
import { detailedDepartments } from "@/lib/mock-data/departments";
import { labOrders } from "@/lib/mock-data/operations";
import { invoices } from "@/lib/mock-data/invoices";

interface HighlightedSnippet {
  label?: string;
  text: string;
}

interface SpotlightResult {
  id: string;
  category: "Patient" | "Doctor" | "Department" | "Lab Report" | "Billing";
  title: string;
  href: string;
  snippets: HighlightedSnippet[];
}

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim() || !text) return <>{text}</>;

  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-[#fcd34d] text-slate-950 font-semibold px-1 py-0.5 rounded mx-0.5 inline-block leading-none"
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

export function GlobalSearch() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: Ctrl+K or / to open, Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const q = query.trim().toLowerCase();

  // Search Results with deep contextual snippets
  const results: SpotlightResult[] = [];

  if (q) {
    // 1. Search Patients
    patients.forEach((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchId = p.id.toLowerCase().includes(q) || p.qlynoPatientId.toLowerCase().includes(q);
      const matchPhone = p.phone.toLowerCase().includes(q);
      const matchBlood = p.bloodGroup.toLowerCase().includes(q);
      const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));
      const opdMatch = p.hospitalRelationships?.[0]?.opdHistory?.filter(
        (o) =>
          o.visitReason?.toLowerCase().includes(q) ||
          o.consultationNotes?.toLowerCase().includes(q) ||
          o.doctor?.toLowerCase().includes(q) ||
          o.department?.toLowerCase().includes(q)
      );

      if (matchName || matchId || matchPhone || matchBlood || matchTags || (opdMatch && opdMatch.length > 0)) {
        const snippets: HighlightedSnippet[] = [];

        snippets.push({
          label: "UHID & Identifiers",
          text: `Qlyno ID: ${p.qlynoPatientId} • Gender: ${p.gender} • Blood Group: ${p.bloodGroup} • Phone: ${p.phone}`,
        });

        if (p.tags && p.tags.length > 0) {
          snippets.push({
            label: "Medical Conditions & Tags",
            text: p.tags.join(", "),
          });
        }

        if (opdMatch && opdMatch.length > 0) {
          opdMatch.forEach((o) => {
            snippets.push({
              label: `Consultation (${o.department} - ${o.doctor})`,
              text: `Visit Reason: "${o.visitReason}" — Notes: "${o.consultationNotes || "Routine follow-up"}"`,
            });
          });
        }

        results.push({
          id: `pat-${p.id}`,
          category: "Patient",
          title: `${p.name} — ${p.qlynoPatientId}`,
          href: `/patients/${p.id}`,
          snippets,
        });
      }
    });

    // 2. Search Doctors
    doctors.forEach((d) => {
      const matchName = d.name.toLowerCase().includes(q);
      const matchSpec = d.specialty.toLowerCase().includes(q) || d.subSpecialty?.toLowerCase().includes(q);
      const matchDept = d.department.toLowerCase().includes(q);
      const matchPhone = d.phone.toLowerCase().includes(q);
      const matchEmail = d.email.toLowerCase().includes(q);
      const matchPriv = d.privileges?.some((priv) => priv.toLowerCase().includes(q));

      if (matchName || matchSpec || matchDept || matchPhone || matchEmail || matchPriv) {
        const snippets: HighlightedSnippet[] = [];

        snippets.push({
          label: "Specialty & Credentials",
          text: `${d.specialty} (${d.subSpecialty || "General"}) • Qualification: ${d.qualification} • ${d.experienceYears} Years Experience`,
        });

        snippets.push({
          label: "Clinical Department & Privileges",
          text: `Department: ${d.department} • Privileges: ${d.privileges?.join(", ")}`,
        });

        snippets.push({
          label: "Contact & Registration",
          text: `Reg No: ${d.registrationNo} • Phone: ${d.phone} • Email: ${d.email}`,
        });

        results.push({
          id: `doc-${d.id}`,
          category: "Doctor",
          title: `${d.name} — ${d.specialty}`,
          href: `/doctors/${d.id}`,
          snippets,
        });
      }
    });

    // 3. Search Departments
    detailedDepartments.forEach((dept) => {
      const matchName = dept.name.toLowerCase().includes(q);
      const matchType = dept.type.toLowerCase().includes(q);
      const matchHead = dept.headName.toLowerCase().includes(q);
      const matchProc = dept.scope.clinicalProcedures.some((proc) => proc.toLowerCase().includes(q));

      if (matchName || matchType || matchHead || matchProc) {
        const snippets: HighlightedSnippet[] = [];

        snippets.push({
          label: "Location & Leadership",
          text: `Location: ${dept.floor}, ${dept.location} • Head of Dept: ${dept.headName} (${dept.headTitle})`,
        });

        snippets.push({
          label: "Clinical Procedures in Scope",
          text: dept.scope.clinicalProcedures.join(", "),
        });

        snippets.push({
          label: "Operational Capacity",
          text: `${dept.activePatients} Active Inpatients • Bed Capacity: ${dept.bedCapacity || "N/A"} • Shift Model: ${dept.shiftModel}`,
        });

        results.push({
          id: `dept-${dept.id}`,
          category: "Department",
          title: `${dept.name} — Operational Care Unit`,
          href: `/departments/${dept.id}`,
          snippets,
        });
      }
    });

    // 4. Search Lab Orders & Diagnostic Reports
    labOrders.forEach((lab) => {
      const matchOrder = lab.orderNo.toLowerCase().includes(q);
      const matchPatient = lab.patientName.toLowerCase().includes(q);
      const matchTest = lab.test.toLowerCase().includes(q);
      const matchDoc = lab.orderingDoctor.toLowerCase().includes(q);

      if (matchOrder || matchPatient || matchTest || matchDoc) {
        const snippets: HighlightedSnippet[] = [];

        snippets.push({
          label: "Diagnostic Investigation",
          text: `Test Name: ${lab.test} • Turnaround Time: ${lab.tat} • Status: ${lab.status.toUpperCase()}`,
        });

        snippets.push({
          label: "Patient & Ordering Clinician",
          text: `Patient: ${lab.patientName} • Ordering Doctor: ${lab.orderingDoctor} • Source: ${lab.source}`,
        });

        results.push({
          id: `lab-${lab.id}`,
          category: "Lab Report",
          title: `${lab.test} (${lab.orderNo})`,
          href: `/lab/${lab.id}`,
          snippets,
        });
      }
    });

    // 5. Search Invoices
    invoices.forEach((inv) => {
      const matchInv = inv.invoiceNo.toLowerCase().includes(q);
      const matchPatient = inv.patientName.toLowerCase().includes(q);
      const matchService = inv.service.toLowerCase().includes(q);

      if (matchInv || matchPatient || matchService) {
        const snippets: HighlightedSnippet[] = [];

        snippets.push({
          label: "Billed Hospital Service",
          text: `Service Description: ${inv.service} • Payment Method: ${inv.method || "Cash/UPI"}`,
        });

        snippets.push({
          label: "Financial Summary",
          text: `Patient: ${inv.patientName} • Total Bill: ₹${inv.amount.toLocaleString("en-IN")} • Amount Paid: ₹${inv.paid.toLocaleString("en-IN")} • Outstanding: ₹${inv.outstanding.toLocaleString("en-IN")}`,
        });

        results.push({
          id: `inv-${inv.id}`,
          category: "Billing",
          title: `${inv.invoiceNo} — ₹${inv.amount.toLocaleString("en-IN")}`,
          href: `/billing`,
          snippets,
        });
      }
    });
  }

  const filteredResults =
    filterCategory === "All"
      ? results
      : results.filter((r) => r.category === filterCategory);

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      {/* Search Bar Trigger in Header */}
      <div className="relative w-full max-w-md">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between gap-3 h-9 px-3 rounded-lg bg-secondary/80 hover:bg-secondary border border-transparent hover:border-border text-muted-foreground transition-all cursor-text text-left"
        >
          <div className="flex items-center gap-2 text-xs">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span>Search patients, doctors, invoices, orders...</span>
          </div>
        </button>
      </div>

      {/* EXACT SPOTLIGHT / DOCSEARCH STYLE SEARCH MODAL */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden border border-border bg-card shadow-2xl rounded-2xl [&>button.absolute]:hidden">
          <DialogTitle className="sr-only">Hospital Universal Search</DialogTitle>

          {/* Top Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-card">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search hospital records..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-normal"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded border border-border bg-muted/60 px-2 py-1 text-[11px] font-mono text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              ESC
            </button>
          </div>

          {/* Search Results Area */}
          <div
            ref={listRef}
            className="max-h-[440px] overflow-y-auto p-4 space-y-4 scrollbar-thin bg-card"
          >
            {!query.trim() ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                <p className="font-semibold text-foreground text-sm">Type to search hospital database</p>
                <p className="mt-1 text-xs">Find patients by name or UHID, doctors by specialty, lab tests, and invoices.</p>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                <p className="font-semibold text-foreground text-sm">No results found for &ldquo;{query}&rdquo;</p>
                <p className="mt-1 text-xs">Try searching with a different keyword or filter category.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item.href)}
                    className="p-3.5 rounded-xl border border-transparent hover:border-border hover:bg-muted/40 transition-all cursor-pointer group"
                  >
                    {/* Category Label (e.g. 'Blog' in image -> 'Patient', 'Doctor', etc.) */}
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      {item.category}
                    </div>

                    {/* Result Header Title */}
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
                      <HighlightText text={item.title} query={query} />
                    </h3>

                    {/* Section Snippet Lines with Yellow Highlights (Exact as in image) */}
                    <div className="mt-2 space-y-1.5 text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-border/60">
                      {item.snippets.map((snip, sIdx) => (
                        <p key={sIdx} className="break-words">
                          {snip.label && (
                            <span className="font-semibold text-foreground/80 mr-1.5">
                              {snip.label}:
                            </span>
                          )}
                          <HighlightText text={snip.text} query={query} />
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Filter & Navigation Footer (Matches image bottom bar) */}
          <div className="px-4 py-2.5 bg-muted/30 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            {/* Filter Dropdown on Bottom Left */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-foreground">Filter</span>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="h-7 text-xs border-border bg-background px-2.5 gap-1.5 font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Patient">Patients</SelectItem>
                  <SelectItem value="Doctor">Doctors</SelectItem>
                  <SelectItem value="Department">Departments</SelectItem>
                  <SelectItem value="Lab Report">Lab Reports</SelectItem>
                  <SelectItem value="Billing">Billing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Scroll Navigation Indicators on Bottom Right */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono">{filteredResults.length} match(es)</span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <button
                  type="button"
                  onClick={() => listRef.current?.scrollBy({ top: -100, behavior: "smooth" })}
                  className="p-1 rounded hover:bg-muted hover:text-foreground"
                  title="Scroll Up"
                >
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => listRef.current?.scrollBy({ top: 100, behavior: "smooth" })}
                  className="p-1 rounded hover:bg-muted hover:text-foreground"
                  title="Scroll Down"
                >
                  <ArrowDown className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
