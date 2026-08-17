import { Router } from "express";
import { getPrisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (_request, response) => {
  let database: "not_configured" | "ok" | "error" = "not_configured";

  const prisma = getPrisma();

  if (prisma) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      database = "ok";
    } catch {
      database = "error";
    }
  }

  response.json({
    ok: true,
    service: "qlyno-backend",
    database,
    timestamp: new Date().toISOString(),
  });
});

export default router;
