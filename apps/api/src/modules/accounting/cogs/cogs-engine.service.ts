import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Decimal } from 'decimal.js';

@Injectable()
export class COGSEngine {
  constructor(private prisma: PrismaService) {}

  async calculateOrderCOGS(orderId: string): Promise<Decimal> {
    const orderItems = await this.prisma.client.orderItem.findMany({
      where: { orderId },
      include: {
        menuItem: {
          include: { ingredients: { include: { ingredient: true } } },
        },
      },
    });

    let totalCOGS = new Decimal(0);

    for (const item of orderItems) {
      for (const recipeItem of item.menuItem.ingredients) {
        const qtyUsed = new Decimal(recipeItem.quantityUsed);
        const costPerUnit = new Decimal(recipeItem.ingredient.costPerUnit);
        const itemCOGS = qtyUsed.mul(item.quantity).mul(costPerUnit);

        totalCOGS = totalCOGS.add(itemCOGS);
      }
    }

    return totalCOGS;
  }
}
