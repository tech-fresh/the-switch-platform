import { spawn } from "node:child_process";
import process from "node:process";

const APP_NAME = "the-switch-platform";
const extraArgs = process.argv.slice(2);

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      ...options,
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} exited with code ${code}.`));
    });
  });
}

async function assertFlyAccess() {
  try {
    await run("fly", ["status", "-a", APP_NAME], { stdio: "pipe" });
  } catch {
    console.error(
      [
        "Fly deploy preflight failed: this CLI session cannot access the-switch-platform.",
        "",
        "1. Re-authenticate: fly auth login",
        "2. Confirm access: fly status -a the-switch-platform",
        "3. Deploy again: npm run deploy:fly",
        "",
        "Depot builder outages are common. This script always uses Fly's remote builder (--depot=false),",
        "so local Docker is not required.",
      ].join("\n"),
    );
    process.exit(1);
  }
}

await assertFlyAccess();

const deployArgs = [
  "deploy",
  "-a",
  APP_NAME,
  "--depot=false",
  ...extraArgs,
];

console.log(`Running: fly ${deployArgs.join(" ")}`);
await run("fly", deployArgs);
