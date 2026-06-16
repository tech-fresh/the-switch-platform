import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const dataDirectory = path.resolve(process.env.SWITCH_DATA_DIRECTORY?.trim() || path.join(process.cwd(), ".codex-data"));
const databasePath = path.join(dataDirectory, "switch-live.sqlite");
const backupDatabasePath = path.join(dataDirectory, "backups", "switch-live.sqlite");

const collections = [
  {
    filename: "saved-progress.json",
    collectionKey: "saved-progress.records",
    payloadKey: "records",
  },
  {
    filename: "access-profiles.json",
    collectionKey: "access-profiles.profiles",
    payloadKey: "profiles",
  },
  {
    filename: "auth-sessions.json",
    collectionKey: "auth-sessions.sessions",
    payloadKey: "sessions",
  },
  {
    filename: "cms-workflow.json",
    collectionKey: "cms-workflow.records",
    payloadKey: "records",
  },
];

await mkdir(path.dirname(databasePath), { recursive: true });
await mkdir(path.dirname(backupDatabasePath), { recursive: true });

const database = new DatabaseSync(databasePath);

try {
  database.exec(`
    PRAGMA journal_mode = DELETE;
    CREATE TABLE IF NOT EXISTS collection_store (
      collection_key TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  database.exec("BEGIN IMMEDIATE");

  const summary = [];

  for (const collection of collections) {
    const filePath = path.join(dataDirectory, collection.filename);
    const records = await readJsonArray(filePath, collection.payloadKey);

    database
      .prepare(
        `
          INSERT INTO collection_store (collection_key, payload, updated_at)
          VALUES (?, ?, ?)
          ON CONFLICT(collection_key)
          DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at
        `,
      )
      .run(collection.collectionKey, JSON.stringify(records), new Date().toISOString());

    summary.push(`- ${collection.collectionKey}: ${records.length} record${records.length === 1 ? "" : "s"}`);
  }

  database.exec("COMMIT");
  database.close();

  const backupDatabase = new DatabaseSync(backupDatabasePath);
  try {
    backupDatabase.exec(`
      PRAGMA journal_mode = DELETE;
      CREATE TABLE IF NOT EXISTS collection_store (
        collection_key TEXT PRIMARY KEY,
        payload TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      DELETE FROM collection_store;
      ATTACH DATABASE '${escapeSqlitePath(databasePath)}' AS source_db;
      INSERT INTO collection_store (collection_key, payload, updated_at)
      SELECT collection_key, payload, updated_at FROM source_db.collection_store;
      DETACH DATABASE source_db;
    `);
  } finally {
    backupDatabase.close();
  }

  console.log("SQLite migration completed:");
  console.log(`- Primary database: ${databasePath}`);
  console.log(`- Backup database: ${backupDatabasePath}`);
  for (const line of summary) {
    console.log(line);
  }
} catch (error) {
  try {
    database.exec("ROLLBACK");
  } catch {
    // Ignore rollback failure after a failed migration attempt.
  }
  database.close();
  throw error;
}

async function readJsonArray(filePath, payloadKey) {
  try {
    const payload = JSON.parse(await readFile(filePath, "utf8"));
    return Array.isArray(payload?.[payloadKey]) ? payload[payloadKey] : [];
  } catch (error) {
    if (error?.code === "ENOENT") {
      return [];
    }

    throw new Error(`Unable to read migration source ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function escapeSqlitePath(value) {
  return value.replace(/'/g, "''");
}
