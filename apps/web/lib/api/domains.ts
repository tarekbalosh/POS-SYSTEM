import { apiClient } from './client';

export const ordersApi = {
  create: (dto: any) => apiClient.post('/orders', dto),
  getAll: (params: any) => apiClient.get('/orders', params),
  getById: (id: string) => apiClient.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) => apiClient.patch(`/orders/${id}/status`, { status }),
  addItem: (orderId: string, item: any) => apiClient.post(`/orders/${orderId}/items`, item),
};

export const menuApi = {
  getCategories: () => apiClient.get('/menu/categories'),
  getItems: (params: any) => apiClient.get('/menu/items', params),
  createItem: (dto: any) => apiClient.post('/menu/items', dto),
  updateItem: (id: string, dto: any) => apiClient.patch(`/menu/items/${id}`, dto),
  toggleAvailability: (id: string) => apiClient.post(`/menu/items/${id}/toggle-availability`, {}),
};

export const inventoryApi = {
  getIngredients: (params: any) => apiClient.get('/inventory/ingredients', params),
  adjustStock: (id: string, adjustment: number) => apiClient.patch(`/inventory/ingredients/${id}/adjust`, { adjustment }),
  getLowStockReport: () => apiClient.get('/inventory/low-stock-report'),
};
