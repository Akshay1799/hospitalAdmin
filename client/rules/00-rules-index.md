# Hospital Admin — Granular Rules & Boundaries (Modules 5–11)

Source: `Hospital_admin_module.pdf` (Qlyno Hospital Admin Module, v2.0)

Purpose: these files are a **strict allow-list**. Each one enumerates exactly
what the Hospital Admin can access, perform, and manage in that module,
straight from the PRD — plus an explicit CANNOT list for every boundary the PRD
states or implies. Nothing in your build should let Admin do more than what's
listed as ✅ CAN. If a capability isn't in one of these files, treat it as out
of scope until the source doc is amended.

These are companion docs to the earlier frontend flow docs which we build/implemented from modules 05-11 — those describe *screens and UX*, these
describe *exact permission boundaries*. Use both together: the flow docs tell
you what to build, these tell you what each button is and isn't allowed to do.

| # | File | Module |
|---|---|---|
| 5 | [05-rules-nurse-station.md](./05-rules-nurse-station.md) | Nurse, Nurse Station & Support Staff Management |
| 6 | [06-rules-reception.md](./06-rules-reception.md) | Reception Management |
| 7 | [07-rules-patient-treatment.md](./07-rules-patient-treatment.md) | Patient & Treatment Management |
| 8 | [08-rules-emergency-sos.md](./08-rules-emergency-sos.md) | Emergency / SOS Management |
| 9 | [09-rules-ambulance.md](./09-rules-ambulance.md) | Ambulance Management |
| 10 | [10-rules-ot-surgical.md](./10-rules-ot-surgical.md) | OT & Surgical Operations |
| 11 | [11-rules-vendor-procurement.md](./11-rules-vendor-procurement.md) | Vendor Request & Procurement Management |

## Two Rules That Cut Across Every Module

**1. The Clinical Decision Boundary** (module-wide, from the PRD's opening
"Admin power - with a critical boundary" section):
> Diagnosis, prescribing, surgical decisions and other licensed clinical
> decisions remain attributable to the appropriate clinician — never the Admin,
> even when Admin is operating the relevant screen.

**2. The Delegation/Audit Labeling Rule** (Section 15):
> Whenever Admin performs an action that's normally owned by another role
> (Reception, Nurse Station, OT, Vendor, Emergency), the system must record it
> as *"Performed by Hospital Admin • acting within `<role>` workflow"* — never
> silently attributed to that role's own staff member.

Every module file above restates its own version of rule #2 where relevant;
rule #1 applies universally even where a module file doesn't repeat it verbatim.

