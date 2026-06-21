import { spawn } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));

export function getRepoRoot() {
  return repoRoot;
}

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export async function fileExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function readJson(targetPath) {
  const content = await readFile(targetPath, "utf8");
  return JSON.parse(content);
}

export async function ensureBuild() {
  const buildIdPath = path.join(repoRoot, ".next", "BUILD_ID");

  if (process.env.SWITCH_SKIP_BUILD === "1" && (await fileExists(buildIdPath))) {
    return;
  }

  await runCommand(process.execPath, [path.join(repoRoot, "node_modules", "next", "dist", "bin", "next"), "build"], {
    label: "next build",
    env: {
      ...process.env,
      NODE_ENV: "production",
      SWITCH_AUTH_SECRET: process.env.SWITCH_AUTH_SECRET ?? "launch-build-secret",
    },
  });
}

export async function runCommand(command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: repoRoot,
    env: options.env ?? process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";

  child.stdout.on("data", (chunk) => {
    stdout += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  const exitCode = await new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("close", resolve);
  });

  if (exitCode !== 0) {
    const label = options.label ?? `${command} ${args.join(" ")}`;
    throw new Error(`${label} failed with exit code ${exitCode}\n${stdout}${stderr}`.trim());
  }

  return {
    stdout,
    stderr,
  };
}

export async function getAvailablePort() {
  const basePort = 3300 + Math.floor(Math.random() * 400);

  for (let offset = 0; offset < 50; offset += 1) {
    const port = basePort + offset;
    const available = await canBindPort(port);

    if (available) {
      return port;
    }
  }

  throw new Error("Unable to find an available local port for launch automation.");
}

function canBindPort(port) {
  return new Promise((resolve) => {
    const netServer = createServer();
    netServer.once("error", () => resolve(false));
    netServer.once("listening", () => {
      netServer.close(() => resolve(true));
    });
    netServer.listen(port, "127.0.0.1");
  });
}

export async function startNextServer(env = {}) {
  const port = await getAvailablePort();
  const child = spawn(
    process.execPath,
    [path.join(repoRoot, "node_modules", "next", "dist", "bin", "next"), "start", "-p", String(port)],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
        NODE_ENV: "production",
        ...env,
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  let logs = "";
  const appendLogs = (chunk) => {
    logs += chunk.toString();
  };

  child.stdout.on("data", appendLogs);
  child.stderr.on("data", appendLogs);

  const baseUrl = `http://127.0.0.1:${port}`;
  await waitForServer(baseUrl, child, () => logs);

  return {
    child,
    baseUrl,
    logs: () => logs,
  };
}

async function waitForServer(baseUrl, child, getLogs) {
  const deadline = Date.now() + 30000;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Local Next server exited before becoming ready.\n${getLogs()}`.trim());
    }

    try {
      const response = await fetch(`${baseUrl}/api/auth/providers`, {
        redirect: "manual",
      });

      if (response.status < 500) {
        return;
      }
    } catch {
      await delay(500);
      continue;
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for local Next server readiness.\n${getLogs()}`.trim());
}

export async function stopServer(child) {
  if (child.exitCode !== null) {
    return;
  }

  child.kill("SIGTERM");

  await Promise.race([
    new Promise((resolve) => child.once("close", resolve)),
    delay(5000).then(() => {
      if (child.exitCode === null) {
        child.kill("SIGKILL");
      }
    }),
  ]);
}

export function getSessionCookie(setCookieHeaders) {
  const cookie = setCookieHeaders.find((value) => value.startsWith("switch_auth_session="));

  assert(cookie, "Expected auth session cookie to be set.");

  return cookie.split(";", 1)[0];
}

const DEFAULT_FETCH_TIMEOUT_MS = 45000;
const DEFAULT_FETCH_ATTEMPTS = 3;

export async function fetchText(url, options) {
  const response = await fetchWithRetry(url, options);
  const body = await response.text();

  return {
    response,
    body,
  };
}

export async function fetchJson(url, options) {
  const response = await fetchWithRetry(url, options);
  const body = await response.text();
  const json = body ? JSON.parse(body) : null;

  return {
    response,
    json,
    body,
  };
}

async function fetchWithRetry(url, options = {}) {
  let lastError = null;

  for (let attempt = 1; attempt <= DEFAULT_FETCH_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_FETCH_TIMEOUT_MS);

    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal,
      });
    } catch (error) {
      lastError = error;

      if (!isRetryableFetchError(error) || attempt === DEFAULT_FETCH_ATTEMPTS) {
        throw error;
      }

      await delay(750 * attempt);
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError ?? new Error(`Fetch failed for ${url}.`);
}

function isRetryableFetchError(error) {
  return (
    error?.name === "AbortError" ||
    error?.cause?.code === "ECONNRESET" ||
    error?.cause?.code === "ETIMEDOUT"
  );
}
