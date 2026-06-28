import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const routesShimPath = path.join(process.cwd(), ".next", "types", "routes.js");

await mkdir(path.dirname(routesShimPath), { recursive: true });
await writeFile(
  routesShimPath,
  "export {};\n",
  "utf8",
);
