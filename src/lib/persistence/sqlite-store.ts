import { copyFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

import {
  isVercelBlobPersistencePath,
  withTemporarySqliteFile,
  writeVercelBlobBytes,
} from "./vercel-blob.ts";

const writeChains = new Map<string, Promise<void>>();

export interface SqliteCollectionStore<TRecord> {
  read(): Promise<TRecord[]>;
  write(records: TRecord[]): Promise<void>;
}

export function createSqliteCollectionStore<TRecord>(options: {
  collectionKey: string;
  databasePath: string;
  backupDatabasePath?: string | null;
}): SqliteCollectionStore<TRecord> {
  const databasePath = options.databasePath;
  const backupDatabasePath = options.backupDatabasePath ?? null;

  return {
    async read() {
      if (isVercelBlobPersistencePath(databasePath)) {
        return withTemporarySqliteFile(databasePath, backupDatabasePath, async ({ localDatabasePath }) => {
          const database = openCollectionDatabase(localDatabasePath);

          try {
            const row = database
              .prepare("SELECT payload FROM collection_store WHERE collection_key = ?")
              .get(options.collectionKey) as { payload?: string } | undefined;

            if (!row?.payload) {
              return [];
            }

            const records = JSON.parse(row.payload) as unknown;
            return Array.isArray(records) ? (records as TRecord[]) : [];
          } finally {
            database.close();
          }
        });
      }

      const database = openCollectionDatabase(databasePath);

      try {
        const row = database
          .prepare("SELECT payload FROM collection_store WHERE collection_key = ?")
          .get(options.collectionKey) as { payload?: string } | undefined;

        if (!row?.payload) {
          return [];
        }

        const records = JSON.parse(row.payload) as unknown;
        return Array.isArray(records) ? (records as TRecord[]) : [];
      } finally {
        database.close();
      }
    },
    async write(records) {
      const existingWrite = writeChains.get(databasePath) ?? Promise.resolve();
      const nextWrite = existingWrite.then(async () => {
        if (isVercelBlobPersistencePath(databasePath)) {
          await withTemporarySqliteFile(
            databasePath,
            backupDatabasePath,
            async ({ localDatabasePath }) => {
              const database = openCollectionDatabase(localDatabasePath);

              try {
                database.exec("BEGIN IMMEDIATE");
                database
                  .prepare(
                    `
                      INSERT INTO collection_store (collection_key, payload, updated_at)
                      VALUES (?, ?, ?)
                      ON CONFLICT(collection_key)
                      DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at
                    `,
                  )
                  .run(
                    options.collectionKey,
                    JSON.stringify(records),
                    new Date().toISOString(),
                  );
                database.exec("COMMIT");
              } catch (error) {
                try {
                  database.exec("ROLLBACK");
                } catch {
                  // Ignore rollback failures after a failed write attempt.
                }
                throw error;
              } finally {
                database.close();
              }

              const bytes = await readFile(localDatabasePath);
              await writeVercelBlobBytes(databasePath, bytes);

              if (backupDatabasePath) {
                await writeVercelBlobBytes(backupDatabasePath, bytes);
              }
            },
          );

          return;
        }

        await mkdir(path.dirname(databasePath), { recursive: true });
        const database = openCollectionDatabase(databasePath);

        try {
          database.exec("BEGIN IMMEDIATE");
          database
            .prepare(
              `
                INSERT INTO collection_store (collection_key, payload, updated_at)
                VALUES (?, ?, ?)
                ON CONFLICT(collection_key)
                DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at
              `,
            )
            .run(
              options.collectionKey,
              JSON.stringify(records),
              new Date().toISOString(),
            );
          database.exec("COMMIT");
        } catch (error) {
          try {
            database.exec("ROLLBACK");
          } catch {
            // Ignore rollback failures after a failed write attempt.
          }
          throw error;
        } finally {
          database.close();
        }

        if (backupDatabasePath) {
          await mkdir(path.dirname(backupDatabasePath), { recursive: true });
          await copyFile(databasePath, backupDatabasePath);
        }
      });

      writeChains.set(databasePath, nextWrite);
      return nextWrite;
    },
  };
}

function openCollectionDatabase(databasePath: string): DatabaseSync {
  const database = new DatabaseSync(databasePath);

  database.exec(`
    PRAGMA journal_mode = DELETE;
    CREATE TABLE IF NOT EXISTS collection_store (
      collection_key TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  return database;
}
