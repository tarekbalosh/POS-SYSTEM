import { Injectable } from '@nestjs/common';
import { Decimal } from 'decimal.js';

export interface TaxRate {
  id: string;
  name: string;
  rate: number; // e.g. 0.10 for 10%
  type: 'INCLUSIVE' | 'EXCLUSIVE';
}

@Injectable()
export class TaxEngine {
  calculateItemTax(price: number, quantity: number, rate: TaxRate) {
    const total = new Decimal(price).mul(quantity);
    const rateDec = new Decimal(rate.rate);

    if (rate.type === 'INCLUSIVE') {
      // Amount = Total * Rate / (1 + Rate)
      const taxAmount = total.mul(rateDec).div(new Decimal(1).add(rateDec));
      const netRevenue = total.minus(taxAmount);
      return { taxAmount, netRevenue };
    } else {
      // Amount = Total * Rate
      const taxAmount = total.mul(rateDec);
      const netRevenue = total;
      return { taxAmount, netRevenue };
    }
  }

  calculateOrderTaxBreakdown(items: any[], rates: TaxRate[]) {
    const breakdown = new Map<string, { name: string; amount: Decimal }>();

    for (const item of items) {
      const rate = rates.find((r) => r.id === item.taxRateId);
      if (!rate) continue;

      const { taxAmount } = this.calculateItemTax(
        item.unitPrice,
        item.quantity,
        rate,
      );

      const existing = breakdown.get(rate.id) || {
        name: rate.name,
        amount: new Decimal(0),
      };
      breakdown.set(rate.id, {
        name: rate.name,
        amount: existing.amount.plus(taxAmount),
      });
    }

    return Array.from(breakdown.entries()).map(([id, val]) => ({
      taxRateId: id,
      name: val.name,
      amount: val.amount.toNumber(),
    }));
  }
}
