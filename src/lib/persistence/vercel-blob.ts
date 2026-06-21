import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { BlobNotFoundError, copy, get, head, put } from "@vercel/blob";

const VERCEL_BLOB_SCHEME = "vercel-blob://";

export class VercelBlobStoreSuspendedError extends Error {
  name = "VercelBlobStoreSuspendedError";

  constructor(message: string) {
    super(message);
  }
}

export type VercelBlobReadHealthStatus =
  | "not-applicable"
  | "missing-auth"
  | "missing"
  | "suspended"
  | "unreadable"
  | "healthy";

export type VercelBlobReadHealth =
  | { status: "not-applicable" }
  | { status: "missing-auth"; detail: string }
  | { status: "missing"; blobPath: string }
  | { status: "suspended"; blobPath: string; detail: string }
  | { status: "unreadable"; blobPath: string; detail: string }
  | { status: "healthy"; blobPath: string; byteLength: number };

export interface DownloadedBlobFile {
  exists: boolean;
  bytes: Buffer;
}

export function isVercelBlobStoreSuspendedError(error: unknown): boolean {
  if (error instanceof VercelBlobStoreSuspendedError) {
    return true;
  }

  const message = getErrorMessage(error).toLowerCase();

  return message.includes("store has been suspended") || message.includes("blobstoresuspended");
}

export async function probeVercelBlobReadHealth(blobPath: string): Promise<VercelBlobReadHealth> {
  if (!isVercelBlobPersistencePath(blobPath)) {
    return { status: "not-applicable" };
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  const storeId = process.env.BLOB_STORE_ID?.trim();
  const oidcToken = process.env.VERCEL_OIDC_TOKEN?.trim();

  if (!token && !(storeId && oidcToken)) {
    return {
      status: "missing-auth",
      detail: "Set BLOB_READ_WRITE_TOKEN or both BLOB_STORE_ID and VERCEL_OIDC_TOKEN before probing Blob health.",
    };
  }

  try {
    const metadata = await headVercelBlob(blobPath);

    if (!metadata) {
      return { status: "missing", blobPath };
    }

    const result = await get(getVercelBlobPathname(blobPath), {
      access: "private",
      useCache: false,
      ...getBlobAuthOptions(),
    });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return {
        status: "unreadable",
        blobPath,
        detail: `Blob read returned status ${result?.statusCode ?? "unknown"}.`,
      };
    }

    const bytes = Buffer.from(await new Response(result.stream).arrayBuffer());

    return {
      status: "healthy",
      blobPath,
      byteLength: bytes.length,
    };
  } catch (error) {
    if (isVercelBlobStoreSuspendedError(error)) {
      return {
        status: "suspended",
        blobPath,
        detail: getErrorMessage(error),
      };
    }

    return {
      status: "unreadable",
      blobPath,
      detail: getErrorMessage(error),
    };
  }
}

export function isVercelBlobPersistencePath(value: string | null | undefined): value is string {
  return Boolean(value?.startsWith(VERCEL_BLOB_SCHEME));
}

export function normalizeVercelBlobPersistencePath(value: string): string {
  const pathname = value.slice(VERCEL_BLOB_SCHEME.length).replace(/^\/+/, "").replace(/\/+$/, "");

  if (!pathname) {
    throw new Error("vercel-blob persistence paths must include a pathname after vercel-blob://");
  }

  return `${VERCEL_BLOB_SCHEME}${pathname}`;
}

export function joinVercelBlobPersistencePath(basePath: string, ...segments: string[]): string {
  const normalizedBasePath = normalizeVercelBlobPersistencePath(basePath);
  const joinedPathname = path.posix.join(
    normalizedBasePath.slice(VERCEL_BLOB_SCHEME.length),
    ...segments,
  );

  return `${VERCEL_BLOB_SCHEME}${joinedPathname}`;
}

export function getVercelBlobPathname(blobPath: string): string {
  return normalizeVercelBlobPersistencePath(blobPath).slice(VERCEL_BLOB_SCHEME.length);
}

export async function readVercelBlobBytes(blobPath: string): Promise<DownloadedBlobFile> {
  const metadata = await headVercelBlob(blobPath);

  if (!metadata) {
    return {
      exists: false,
      bytes: Buffer.alloc(0),
    };
  }

  try {
    const result = await get(getVercelBlobPathname(blobPath), {
      access: "private",
      useCache: false,
      ...getBlobAuthOptions(),
    });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return {
        exists: false,
        bytes: Buffer.alloc(0),
      };
    }

    const bytes = Buffer.from(await new Response(result.stream).arrayBuffer());

    return {
      exists: true,
      bytes,
    };
  } catch (error) {
    if (isVercelBlobStoreSuspendedError(error)) {
      throw new VercelBlobStoreSuspendedError(getErrorMessage(error));
    }

    throw error;
  }
}

export async function headVercelBlob(blobPath: string) {
  try {
    return await head(getVercelBlobPathname(blobPath), getBlobAuthOptions());
  } catch (error) {
    if (error instanceof BlobNotFoundError) {
      return null;
    }

    throw error;
  }
}

export async function writeVercelBlobBytes(blobPath: string, bytes: Buffer): Promise<void> {
  await put(getVercelBlobPathname(blobPath), bytes, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/vnd.sqlite3",
    ...getBlobAuthOptions(),
  });
}

export async function copyVercelBlob(sourceBlobPath: string, targetBlobPath: string): Promise<void> {
  await copy(getVercelBlobPathname(sourceBlobPath), getVercelBlobPathname(targetBlobPath), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/vnd.sqlite3",
    ...getBlobAuthOptions(),
  });
}

export async function withTemporarySqliteFile<T>(
  primaryBlobPath: string,
  backupBlobPath: string | null | undefined,
  callback: (options: {
    tempDirectory: string;
    localDatabasePath: string;
    localBackupDatabasePath: string | null;
    existingBytes: Buffer | null;
  }) => Promise<T>,
): Promise<T> {
  const tempDirectory = await mkdtemp(path.join(tmpdir(), "switch-blob-sqlite-"));
  const localDatabasePath = path.join(tempDirectory, "switch-live.sqlite");
  const localBackupDatabasePath = backupBlobPath
    ? path.join(tempDirectory, "backups", "switch-live.sqlite")
    : null;

  try {
    const primaryDownload = await readVercelBlobBytes(primaryBlobPath);
    const backupDownload =
      !primaryDownload.exists && backupBlobPath ? await readVercelBlobBytes(backupBlobPath) : null;
    const existingBytes = primaryDownload.exists
      ? primaryDownload.bytes
      : backupDownload?.exists
        ? backupDownload.bytes
        : null;

    if (existingBytes) {
      await writeFile(localDatabasePath, existingBytes);
      if (localBackupDatabasePath) {
        await mkdir(path.dirname(localBackupDatabasePath), { recursive: true });
        await writeFile(localBackupDatabasePath, existingBytes);
      }
    }

    return await callback({
      tempDirectory,
      localDatabasePath,
      localBackupDatabasePath,
      existingBytes,
    });
  } finally {
    await rm(tempDirectory, { recursive: true, force: true });
  }
}

export async function readLocalFileBytes(filePath: string): Promise<Buffer> {
  return readFile(filePath);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function getBlobAuthOptions() {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  const storeId = process.env.BLOB_STORE_ID?.trim();
  const oidcToken = process.env.VERCEL_OIDC_TOKEN?.trim();

  if (token) {
    return {
      token,
    };
  }

  if (storeId && oidcToken) {
    return {
      storeId,
      oidcToken,
    };
  }

  return {};
}
