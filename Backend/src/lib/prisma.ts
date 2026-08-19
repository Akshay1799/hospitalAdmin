import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export function getPrisma() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("[YOUR-PASSWORD]")) return null;

  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === "true",
    },
  });
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}
