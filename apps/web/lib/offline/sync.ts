import { getDB } from './db';
import { apiClient } from '../api/client';

export async function processOfflineQueue() {
  const db = await getDB();
  const pendingItems = await db.getAllFromIndex('offline_queue', 'by-status', 'pending');

  if (pendingItems.length === 0) return;

  // Mark as processing
  for (const item of pendingItems) {
    await db.put('offline_queue', { ...item, status: 'processing' });
  }

  try {
    const response: any = await apiClient.post('/sync/push', {
      clientId: 'pos-1',
      operations: pendingItems.map(item => ({
        local_id: item.id,
        entity_type: item.entity_type,
        action: item.action,
        payload: item.payload,
        created_at: item.created_at,
      })),
    });

    // Handle Success
    for (const localId of response.success) {
      const item = pendingItems.find(i => i.id === localId);
      if (item) {
        await db.put('offline_queue', { ...item, status: 'synced' });
      }
    }

    // Handle Conflicts (Manager review needed)
    for (const conflict of response.conflicts) {
      const item = pendingItems.find(i => i.id === conflict.local_id);
      if (item) {
        await db.put('offline_queue', { ...item, status: 'failed', error_message: 'CONFLICT' });
      }
    }

    localStorage.setItem('last_sync_at', new Date().toISOString());
  } catch (error) {
    console.error('Sync failed', error);
    // Revert processing status to pending for retry
    for (const item of pendingItems) {
      await db.put('offline_queue', { ...item, status: 'pending' });
    }
  }
}
