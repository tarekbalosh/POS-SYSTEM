import Dexie, { Table } from 'dexie';

export interface OfflineOperation {
  id?: number;
  type: 'CREATE_ORDER' | 'UPDATE_STATUS' | 'ADD_ITEM';
  payload: any;
  createdAt: number;
}

class OfflineDatabase extends Dexie {
  operations!: Table<OfflineOperation>;

  constructor() {
    super('OfflineQueue');
    this.version(1).stores({
      operations: '++id, type, createdAt'
    });
  }
}

export const offlineDb = new OfflineDatabase();

export async function offlineAwareRequest<T>(
  requestFn: () => Promise<T>,
  operation: Omit<OfflineOperation, 'createdAt'>
): Promise<T | { offline: true; tempId: string }> {
  if (typeof window !== 'undefined' && !navigator.onLine) {
    await offlineDb.operations.add({
      ...operation,
      createdAt: Date.now()
    });
    
    // Register for background sync if supported
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).sync.register('sync-orders');
    }
    
    return { offline: true, tempId: 'temp-' + Date.now() };
  }

  try {
    return await requestFn();
  } catch (error) {
    // If it's a network error, queue it
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      await offlineDb.operations.add({
        ...operation,
        createdAt: Date.now()
      });
      return { offline: true, tempId: 'temp-' + Date.now() };
    }
    throw error;
  }
}
