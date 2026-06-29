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
  backupDirectory?: string | null;
}): JsonFileCollectionStore<TRecord> {
  const storeDirectory = options.directory ?? path.join(process.cwd(), ".codex-data");
  const storePath = path.join(storeDirectory, options.filename);
  const backupStorePath = options.backupDirectory
    ? path.join(options.backupDirectory, options.filename)
    : null;

  return {
    async read() {
      const primaryResult = await readCollectionFile<TRecord>(storePath, options.collectionKey);

      if (primaryResult.ok) {
        return primaryResult.records;
      }

      if (primaryResult.notFound && !backupStorePath) {
        return [];
      }

      if (backupStorePath) {
        const backupResult = await readCollectionFile<TRecord>(backupStorePath, options.collectionKey);

        if (backupResult.ok) {
          return backupResult.records;
        }

        if (primaryResult.notFound && backupResult.notFound) {
          return [];
        }
      }

      if (primaryResult.notFound) {
        return [];
      }

      throw primaryResult.error;
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
        const payload = JSON.stringify({ [options.collectionKey]: records }, null, 2);

        await mkdir(storePathDirectory, { recursive: true });
        await writeFile(tempStorePath, payload, "utf8");
        await rename(tempStorePath, storePath);

        if (backupStorePath) {
          const backupDirectory = path.dirname(backupStorePath);
          const tempBackupPath = path.join(
            backupDirectory,
            options.filename.replace(
              /.json$/,
              `.${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp.json`,
            ),
          );

          await mkdir(backupDirectory, { recursive: true });
          await writeFile(tempBackupPath, payload, "utf8");
          await rename(tempBackupPath, backupStorePath);
        }
      });

      writeChains.set(storePath, nextWrite);
      return nextWrite;
    },
  };
}

async function readCollectionFile<TRecord>(
  filePath: string,
  collectionKey: string,
): Promise<
  | { ok: true; records: TRecord[] }
  | { ok: false; notFound: true; error: NodeJS.ErrnoException }
  | { ok: false; notFound: false; error: unknown }
> {
  try {
    const raw = await readFile(filePath, "utf8");
    const payload = JSON.parse(raw) as Record<string, unknown>;
    const records = payload[collectionKey];

    return {
      ok: true,
      records: Array.isArray(records) ? (records as TRecord[]) : [],
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return {
        ok: false,
        notFound: true,
        error: error as NodeJS.ErrnoException,
      };
    }

    return {
      ok: false,
      notFound: false,
      error,
    };
  }
}
