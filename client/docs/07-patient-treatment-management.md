# 07 — Patient & Treatment Management

## Purpose
Patients in Qlyno have **one persistent identity** (Qlyno Patient ID) across every
hospital/provider. The hospital should never create a duplicate identity — it
should search for and reuse the existing one, then attach a hospital-specific
treatment relationship on top of it.

## Key Concept: Unified Patient ID
- Always search first (by Qlyno ID, name, phone, or other permitted identifier)
  before allowing "Create New Patient."
- If a possible match is found, flag it as a **potential duplicate** and require
  explicit confirmation before creating a new record.

## Pages / Screens to Build
1. **Patient Search**
   - Search bar: Qlyno Patient ID / name / phone / other identifiers
   - Result list with quick "duplicate risk" badges
2. **Register New Patient**
   - Form: demographics, contact, identifiers
   - Duplicate-check step before final save (shows possible matches, requires confirm)
3. **Patient Detail Page** (tabs)
   - Overview: hospital relationship status, consent state
   - Timeline: operational timeline (permission-scoped — not full medical record)
   - OPD tab: registrations, appointments, queue, consultations, follow-ups
   - IPD tab: admission, room/bed assignment, transfers, treatment progress, discharge
   - Documents tab: hospital-generated docs, consent forms, discharge summaries
   - Billing tab: billing status (view/coordinate only — not full billing engine here)
4. **OPD Queue / Registration Board**
   - Live queue list: token, patient, doctor, status, wait time
5. **IPD Admission Workflow**
   - Admit form → Bed/room assignment → Transfer request → Discharge readiness checklist
6. **Discharge Workflow Screen**
   - Checklist: settlement status, documents complete, follow-up scheduled
   - "Ready to discharge" gate — disabled until checklist is complete
7. **Consent Indicator Component**
   - Small reusable badge/tooltip shown wherever patient data is displayed, reflecting
     what's shared/consented so Admin doesn't over-expose data

## Core Admin Actions Checklist
- [ ] Search for existing Qlyno Patient ID before creating new
- [ ] Register a new patient and flag potential duplicates
- [ ] Establish/view hospital ↔ patient relationship
- [ ] View patient's permitted operational timeline
- [ ] Manage OPD registration/appointment/queue/follow-up
- [ ] Manage IPD admission, bed/room assignment, transfer, discharge
- [ ] Manage hospital-generated documents & consent records
- [ ] View billing status and coordinate financial workflow (not full billing UI)
- [ ] Run discharge readiness checklist and complete discharge

## States / Statuses to Handle in UI
- Patient relationship: `New`, `Active`, `Inactive`, `Duplicate-flagged`
- OPD: `Registered`, `Waiting`, `In Consultation`, `Follow-up Scheduled`, `Completed`
- IPD: `Admitted`, `Under Treatment`, `Transfer Requested`, `Discharge Pending`, `Discharged`
- Consent: `Granted`, `Restricted`, `Revoked`

## Notifications Relevant to This Module
- Bed shortage → Admin + admissions/emergency team
- Discharge blockers surfaced on the Patient Flow dashboard widget

## Edge Cases to Design For
- Patient found in search but hospital has **no** active relationship yet → show
  "Connect Patient" action instead of edit/view full history
- Duplicate patient merge — needs an explicit, audited merge flow (don't silently merge)
- Discharge attempted while billing is unsettled → block with clear reason
- Only show data the current role is permitted to see (data minimization) — build
  this as a permission-driven field visibility layer, not just UI hiding
