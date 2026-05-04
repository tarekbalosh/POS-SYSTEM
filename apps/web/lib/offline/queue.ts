import { getDB } from './db';

export class OfflineQueueManager {
  static async enqueue(entityType: string, action: 'CREATE' | 'UPDATE' | 'DELETE', payload: any) {
    const db = await getDB();
    await db.add('offline_queue', {
      entity_type: entityType,
      action,
      payload,
      created_at: new Date().toISOString(),
      retry_count: 0,
      status: 'pending',
    });

    // Trigger Background Sync if available
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).sync.register('pos-sync');
    }
  }

  static async getPendingCount() {
    const db = await getDB();
    return db.countFromIndex('offline_queue', 'by-status', 'pending');
  }

  static async getFailedCount() {
    const db = await getDB();
    return db.countFromIndex('offline_queue', 'by-status', 'failed');
  }

  static async getStatus() {
    const db = await getDB();
    const pending = await this.getPendingCount();
    const failed = await this.getFailedCount();
    return { pending, failed, lastSyncAt: localStorage.getItem('last_sync_at') };
  }
}
