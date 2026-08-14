# Qlyno — Doctor Portal (Frontend)

A Next.js 14 (App Router + TypeScript + Tailwind CSS) frontend for the Qlyno
Hospital Management System, built from:

- `PDF 3 — Doctor Portal Module Documentation` (the 17-section HMS Doctor Portal spec)
- `Solo Doctor / Multi-Doctor Clinic / Qlyno Provider Layer` (combined PRD v4.0)

This is **frontend only** — there is no backend, database, or API. All data
lives in `lib/mock-data.ts` and is held in React state, so edits made while
using the app (issuing a prescription, logging vitals, moving a lab order
through its pipeline, etc.) reset on page reload.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000 — it redirects to `/doctor/dashboard`.

To build for production:

```bash
npm run build
npm run start
```

## Project structure

```
app/
  doctor/                  Doctor Workspace — the 17 modules from the HMS PDF
    dashboard/              01 Dashboard
    patients/               02 My Patients (list + patient chart at /patients/[id])
    appointments/           03 Appointment Management
    emr/                    04 Medical Records (EMR)
    consultation/           05 Consultation
    vitals/                 06 Vitals Management
    prescriptions/          07 E-Prescription
    diagnosis/              08 Diagnosis & ICD Management
    lab-orders/             09 Laboratory Orders (kanban)
    radiology-orders/       10 Radiology Orders
    follow-up/              11 Follow-up Management
    alerts/                 12 Clinical Alerts
    reports/                13 Reports
    communication/          14 Communication (chat)
    settings/               15 Settings
    (16 Global Search lives in the topbar, 17 Quick Actions is the topbar button)
  clinic/                   Clinic Operations layer (from the Solo/Multi-Doctor PRD)
    dashboard/               Clinic-wide dashboard across all doctors
    doctors/                 Doctor management
    staff/                   Staff management (receptionist, nurse, assistant…)
    schedules/               Clinic hours + per-doctor weekly availability
    services/                Clinic services and eligible doctors
    locations/                Clinic locations

components/
  ui.tsx                    Shared primitives (Card, Badge, Avatar, StatusBadge…)
  layout/                   Sidebar, Topbar, AppShell, GlobalSearch, QuickActions, nav-config

lib/
  types.ts                  Domain types (Patient, Appointment, Prescription, …)
  mock-data.ts               In-memory seed data
  mode-context.tsx          Solo Doctor ⇄ Clinic mode switch (top of sidebar)
```

## Design system

- **Type:** Fraunces (display/headings) + IBM Plex Sans (UI/body) + IBM Plex Mono
  (data/vitals/codes), self-hosted via `@fontsource` (no external font requests).
- **Color:** a deep teal-forest brand color, warm clay secondary accent, and a
  controlled alert red — set as CSS/Tailwind tokens in `tailwind.config.ts`.
- **Signature element:** the "instrument strip" (`.vitals-strip` in
  `app/globals.css`) — a dark, mono-numeral readout styled after a bedside
  monitor, reused for daily summary stats and literal patient vitals.

## Solo Doctor vs. Clinic mode

The sidebar has a Solo Doctor / Clinic switch. In Clinic mode, the "Clinic
Operations" section of the sidebar appears (doctor management, staff, schedules,
services, locations) reflecting the clinic → doctors → staff hierarchy from the
combined PRD. In Solo Doctor mode, only the Doctor Workspace is shown.

## Notes

- No backend/API calls are made anywhere in this project — every "save",
  "issue", "advance", or "acknowledge" action mutates local React state only.
- Google Fonts network calls were intentionally avoided (fonts are bundled via
  npm) so the project builds in network-restricted environments.
