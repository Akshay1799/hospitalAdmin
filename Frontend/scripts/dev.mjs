import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { createServer } from "node:net";

const projectRoot = process.cwd();
const nextDir = join(projectRoot, ".next");
const lockFile = join(projectRoot, ".next-dev.lock");
const port = Number(process.env.PORT ?? 3000);
const reuseBuildArtifacts = process.argv.includes("--reuse");

function isProcessRunning(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function readLockPid() {
  if (!existsSync(lockFile)) return null;
  const raw = readFileSync(lockFile, "utf8").trim();
  const pid = Number(raw);
  return Number.isInteger(pid) ? pid : null;
}

const existingPid = readLockPid();
if (existingPid && isProcessRunning(existingPid)) {
  console.error(`Another Next dev server is already running for this project (PID ${existingPid}).`);
  console.error("Stop that terminal first, then run npm run dev again.");
  process.exit(1);
}

async function ensurePortAvailable() {
  await new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.once("listening", () => {
      server.close(resolve);
    });
    server.listen(port, "127.0.0.1");
  }).catch(() => {
    console.error(`Port ${port} is already in use.`);
    console.error("Stop the existing frontend dev server first, then run npm run dev again.");
    process.exit(1);
  });
}

await ensurePortAvailable();

rmSync(lockFile, { force: true });
if (!reuseBuildArtifacts) {
  console.log("Clearing .next before dev start to prevent stale chunk 404s...");
  rmSync(nextDir, { recursive: true, force: true });
}
writeFileSync(lockFile, String(process.pid));

const nextCli = join(projectRoot, "node_modules", "next", "dist", "bin", "next");
const child = spawn(process.execPath, [nextCli, "dev", "--port", String(port)], {
  cwd: projectRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_PRIVATE_SKIP_WEBPACK_CACHE: process.env.NEXT_PRIVATE_SKIP_WEBPACK_CACHE ?? "1",
  },
});

process.on("exit", () => {
  rmSync(lockFile, { force: true });
});

function cleanupAndExit(code = 0) {
  rmSync(lockFile, { force: true });
  process.exit(code);
}

process.on("SIGINT", () => {
  child.kill("SIGINT");
});

process.on("SIGTERM", () => {
  child.kill("SIGTERM");
});

child.on("exit", (code) => {
  cleanupAndExit(code ?? 0);
});

child.on("error", (error) => {
  rmSync(lockFile, { force: true });
  console.error(error);
  process.exit(1);
});
