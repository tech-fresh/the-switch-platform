import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const nextDistDir = process.env.SWITCH_NEXT_DIST_DIR?.trim() || ".next-rehearsal";

await rm(path.join(repoRoot, nextDistDir), { recursive: true, force: true });
await rm(path.join(repoRoot, "tsconfig.tsbuildinfo"), { force: true });
