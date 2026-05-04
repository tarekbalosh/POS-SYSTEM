export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SERVED = 'SERVED',
  CANCELLED = 'CANCELLED',
  PAID = 'PAID'
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  schema: string;
}

export interface Order {
  id: string;
  tenantId: string;
  tableNumber: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}
