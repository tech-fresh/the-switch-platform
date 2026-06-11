import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const storeDirectory = path.join(process.cwd(), ".codex-data");
const writeChains = new Map<string, Promise<void>>();

export interface JsonFileCollectionStore<TRecord> {
  read(): Promise<TRecord[]>;
  write(records: TRecord[]): Promise<void>;
}

export function createJsonFileCollectionStore<TRecord>(options: {
  filename: string;
  collectionKey: string;
}): JsonFileCollectionStore<TRecord> {
  const storePath = path.join(storeDirectory, options.filename);
  const tempStorePath = path.join(storeDirectory, options.filename.replace(/.json$/, ".tmp.json"));

  return {
    async read() {
      try {
        const raw = await readFile(storePath, "utf8");
        const payload = JSON.parse(raw) as Record<string, unknown>;
        const records = payload[options.collectionKey];

        return Array.isArray(records) ? (records as TRecord[]) : [];
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
          return [];
        }

        throw error;
      }
    },
    async write(records) {
      const existingWrite = writeChains.get(storePath) ?? Promise.resolve();
      const nextWrite = existingWrite.then(async () => {
        await mkdir(storeDirectory, { recursive: true });
        await writeFile(
          tempStorePath,
          JSON.stringify({ [options.collectionKey]: records }, null, 2),
          "utf8",
        );
        await rename(tempStorePath, storePath);
      });

      writeChains.set(storePath, nextWrite);
      return nextWrite;
    },
  };
}
