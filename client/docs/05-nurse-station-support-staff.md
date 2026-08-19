# 05 — Nurse, Nurse Station & Support Staff Management

## Purpose
Hospital Admin owns the **hospital-wide nursing workforce configuration**. A Nurse
Station then runs day-to-day nursing operations within the scope Admin grants it.
Think of Admin as the "policy layer" and Nurse Station as the "execution layer."

## Ownership Split (from PRD table)
| Function | Hospital Admin | Nurse Station |
|---|---|---|
| Create nurse | ✅ | ✅ (within own station) |
| Assign department/station | ✅ | Within permitted scope |
| Create support staff | ✅ | ✅ (configured station staff) |
| Shift templates | Hospital-wide rules | Create/manage station roster |
| Roster | View/control hospital-wide | Manage assigned roster |
| Shift change | ✅ | ✅ (within scope) |
| Patient assignment | Operational override only | Primary workflow |
| Handover | Monitor only | Create/receive/manage |
| Staff permissions | ✅ | Only delegated permissions |
| Audit | Full hospital scope | Station scope |

**Frontend implication:** every screen below needs to render differently (or hide
actions) depending on whether the logged-in user is Admin vs Nurse Station Lead —
but since you're building the *Admin panel*, assume full-access views with an
"acting as / scope" indicator, per the delegation model in section 15.

## Pages / Screens to Build
1. **Nurse Stations — List View**
   - Table: Station name, Department/Location, Station Lead, # Nurses, # Support Staff, Status (Active/Inactive)
   - Filters: Department, Location/Branch, Status
   - Row actions: View, Edit, Deactivate
2. **Create / Edit Nurse Station** (form/modal)
   - Fields: Station name, Department, Location, Station Lead (staff picker), Status
3. **Nurse Station Detail Page** (tabs)
   - Overview tab: station info, lead, stats
   - Nurses tab: list of nurses assigned to this station
   - Support Staff tab: list of support staff assigned
   - Shift Templates tab
   - Roster tab (calendar/grid)
   - Handover Log tab (read-only monitor for Admin)
4. **Nurses — Global List View**
   - Table: Name, Station, Department, Role/Scope, Status (On Duty/Off Duty/On Leave/Unassigned)
   - Filters: Station, Department, Status
   - Search by name/ID
5. **Create / Edit Nurse Form**
   - Fields: Personal info, Qualification, Department, Station assignment, Shift/Schedule, Scope of role, Status
6. **Support Staff — List + Create/Edit Form**
   - Fields: Name, Type (attendant/housekeeping/assistant/etc.), Assigned station/task scope, Status
7. **Shift Templates — Hospital-wide Configuration**
   - List of templates (Morning/Evening/Night etc.) with time ranges
   - Create/Edit template form
   - Assign template → applies as default for stations
8. **Roster / Schedule View**
   - Calendar or grid (by day/week) showing who's on duty per station
   - Hospital-wide toggle vs per-station filter
   - Shift-change request list with Approve/Reject actions
9. **Staff Permissions Panel**
   - Matrix UI: staff member × permission toggle (station-scoped vs hospital-wide)
10. **Audit Log (Nurse/Station scope)**
    - Table: Actor, Action, Entity, Before/After, Timestamp, Reason
    - Filter by station, staff, action type

## Core Admin Actions Checklist
- [ ] Create / edit / deactivate a Nurse Station
- [ ] Assign a Station Lead
- [ ] Create / edit / deactivate a Nurse (hospital-wide)
- [ ] Assign / reassign a nurse to a station or department
- [ ] Create / edit / deactivate Support Staff
- [ ] Define hospital-wide Shift Templates
- [ ] View hospital-wide roster (all stations)
- [ ] Approve or override a shift change
- [ ] Override patient assignment (exception case, not routine)
- [ ] Monitor handovers (read-only)
- [ ] Configure staff permissions (delegate scoped access)
- [ ] View full audit trail across all stations

## States / Statuses to Handle in UI
- Station: `Active`, `Inactive`
- Nurse / Support staff: `On Duty`, `Off Duty`, `On Leave`, `Late`, `Absent`, `Unassigned`
- Shift change request: `Pending`, `Approved`, `Rejected`
- Roster entry: `Scheduled`, `Confirmed`, `Swapped`, `Cancelled`

## Notifications Relevant to This Module
- Staffing gap (department head + Admin)
- Shift change submitted/approved
- Handover pending/overdue

## Edge Cases to Design For
- Reassigning a nurse who has active patient assignments → confirm/transfer step
- Deactivating a station that still has an active roster → block or force-reassign
- Overlapping/duplicate shifts for the same staff member → warn before save
- Admin overriding patient assignment must be visibly logged as
  *"Performed by Hospital Admin • acting within Nurse Station workflow"* (never
  attributed to the nurse/station lead) — build this label into every override UI.
