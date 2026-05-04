'use client';

import { useState, useEffect } from 'react';
import { OfflineQueueManager } from '@/lib/offline/queue';

export function useOfflineQueue() {
  const [status, setStatus] = useState<{ pending: number; failed: number; lastSyncAt: string | null } | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const currentStatus = await OfflineQueueManager.getStatus();
      setStatus(currentStatus as any);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000); // Poll every 5s

    return () => clearInterval(interval);
  }, []);

  return { status };
}
