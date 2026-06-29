import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const nextDistDir = process.env.SWITCH_NEXT_DIST_DIR?.trim() || ".next";
const routesShimPath = path.join(process.cwd(), nextDistDir, "types", "routes.js");
const cacheLifeShimPath = path.join(process.cwd(), nextDistDir, "types", "cache-life.d.ts");

await mkdir(path.dirname(routesShimPath), { recursive: true });
await writeFile(
  routesShimPath,
  "export {};\n",
  "utf8",
);
await writeFile(
  cacheLifeShimPath,
  "export {};\n",
  "utf8",
);
