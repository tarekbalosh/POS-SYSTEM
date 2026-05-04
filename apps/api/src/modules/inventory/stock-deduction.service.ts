import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Decimal } from 'decimal.js';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class StockDeductionService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('low-stock') private lowStockQueue: Queue,
  ) {}

  async deductStockForOrderItem(orderItemId: string) {
    const orderItem = await this.prisma.client.orderItem.findUnique({
      where: { id: orderItemId },
      include: { menuItem: { include: { ingredients: true } } },
    });

    if (!orderItem) return;

    for (const recipeItem of orderItem.menuItem.ingredients) {
      const ingredient = await this.prisma.client.ingredient.findUnique({
        where: { id: recipeItem.ingredientId },
      });

      if (!ingredient) continue;

      const needed = new Decimal(recipeItem.quantityUsed).mul(orderItem.quantity);
      const current = new Decimal(ingredient.currentStock as any);

      if (current.lt(needed)) {
        throw new BadRequestException(`Out of stock: ${ingredient.name}`);
      }

      const newStock = current.minus(needed);

      // Create Stock Movement
      await this.prisma.client.stockMovement.create({
        data: {
          ingredientId: ingredient.id,
          type: 'SALE_DEDUCTION',
          quantity: needed.negated().toNumber(),
          referenceId: orderItem.id,
          note: `Order ${orderItem.orderId} item ${orderItem.id}`,
        },
      });

      // Update Stock
      await this.prisma.client.ingredient.update({
        where: { id: ingredient.id },
        data: { currentStock: newStock.toNumber() },
      });

      // Check for Low Stock Alert
      if (newStock.lte(new Decimal(ingredient.minThreshold as any))) {
        await this.lowStockQueue.add('low-stock-alert', {
          ingredientId: ingredient.id,
          ingredientName: ingredient.name,
          currentStock: newStock.toNumber(),
          unit: ingredient.unit,
        });
      }

      // Auto-disable menu items if ingredient hits zero
      if (newStock.lte(0)) {
        await this.disableItemsUsingIngredient(ingredient.id);
      }
    }
  }

  private async disableItemsUsingIngredient(ingredientId: string) {
    const items = await this.prisma.client.itemIngredient.findMany({
      where: { ingredientId },
      select: { menuItemId: true },
    });

    const itemIds = items.map(i => i.menuItemId);
    
    await this.prisma.client.menuItem.updateMany({
      where: { id: { in: itemIds } },
      data: { isAvailable: false },
    });
  }

  async reverseStockForOrder(orderId: string) {
    const items = await this.prisma.client.orderItem.findMany({
      where: { orderId },
      include: { menuItem: { include: { ingredients: true } } },
    });

    for (const item of items) {
      for (const recipeItem of item.menuItem.ingredients) {
        const quantityToReturn = new Decimal(recipeItem.quantityUsed).mul(item.quantity);

        await this.prisma.client.stockMovement.create({
          data: {
            ingredientId: recipeItem.ingredientId,
            type: 'RETURN',
            quantity: quantityToReturn.toNumber(),
            referenceId: item.id,
            note: `Reversal for cancelled order ${orderId}`,
          },
        });

        await this.prisma.client.ingredient.update({
          where: { id: recipeItem.ingredientId },
          data: { currentStock: { increment: quantityToReturn.toNumber() } },
        });
      }
    }
  }
}
