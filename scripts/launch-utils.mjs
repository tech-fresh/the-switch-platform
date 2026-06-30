import { spawn } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

import { LOCAL_READINESS_PROBE_ROUTES } from "./local-launch-rehearsal-order.mjs";

const repoRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const DEFAULT_REHEARSAL_DIST_DIR = ".next-rehearsal";

export function getRepoRoot() {
  return repoRoot;
}

export { LOCAL_READINESS_PROBE_ROUTES };

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
  const nextDistDir = getNextDistDirName();
  const buildIdPath = path.join(repoRoot, nextDistDir, "BUILD_ID");
  const nextTypesPagePath = path.join(repoRoot, nextDistDir, "types", "app", "page.ts");
  const npmExecPath = process.env.npm_execpath?.trim() ?? "";
  const useNodeNpmExec = npmExecPath ? await fileExists(npmExecPath) : false;
  const npmCommand = useNodeNpmExec ? process.execPath : "npm";
  const npmArgsPrefix = useNodeNpmExec ? [npmExecPath] : [];

  if (
    process.env.SWITCH_SKIP_BUILD === "1" &&
    (await fileExists(buildIdPath)) &&
    (await fileExists(nextTypesPagePath))
  ) {
    return;
  }

  await runCommand(npmCommand, [...npmArgsPrefix, "run", "build"], {
    label: "npm run build",
    env: {
      ...process.env,
      NODE_ENV: "production",
      SWITCH_NEXT_DIST_DIR: nextDistDir,
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
  return new Promise((resolve, reject) => {
    const netServer = createServer();
    netServer.once("error", (error) => {
      reject(error);
    });
    netServer.once("listening", () => {
      const address = netServer.address();
      const port =
        typeof address === "object" && address !== null ? address.port : null;
      netServer.close(() => {
        if (!port) {
          reject(new Error("Unable to resolve a local port for launch automation."));
          return;
        }

        resolve(port);
      });
    });
    netServer.listen(0, "127.0.0.1");
  });
}

export async function startNextServer(env = {}) {
  const nextDistDir = getNextDistDirName();
  const port = await getAvailablePort();
  const child = spawn(
    process.execPath,
    [path.join(repoRoot, "node_modules", "next", "dist", "bin", "next"), "start", "-H", "127.0.0.1", "-p", String(port)],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
        NODE_ENV: "production",
        SWITCH_NEXT_DIST_DIR: nextDistDir,
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
      const responses = await Promise.all(
        LOCAL_READINESS_PROBE_ROUTES.map((route) =>
          fetch(`${baseUrl}${route}`, {
            redirect: "manual",
          }),
        ),
      );

      if (responses.every((response) => response.status < 500)) {
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

function getNextDistDirName() {
  return process.env.SWITCH_NEXT_DIST_DIR?.trim() || DEFAULT_REHEARSAL_DIST_DIR;
}

const DEFAULT_FETCH_TIMEOUT_MS = Number(process.env.SWITCH_LIVE_FETCH_TIMEOUT_MS ?? 45000);
const DEFAULT_FETCH_ATTEMPTS = Number(process.env.SWITCH_LIVE_FETCH_ATTEMPTS ?? 3);

export async function fetchResponse(url, options) {
  return fetchWithRetry(url, options);
}

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
  let lastResponse = null;

  for (let attempt = 1; attempt <= DEFAULT_FETCH_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      if (response.status >= 500 && attempt < DEFAULT_FETCH_ATTEMPTS) {
        lastResponse = response;
        await delay(750 * attempt);
        continue;
      }

      return response;
    } catch (error) {
      lastError = error;

      if (!isRetryableFetchError(error) || attempt === DEFAULT_FETCH_ATTEMPTS) {
        if (error?.name === "AbortError") {
          throw new Error(
            `Timed out after ${DEFAULT_FETCH_TIMEOUT_MS}ms waiting for ${url}. If Fly auto-stopped the machine, open ${url} in a browser first or run: fly machines start -a the-switch-platform`,
          );
        }

        throw error;
      }

      await delay(750 * attempt);
    } finally {
      clearTimeout(timeout);
    }
  }

  if (lastResponse) {
    return lastResponse;
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
