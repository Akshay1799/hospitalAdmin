# Qlyno Hospital Admin Panel — Frontend

Frontend-only build of the **Hospital Admin Panel** for the Qlyno healthcare platform, built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. This panel is the operational control center for a hospital/clinic administrator — managing doctors, clinic staff (receptionists, nurses, billing staff, lab staff), patients, appointments, the vendor procurement network, billing, reports and system administration.

This build ships with realistic **mock data** everywhere (no backend yet) so every screen looks and behaves like a working product. All data lives in `src/lib/mock-data/` and is typed via `src/lib/types/`, ready to be swapped for real API calls.

---

## 1. Getting started

This project's dependencies were **not installed automatically** — install them yourself before running:

```bash
cd hospital-admin-panel
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) — it redirects to `/dashboard`. A standalone `/login` screen is also included (not wired to real auth yet).

Other scripts:

```bash
npm run build        # production build
npm run start         # run the production build
npm run lint          # ESLint
npm run type-check    # TypeScript check with no emit
```

**Requirements:** Node.js 18.18+ (Node 20 LTS recommended).

---

## 2. Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 14 (App Router, Server + Client Components) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + CSS variables for theming (light/dark tokens ready) |
| Components | Hand-built shadcn/ui-style components on top of Radix UI primitives |
| Icons | lucide-react |
| Charts | Recharts |
| Fonts | Inter (body/UI), Lexend (display/headings), JetBrains Mono (IDs, codes) — self-hosted via `next/font/google`, no external font requests |

No UI kit CLI was run — every component in `src/components/ui` is written by hand so you have full control and no hidden "black box" generated code.

---

## 3. Project structure

```
src/
  app/
    layout.tsx              Root layout (fonts, metadata, toaster)
    page.tsx                 Redirects "/" -> "/dashboard"
    login/page.tsx            Standalone login screen (no sidebar shell)
    not-found.tsx / error.tsx Global 404 / error boundaries
    (dashboard)/               Route group sharing the sidebar + topbar shell
      layout.tsx
      loading.tsx
      dashboard/                Overview: KPIs, charts, today's schedule, alerts
      doctors/                   Doctor directory + [id] profile
      patients/                  Unified patient records + [id] profile
      appointments/               Cross-doctor appointment engine (day-grouped)
      lab/                        Lab order lifecycle & critical result alerts
      staff/
        receptionists/            Solo/Clinic/Hospital receptionist management
        nurses/                    Nurse Station: shifts, tasks, workload
        billing-staff/             Billing staff & scopes
        lab-staff/                 Pathologists, technicians, collection agents
      vendors/                    Vendor network directory + [id] profile
      vendors/procurement/         Procurement request lifecycle
      billing/                    Invoices, payments, outstanding balances
      reports/                     Financial / operational / satisfaction analytics
      roles/                       Role-based permission matrix
      audit-logs/                  Full action audit trail
      notifications/               Notification center
      settings/                    Organization, locations, notifications, security
  components/
    ui/                       Base primitives (button, card, table, dialog, etc.)
    layout/                   Sidebar, topbar, nav config
    shared/                   PageHeader, StatCard, StatusBadge, Toolbar, EmptyState...
  hooks/                       use-toast
  lib/
    types/                     Shared TypeScript domain types
    mock-data/                  Mock datasets per module
    utils.ts                    cn(), formatters
```

---

## 4. Design system

- **Palette:** deep clinical teal primary on a light, cool-gray canvas, with a **deep navy sidebar** for wayfinding contrast — deliberately not the default white-on-white admin template. Semantic colors (success/warning/destructive/info) are used consistently.
- **Status language:** a single `StatusBadge` component (`src/components/shared/status-badge.tsx`) maps every lifecycle status across the whole app — appointments, orders, quotes, invoices, staff, vendors — to the same color vocabulary, so a user who learns "amber = needs attention" in one screen recognizes it everywhere else.
- **Typography:** Lexend for headings (friendly, highly legible — a deliberate choice for a healthcare admin tool), Inter for UI/body text, JetBrains Mono for IDs, registration numbers and timestamps.
- All interactive components are keyboard accessible (Radix primitives), have visible focus states, and respect `prefers-reduced-motion`.

---

## 5. Security & production practices already in place

- Strict security headers set in `next.config.js` (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).
- `poweredByHeader` disabled.
- Admin pages are marked `noindex, nofollow` via metadata (internal tool, shouldn't be indexed).
- TypeScript strict mode is enabled end-to-end.
- No secrets or API keys are present anywhere in this codebase — see `.env.example` for the expected environment variables once a backend is connected.
- All destructive/administrative actions in the UI (suspend doctor, remove staff, refund, etc.) are visually distinct and would need a confirmation + server-side authorization check once wired to a real API.

## 6. What's intentionally left for backend integration

This is a **frontend-only** build using mock data, by design:

- No authentication/session logic — `/login` is a visual shell only.
- No real API calls — every list/detail page reads from `src/lib/mock-data`.
- Forms (Add Doctor, Create Invoice, New Procurement Request, etc.) show a success toast but do not persist — swap the `onSubmit` handlers for real mutations.
- Role-based UI restrictions are visual/organizational only; **all real authorization must be enforced server-side**, per the product's permission model (Organization + Role + Resource Scope + Action).

---

## 7. Suggested next steps

1. Wire `/login` to real authentication and protect the `(dashboard)` route group with middleware.
2. Replace `src/lib/mock-data/*` reads with a data-fetching layer (React Query / SWR / Server Components + fetch) against your API.
3. Add optimistic mutations for the existing dialogs/forms.
4. Add pagination/virtualization to tables once real data volume is known.
5. Add dark mode toggle (CSS variables for `.dark` are already defined in `globals.css`).
