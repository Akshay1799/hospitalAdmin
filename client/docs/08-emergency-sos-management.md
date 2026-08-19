# 08 — Emergency / SOS Management

## Purpose
The highest-stakes module. Design principle from the PRD: **"optimize for fast
routing and accountable human response, not autonomous clinical decision-making."**
Every alert needs a visible delivery state, an owner, an escalation path, and an
audit trail — the UI's entire job is to make those four things impossible to miss.

## The Two Source Flows (build both as visual case timelines)

### Flow A — Existing hospital patient (has active treatment relationship)
1. Patient presses SOS in app
2. Qlyno identifies patient + checks active hospital relationship
3. Treating hospital becomes primary destination
4. Hospital Emergency workflow receives high-priority alert (identity, location, context)
5. Emergency/Reception/Nurse/clinical team notified per escalation policy
6. Ambulance dispatch initiated if configured & available
7. Hospital gets pre-arrival alert to prepare
8. Patient/family get status updates (if configured)
9. If hospital can't accept / no resource → fallback to nearby connected hospital
10. Every step logged: created → notified → ack → ambulance status → fallback → arrival → closure

### Flow B — Patient with no current treating hospital
1. SOS activated
2. Location obtained
3. Nearby connected hospitals with emergency capability + availability identified
4. Routing policy selects destination
5. Hospital receives alert + acknowledgement workflow
6. Ambulance dispatch only if a participating service is available
7. If no ack → escalation/fallback rules activate
8. Patient/family status updates where available

## Pages / Screens to Build
1. **Live Emergency Board** (the core screen)
   - Card/table per active case: Case ID, Patient, Location, Destination, Priority,
     Ack status, Owner, SLA countdown timer
   - Color-coded urgency (red = unacknowledged past SLA)
   - Sort: newest first / by priority / by SLA breach risk
2. **Case Detail View**
   - Vertical stepper/timeline showing exactly the flow above with timestamps
   - Action buttons: Acknowledge, Escalate, Trigger Family Alert, Close
3. **Acknowledge Modal**
   - Confirms admin receipt → routes to clinical emergency team (not a clinical action itself)
4. **Emergency Capacity Config**
   - Form: available emergency beds/resources, operating hours, capability flags
5. **Escalation Ladder Config**
   - Ordered list builder: Reception → Emergency Coordinator → Clinical Team → Admin,
     with per-step time thresholds
6. **Fallback / Transfer Routing Rules Config**
   - Rule builder: condition (no ack in X min / no resource) → fallback hospital list
7. **Ambulance Status Widget** (embedded, links to module 09)
   - Available / busy / offline counts + active dispatches
8. **Family Alert Panel**
   - Trigger button + delivery/status log per case
9. **Closure Form**
   - Requires reason + confirmation that responsible workflow is complete/handed off
   - Blocks closure if handoff incomplete
10. **Emergency Audit Trail Viewer**
    - Full event log per case: actor, action, timestamp

## Core Admin Actions Checklist
- [ ] View live board of all active SOS cases
- [ ] Acknowledge an incoming alert
- [ ] Configure emergency capacity/resources
- [ ] View ambulance availability & active dispatches
- [ ] Escalate an unanswered alert per configured ladder
- [ ] Manage hospital fallback/transfer routing rules
- [ ] Trigger and monitor approved family alerts
- [ ] Close an emergency event (only when workflow is complete)
- [ ] Review full audit trail + response-time metrics per case

## States / Statuses to Handle in UI
`SOS Created` → `Hospital Notified` → `Acknowledged` → `Ambulance Dispatched`
(optional) → `Pre-Arrival` → `Arrived` → `Fallback Triggered` (branch, optional) →
`Closed`

## Notifications Relevant to This Module
- Emergency SOS → Emergency team + configured admin/coordination roles
- Ambulance dispatch → Emergency team + dispatch/driver + patient/family (if configured)

## Edge Cases to Design For
- Case unacknowledged past SLA → auto-trigger next escalation step, visibly flag on board
- Fallback triggered mid-flow → UI must show *both* the original and fallback hospital in the timeline, not overwrite it
- Closing a case with an unresolved ambulance dispatch → block with warning
- This screen realistically needs live/real-time updates (polling or WebSocket) —
  plan your state management (e.g., React Query with short poll interval, or a
  socket connection) up front since it's the backbone of this module
- Never let this board double as a clinical triage tool — actions here are
  routing/coordination only
