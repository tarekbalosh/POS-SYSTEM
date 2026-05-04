'use client';

import React from 'react';
import { useConnectivity } from '@/hooks/useConnectivity';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { WifiOff, RefreshCw } from 'lucide-react';

export function OfflineBanner() {
  const { isOnline } = useConnectivity();
  const { status } = useOfflineQueue();

  if (isOnline && (!status || status.pending === 0)) return null;

  return (
    <div className={`w-full px-6 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider ${isOnline ? 'bg-indigo-600 text-white' : 'bg-amber-500 text-slate-900'}`}>
      <div className="flex items-center gap-2">
        {isOnline ? <RefreshCw className="animate-spin" size={14} /> : <WifiOff size={14} />}
        <span>
          {isOnline 
            ? `Syncing ${status?.pending} pending operations...` 
            : 'Offline Mode • Local data will sync automatically when reconnected'}
        </span>
      </div>
      {status && status.pending > 0 && (
        <span className="bg-white/20 px-2 py-0.5 rounded ml-4">
          {status.pending} Pending
        </span>
      )}
    </div>
  );
}
