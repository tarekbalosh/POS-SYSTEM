'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useKitchenSocket(tenantId: string) {
  const [orders, setOrders] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL + '/kitchen', {
      extraHeaders: {
        'x-tenant-id': tenantId,
      },
    });

    socketInstance.on('connect', () => {
      console.log('Connected to kitchen gateway');
    });

    socketInstance.on('order:new', (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
      // Play alert sound
      const audio = new Audio('/sounds/alert.mp3');
      audio.play().catch(e => console.log('Audio blocked by browser'));
    });

    socketInstance.on('order:item:ready', (data) => {
      setOrders((prev) => 
        prev.map(order => 
          order.id === data.orderId 
            ? { ...order, items: order.items.map((i: any) => i.id === data.itemId ? { ...i, status: 'READY' } : i) }
            : order
        )
      );
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [tenantId]);

  return { orders, setOrders, socket };
}
