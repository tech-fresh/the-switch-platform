import { readFile } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

import { fileExists, getRepoRoot, runCommand } from "./launch-utils.mjs";

const repoRoot = getRepoRoot();
const FLY_MACHINE_READY_STATES = new Set(["started"]);
const FLY_MACHINE_PENDING_STATES = new Set(["starting", "stopped", "suspended"]);
const FLY_MACHINE_WARMUP_TIMEOUT_MS = Number(
  process.env.SWITCH_FLY_MACHINE_WARMUP_TIMEOUT_MS ?? 120000,
);
const FLY_MACHINE_WARMUP_POLL_MS = Number(
  process.env.SWITCH_FLY_MACHINE_WARMUP_POLL_MS ?? 5000,
);

export async function ensureFlyMachineWarmup() {
  if (process.env.SWITCH_FLY_MACHINE_WARMUP === "0") {
    return;
  }

  const flyctlPath = await resolveFlyctlPath();
  const flyAppName = process.env.SWITCH_FLY_APP_NAME?.trim() || (await readFlyAppName());

  if (!flyctlPath || !flyAppName) {
    return;
  }

  try {
    let machine = await getPrimaryFlyMachine(flyctlPath, flyAppName);

    if (!machine) {
      console.log(`No Fly machine found for ${flyAppName}. Continuing without Fly warm-up.`);
      return;
    }

    if (FLY_MACHINE_READY_STATES.has(machine.state)) {
      console.log(`Fly machine ${machine.id} is already started.`);
      return;
    }

    if (machine.state === "stopped" || machine.state === "suspended") {
      console.log(`Starting Fly machine ${machine.id} for ${flyAppName}...`);
      await runCommand(flyctlPath, ["machine", "start", machine.id, "-a", flyAppName], {
        label: `fly machine start ${machine.id}`,
      });
    } else {
      console.log(`Fly machine ${machine.id} is ${machine.state}. Waiting for readiness...`);
    }

    const deadline = Date.now() + FLY_MACHINE_WARMUP_TIMEOUT_MS;

    while (Date.now() < deadline) {
      await delay(FLY_MACHINE_WARMUP_POLL_MS);
      machine = await getPrimaryFlyMachine(flyctlPath, flyAppName);

      if (!machine) {
        break;
      }

      if (FLY_MACHINE_READY_STATES.has(machine.state)) {
        console.log(`Fly machine ${machine.id} is ready.`);
        return;
      }

      if (!FLY_MACHINE_PENDING_STATES.has(machine.state)) {
        console.log(
          `Fly machine ${machine.id} is ${machine.state}. Continuing; the live check will verify route access directly.`,
        );
        return;
      }
    }

    console.log(
      `Fly machine warm-up timed out after ${FLY_MACHINE_WARMUP_TIMEOUT_MS}ms. Continuing; the live check will report any remaining failure directly.`,
    );
  } catch (error) {
    console.log(
      `Fly machine warm-up helper could not complete: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function resolveFlyctlPath() {
  const explicitPath =
    process.env.SWITCH_FLYCTL_PATH?.trim() || process.env.FLYCTL_PATH?.trim();

  if (explicitPath) {
    return explicitPath;
  }

  const homeDir = process.env.HOME?.trim() ?? "";
  const bundledPath = homeDir ? path.join(homeDir, ".fly", "bin", "fly") : "";

  if (bundledPath && (await fileExists(bundledPath))) {
    return bundledPath;
  }

  return "fly";
}

async function readFlyAppName() {
  const flyTomlPath = path.join(repoRoot, "fly.toml");

  if (!(await fileExists(flyTomlPath))) {
    return "";
  }

  const content = await readFile(flyTomlPath, "utf8");
  const match = content.match(/^app\s*=\s*['"]([^'"]+)['"]/m);

  return match?.[1]?.trim() ?? "";
}

async function getPrimaryFlyMachine(flyctlPath, flyAppName) {
  const { stdout } = await runCommand(
    flyctlPath,
    ["machines", "list", "-a", flyAppName, "--json"],
    { label: `fly machines list ${flyAppName}` },
  );

  const machines = JSON.parse(stdout);
  return machines.find((machine) => machine.host_status === "ok") ?? machines[0] ?? null;
}

const LIVE_HTTP_READY_STATUSES = new Set([200, 301, 302, 307, 308, 401, 403]);
const LIVE_HTTP_WARMUP_GATEWAY_STATUSES = new Set([502, 503, 504]);

export async function ensureLiveHttpWarmup(baseUrl) {
  if (process.env.SWITCH_LIVE_HTTP_WARMUP === "0") {
    return;
  }

  const probeUrls = [
    `${baseUrl}/api/auth/providers`,
    `${baseUrl}/`,
    `${baseUrl}/login`,
  ];
  const attempts = Number(process.env.SWITCH_LIVE_HTTP_WARMUP_ATTEMPTS ?? 12);
  const delayMs = Number(process.env.SWITCH_LIVE_HTTP_WARMUP_DELAY_MS ?? 5000);
  const timeoutMs = Number(process.env.SWITCH_LIVE_HTTP_WARMUP_TIMEOUT_MS ?? 20000);

  console.log(
    `Probing live HTTP routes until the app responds (up to ${attempts} attempts)...`,
  );

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    for (const url of probeUrls) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(url, {
          redirect: "manual",
          signal: controller.signal,
        });
        clearTimeout(timer);

        if (LIVE_HTTP_READY_STATUSES.has(response.status)) {
          console.log(`Live HTTP warm-up succeeded via ${url} (${response.status}).`);
          return;
        }

        if (LIVE_HTTP_WARMUP_GATEWAY_STATUSES.has(response.status)) {
          console.log(
            `Live HTTP warm-up probe ${url} returned ${response.status} (attempt ${attempt}/${attempts}).`,
          );
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(
          `Live HTTP warm-up probe ${url} failed on attempt ${attempt}/${attempts}: ${message}`,
        );
      }
    }

    if (attempt < attempts) {
      await delay(delayMs);
    }
  }

  console.log(
    "Live HTTP warm-up did not confirm a ready response. Continuing; route checks will retry directly.",
  );
}
