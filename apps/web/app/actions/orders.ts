'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { ordersApi } from '@/lib/api/domains';

const CreateOrderSchema = z.object({
  tableId: z.string().optional(),
  type: z.enum(['DINE_IN', 'TAKEAWAY', 'DELIVERY']),
  items: z.array(z.object({
    menuItemId: z.string(),
    quantity: z.number().min(1),
    price: z.number(),
    notes: z.string().optional(),
  })),
});

export async function createOrderAction(formData: any) {
  const validated = CreateOrderSchema.safeParse(formData);
  
  if (!validated.success) {
    return { error: { message: 'Invalid input', fields: validated.error.flatten().fieldErrors } };
  }

  try {
    const data = await ordersApi.create(validated.data);
    revalidateTag('orders');
    return { data };
  } catch (error: any) {
    return { error: { message: error.message || 'Failed to create order' } };
  }
}

export async function updateOrderStatusAction(id: string, status: string) {
  try {
    await ordersApi.updateStatus(id, status);
    revalidateTag('orders');
    revalidateTag(`order-${id}`);
    return { success: true };
  } catch (error: any) {
    return { error: { message: error.message } };
  }
}
