# 06 — Reception Management

## Purpose
Admin configures and oversees the front-desk workforce and routing rules.
Receptionists are **operational staff only** — they never diagnose, interpret
reports, or make clinical decisions. The UI must reflect this boundary (no
clinical action buttons anywhere in reception-facing views).

## Pages / Screens to Build
1. **Receptionists — List View**
   - Table: Name, Desk, Branch/Location, Department, Status
   - Filters: Branch, Department, Desk, Status
   - Row actions: View, Edit, Suspend, Replace
2. **Create / Edit Receptionist**
   - Fields: Personal info, Assigned desk(s), Branch, Department(s), Workflow scope
3. **Front Desk Monitor Dashboard** (Admin's live view)
   - Widgets: Today's registrations, Appointments, Check-ins, Token/Queue status, Patient routing status
   - Filter by desk/branch/department
4. **Routing Configuration**
   - Rules for OPD / walk-in / emergency / admission / diagnostics / discharge routing
   - Form: condition (patient type, department) → destination (queue/team)
5. **Permission Configuration Panel**
   - Matrix: Receptionist × (Organization + Location + Department + Action + Data Scope)
6. **Replace Receptionist Flow**
   - Wizard: select outgoing receptionist → select replacement → confirm patient
     ownership/history stays untouched → confirm
7. **Reception Performance Dashboard**
   - Charts: Workload per receptionist, Avg wait time, Registration volume, Exceptions/errors
8. **Communication Panel**
   - Hospital announcements list + create new announcement
   - Configured transactional communication/WhatsApp templates (view/manage)

## Core Admin Actions Checklist
- [ ] Create / edit / suspend a receptionist
- [ ] Assign receptionist to desk, branch, department, or workflow
- [ ] Configure routing rules for OPD/walk-in/emergency/admission/diagnostics/discharge
- [ ] Set granular permissions (org + location + department + action + data scope)
- [ ] Replace a receptionist without breaking patient ownership/history
- [ ] Monitor front-desk performance (workload, wait time, volume, exceptions)
- [ ] Send hospital-wide announcements / manage transactional comms

## States / Statuses to Handle in UI
- Receptionist: `Active`, `Suspended`, `Replaced`
- Queue/token: `Waiting`, `Called`, `In Progress`, `Completed`, `No-show`
- Routing status: `Pending Route`, `Routed`, `Escalated`

## Notifications Relevant to This Module
- New appointment/check-in → relevant receptionist + doctor/team
- Doctor delay → Admin + affected reception/department/patient workflow

## Edge Cases to Design For
- Replacing a receptionist mid-shift while queue has active patients
- Conflicting routing rules (two rules matching same case) → need a precedence/priority field in the rule builder
- Desk with no assigned receptionist should surface as a staffing gap alert
- Clearly disable/hide any action that implies a clinical decision (interpreting a
  report, altering a clinical order) — reception screens should route/escalate
  those, not resolve them
