export interface MemoryCollectionStore<TRecord> {
  read(): Promise<TRecord[]>;
  write(records: TRecord[]): Promise<void>;
}

const memoryCollections = new Map<string, unknown[]>();

export function createMemoryCollectionStore<TRecord>(collectionKey: string): MemoryCollectionStore<TRecord> {
  return {
    async read() {
      const records = memoryCollections.get(collectionKey);
      return Array.isArray(records) ? ([...records] as TRecord[]) : [];
    },
    async write(records) {
      memoryCollections.set(collectionKey, [...records]);
    },
  };
}

export function resetMemoryCollections(): void {
  memoryCollections.clear();
}
