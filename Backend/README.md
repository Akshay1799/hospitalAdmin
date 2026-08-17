# Qlyno Backend

Standalone Node.js backend for the Qlyno Doctor / Provider module.

This backend is not wired to the frontend yet. It sets up:

- Express + TypeScript server
- Prisma ORM
- PostgreSQL schema for Supabase
- Health check route
- Database models for the doctor/provider workflow

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
