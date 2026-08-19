import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./env.js";
import apiRouter from "./routes/api.js";
import healthRouter from "./routes/health.js";

export function createApp() {
  const app = express();
  const corsOrigins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean);

  app.use(helmet());
  app.use(cors({ origin: corsOrigins, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  app.get("/", (_request, response) => {
    response.json({
      ok: true,
      service: "Qlyno Backend",
      docs: "/health",
    });
  });

  app.use("/health", healthRouter);
  app.use("/api", apiRouter);

  return app;
}
