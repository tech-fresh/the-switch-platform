import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const writeChains = new Map<string, Promise<void>>();

export interface JsonFileCollectionStore<TRecord> {
  read(): Promise<TRecord[]>;
  write(records: TRecord[]): Promise<void>;
}

export function createJsonFileCollectionStore<TRecord>(options: {
  filename: string;
  collectionKey: string;
  directory?: string;
}): JsonFileCollectionStore<TRecord> {
  const storeDirectory = options.directory ?? path.join(process.cwd(), ".codex-data");
  const storePath = path.join(storeDirectory, options.filename);

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
        const storePathDirectory = path.dirname(storePath);
        const tempStorePath = path.join(
          storePathDirectory,
          options.filename.replace(
            /.json$/,
            `.${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp.json`,
          ),
        );

        await mkdir(storePathDirectory, { recursive: true });
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
