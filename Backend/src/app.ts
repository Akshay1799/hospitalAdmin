import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./env.js";
import healthRouter from "./routes/health.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
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

  return app;
}
