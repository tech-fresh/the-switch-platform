import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { BlobNotFoundError, copy, get, head, put } from "@vercel/blob";

const VERCEL_BLOB_SCHEME = "vercel-blob://";

export interface DownloadedBlobFile {
  exists: boolean;
  bytes: Buffer;
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
