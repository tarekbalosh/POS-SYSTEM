import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, menuApi } from '@/lib/api/domains';

export function useMenu(categoryId?: string) {
  return useQuery({
    queryKey: ['menu', categoryId],
    queryFn: () => menuApi.getItems({ categoryId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useOrders(filter?: any) {
  return useQuery({
    queryKey: ['orders', filter],
    queryFn: () => ordersApi.getAll(filter),
    refetchInterval: 30000, // Refresh every 30s
  });
}

export function useAddItemToOrder(orderId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (item: any) => ordersApi.addItem(orderId, item),
    onMutate: async (newItem) => {
      // Optimistic Update
      await queryClient.cancelQueries({ queryKey: ['orders', orderId] });
      const snapshot = queryClient.getQueryData(['orders', orderId]);
      
      queryClient.setQueryData(['orders', orderId], (old: any) => ({
        ...old,
        items: [...(old?.items || []), { ...newItem, id: 'temp-' + Date.now(), status: 'PENDING' }]
      }));
      
      return { snapshot };
    },
    onError: (_, __, ctx: any) => {
      queryClient.setQueryData(['orders', orderId], ctx.snapshot);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] });
    }
  });
}
