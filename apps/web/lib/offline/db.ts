import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface POSDatabase extends DBSchema {
  offline_queue: {
    key: number;
    value: {
      id?: number;
      entity_type: string;
      action: 'CREATE' | 'UPDATE' | 'DELETE';
      payload: any;
      created_at: string;
      retry_count: number;
      status: 'pending' | 'processing' | 'synced' | 'failed';
      error_message?: string;
    };
    indexes: { 'by-status': string };
  };
  pending_orders: {
    key: string;
    value: any;
  };
  menu_cache: {
    key: string;
    value: any;
  };
  categories_cache: {
    key: string;
    value: any;
  };
}

let dbPromise: Promise<IDBPDatabase<POSDatabase>>;

export const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<POSDatabase>('pos_offline_db', 1, {
      upgrade(db) {
        const queueStore = db.createObjectStore('offline_queue', {
          keyPath: 'id',
          autoIncrement: true,
        });
        queueStore.createIndex('by-status', 'status');

        db.createObjectStore('pending_orders', { keyPath: 'local_id' });
        db.createObjectStore('menu_cache', { keyPath: 'id' });
        db.createObjectStore('categories_cache', { keyPath: 'id' });
      },
    });
  }
  return dbPromise;
};
