import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    return this.prisma.client.$transaction(async (tx) => {
      // 1. Create the order
      const order = await tx.order.create({
        data: {
          tableId: createOrderDto.tableId,
          type: createOrderDto.type,
          createdById: userId,
          subtotal: 0, // Will update after items
          tax: 0,
          total: 0,
          items: {
            create: createOrderDto.items.map((item: any) => ({
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              unitPrice: item.price,
              notes: item.notes,
            }))
          }
        },
        include: { items: true }
      });

      // 2. Calculate totals
      const subtotal = order.items.reduce((acc, item) => acc + (Number(item.unitPrice) * item.quantity), 0);
      const tax = subtotal * 0.1; // 10% tax example
      const total = subtotal + tax;

      return tx.order.update({
        where: { id: order.id },
        data: { subtotal, tax, total },
        include: { items: true }
      });
    });
  }

  async updateItemStatus(orderId: string, itemId: string, status: string) {
    const item = await this.prisma.client.orderItem.findUnique({
      where: { id: itemId },
      include: { menuItem: { include: { ingredients: true } } }
    });

    if (!item) throw new NotFoundException('Item not found');

    // Business Logic: Stock deduction triggers on status -> PREPARING
    if (status === 'PREPARING' && item.status === 'PENDING') {
      await this.deductStock(item.menuItemId, item.quantity);
    }

    return this.prisma.client.orderItem.update({
      where: { id: itemId },
      data: { status: status as any }
    });
  }

  private async deductStock(menuItemId: string, quantity: number) {
    const recipe = await this.prisma.client.itemIngredient.findMany({
      where: { menuItemId }
    });

    for (const ingredient of recipe) {
      const deduction = Number(ingredient.quantityUsed) * quantity;
      
      await this.prisma.client.ingredient.update({
        where: { id: ingredient.ingredientId },
        data: { 
          currentStock: { decrement: deduction },
          movements: {
            create: {
              type: 'SALE_DEDUCTION',
              quantity: deduction,
              note: `Order deduction for menu item ${menuItemId}`
            }
          }
        }
      });
      
      // Auto-disable menu item if ingredient < 1
      const updated = await this.prisma.client.ingredient.findUnique({ where: { id: ingredient.ingredientId } });
      if (updated && Number(updated.currentStock) < Number(updated.minThreshold)) {
        // Emit low stock alert (e.g. via Socket.io or Email)
      }
    }
  }
}
