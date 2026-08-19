# 10 — OT & Surgical Operations

## Purpose
Covers surgical case creation, readiness tracking, OT scheduling, and the two
sourcing paths for a surgeon (internal assignment vs external request), plus
linking to vendor/procurement (module 11) for missing equipment/implants.

## Pages / Screens to Build
1. **Surgical Cases — List View**
   - Table: Case ID, Patient, Surgeon, OT slot, Readiness %, Status
   - Filters: Status, Department, Date, Readiness (has blockers / ready)
2. **Create Surgical Case**
   - Fields: Linked patient/care case, Procedure type, Preferred date/time, Department
3. **Case Detail Page** (tabs)
   - Overview: patient, surgeon, OT slot, status
   - **Readiness Checklist tab**: pre-op assessment, investigations, consent,
     blood/implant/equipment, other configured dependencies — each item shows
     status (Done/Missing/Overdue), owner, deadline
   - **Blockers tab**: auto-derived from incomplete checklist items — surfaces
     missing dependency, owner, deadline in one glance
   - **Surgeon tab**: assigned internal surgeon OR external request status
   - **Vendor Dependencies tab**: linked procurement requests (module 11) for
     implants/equipment/consumables, with their status
   - **Post-op tab**: recovery tasks, nursing tasks, documents, follow-up
4. **OT Scheduling Calendar**
   - Calendar/grid view: OT room × date/time, showing allocated cases, team, resources
   - Create/edit allocation (assign OT, date/time, team, resources) from here or from case detail
5. **Internal Surgeon Assignment**
   - Picker: hospital-affiliated surgeons filtered by specialty/availability
6. **External Surgeon Request Flow** (its own mini-workflow, steps below)
   - Create Request form → Sent state → Response tracking → Assign
7. **Surgeon Reliability View** (optional/proposed feature)
   - Response time + accepted/completed case history for network surgeons

## Surgeon Request Sub-Flow (steps 20–28 in PRD)
1. Admin/coordinator creates surgeon request
2. Select specialty/sub-specialty, case type, required time, location, urgency
3. Attach permitted case details + readiness info
4. Request sent to eligible surgeons/network
5. Surgeon accepts / declines / asks for clarification
6. Hospital selects/assigns surgeon (subject to credential checks)
7. Surgeon linked to case with **case-specific limited access only**
8. Case readiness + surgeon availability visible in the surgical control view
9. After completion, surgeon's case access auto-expires per policy

**Frontend note:** build this as a request-tracking table (like a ticket system) —
Request ID, Specialty, Urgency, Sent-to, Responses, Status — with a detail drawer
showing each surgeon's individual response.

## Core Admin Actions Checklist
- [ ] Create/manage a surgical case linked to a patient
- [ ] Track readiness checklist items (pre-op, investigations, consent, implant/equipment)
- [ ] Allocate OT room, date/time, team, and resources
- [ ] Assign an internal hospital-affiliated surgeon
- [ ] Create an external surgeon request when internal is unavailable
- [ ] Track surgeon responses (accept/decline/history)
- [ ] View case blockers (missing dependency + owner + deadline)
- [ ] Create a vendor/procurement request for missing implants/equipment
- [ ] Track post-op recovery/nursing/documents/follow-up

## States / Statuses to Handle in UI
- Case: `Planning`, `Ready`, `Blocked`, `Scheduled`, `In Progress`, `Completed`, `Cancelled`
- Checklist item: `Pending`, `Done`, `Missing`, `Overdue`
- Surgeon request: `Sent`, `Accepted`, `Declined`, `Clarification Requested`, `Assigned`, `Expired`

## Notifications Relevant to This Module
- Surgery blocker → Responsible surgeon + OT coordinator + Admin
- Surgeon request → Eligible surgeon(s) + case owner

## Edge Cases to Design For
- Case shows "Ready" only when **all** checklist items are Done — compute this
  client-side or expect a `readiness_score`/`readiness_percent` field from the API
- Scheduling an OT slot before the case is ready → allow but visibly warn
- Multiple surgeon requests sent for the same case → dedupe/track all responses,
  only one can end up "Assigned"
- External surgeon's access must **auto-expire** after case completion — reflect
  this visually (e.g., "Access expires: <date>" badge) so it's clear it's not permanent
