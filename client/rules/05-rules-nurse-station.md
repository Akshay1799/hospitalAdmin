# Module 5 Rules — Nurse, Nurse Station & Support Staff Management

Source: PRD Section 5 (+ Section 15 delegation rule). This file defines the exact,
granular boundary of what Hospital Admin is allowed to access, perform, and manage
in this module — nothing beyond what is listed here should be built as an Admin
capability.

## Governing Principle (Section 5)
> "The Hospital Admin owns the hospital-wide nursing workforce configuration. The
> Nurse Station then manages day-to-day nursing operations."

Admin = policy/ownership layer, hospital-wide.
Nurse Station = execution layer, scoped to its own station.

## ✅ Admin CAN
1. Create a nurse profile (hospital-wide, not limited to one station)
2. Assign or reassign a nurse to any department, hospital-wide
3. Assign or reassign a nurse to any Nurse Station, hospital-wide
4. Create a support staff profile (attendant, housekeeping, assistant, etc.), hospital-wide
5. Define hospital-wide shift templates (the base rules every station must follow)
6. View the roster of every Nurse Station in the hospital
7. Control (edit/modify) the roster of any Nurse Station in the hospital
8. Approve or execute a shift change for any nurse or support staff, hospital-wide
9. Override a patient assignment made by a Nurse Station — as an **operational
   override**, not as the routine assignment mechanism
10. Monitor handovers occurring across any Nurse Station (view-only)
11. Configure/delegate staff permissions — decide what scope a Nurse Station or
    its staff are allowed to act within
12. View the full audit log across **all** Nurse Stations (hospital-wide scope)
13. Act as the higher-level organization owner for rotations, roster changes, and
    doctor coordination that the Nurse Station module supports

## ❌ Admin CANNOT
1. Perform patient assignment as the primary/routine workflow — that is the Nurse
   Station's job; Admin may only **override**, not replace, the normal process
2. Create, receive, or manage a handover directly — Admin may only **monitor** it
3. Restrict a Nurse Station's audit visibility below its own station scope (Nurse
   Station retains full audit rights within its own station)
4. Grant a Nurse Station permissions beyond what Admin has explicitly delegated
   ("Nurse Station: Only delegated permissions" — the ceiling is set by Admin)

## Delegation & Audit Requirement (Section 15)
> "Nurse Station: Can manage nurses, support staff, shifts, rosters, tasks and
> handovers."

Whenever Admin performs an action that is normally a Nurse Station action (e.g.
creating a nurse, editing a roster), the system must log it as:

> *"Performed by Hospital Admin • acting within Nurse Station workflow"*

— never silently attributed to the Nurse Station Lead.

## Source Reference Table (verbatim from PRD Section 5)
| Function | Hospital Admin | Nurse Station |
|---|---|---|
| Create nurse | Yes | Yes, within assigned station |
| Assign department/station | Yes | Within permitted scope |
| Create support staff | Yes | Yes, for configured station staff |
| Shift templates | Hospital-wide rules | Create/manage station roster |
| Roster | View/control hospital-wide | Manage assigned roster |
| Shift change | Yes | Yes, within scope |
| Patient assignment | Operational override | Primary operational workflow |
| Handover | Monitor | Create/receive/manage |
| Staff permissions | Yes | Only delegated permissions |
| Audit | Full hospital scope | Station scope |
