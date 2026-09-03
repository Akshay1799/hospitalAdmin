# Qlyno Backend

Standalone Node.js backend for the Qlyno Doctor / Provider module.

This backend is ready to support the current frontend workflow, but the frontend
still uses mock data until its pages are migrated to these APIs. It sets up:

- Express + TypeScript server
- Prisma ORM
- PostgreSQL schema for Supabase
- Health check route
- Persistent API routes under `/api`
- Database models for the doctor/provider workflow
- Clinic operations tables for shifts, services, rooms, billing and inventory

## Setup

1. Copy `.env.example` to `.env`.
2. Add Supabase PostgreSQL values for `DATABASE_URL` and `DIRECT_URL`.
3. Run:

```bash
npm install
npm run prisma:generate
npm run prisma:validate
npm run dev
```

The API will run at `http://localhost:4000`. Check it with `GET /health`.

## Frontend compatibility

The frontend currently models doctor work across dashboard, schedule,
appointments, queue, patients, consultation, prescriptions, lab/radiology,
follow-up, alerts, reports and clinic operations. The backend now has matching
database support for those workflows:

- Patients, allergies, conditions, medications and patient workplace MRNs
- Appointments with clinic/hospital status transitions, rooms and locations
- Encounters that can create vitals, diagnoses, prescriptions, orders and follow-ups in one transaction
- Prescriptions with medicine rows
- Investigation orders, reports and report values
- Doctor shifts with slot, buffer, recurrence and conflict-ready fields
- Clinic services with prices and eligible doctors
- Clinic rooms/resources
- Staff memberships and role permissions
- Billing invoices/payments
- Inventory items
- Notifications, tasks, conversations, referrals and audit events

## API routes

All persistent routes live under `/api`.

```text
GET    /api/bootstrap
POST   /api/patients
GET    /api/patients/:id/timeline
GET    /api/shifts
POST   /api/shifts
PATCH  /api/shifts/:id/status
POST   /api/appointments
PATCH  /api/appointments/:id/status
POST   /api/encounters
POST   /api/prescriptions
POST   /api/orders
PATCH  /api/orders/:id/status
GET    /api/clinic/services
POST   /api/clinic/services
POST   /api/clinic/rooms
POST   /api/clinic/inventory
POST   /api/billing/invoices
PATCH  /api/tasks/:id/status
PATCH  /api/notifications/:id/read
```

`POST /api/encounters` is the main doctor workflow endpoint. It finalizes the
visit and synchronizes related records in one transaction: encounter,
appointment completion, vitals, diagnoses, prescription medicines, investigation
orders, follow-up and audit event.

## Prisma

Useful commands:

```bash
npm run prisma:format
npm run prisma:validate
npm run prisma:migrate
npm run prisma:studio
npm run build
npm start
```

Use `DATABASE_URL` for app connections. Prisma migrations use `DIRECT_URL` when present and fall back to `DATABASE_URL`.
