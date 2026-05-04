import { Injectable } from '@nestjs/common';
import { Decimal } from 'decimal.js';

export interface POSEvent {
  id: string;
  type: 'ORDER_PAID' | 'PAYMENT_VOIDED' | 'STOCK_PURCHASED' | 'STOCK_WASTED';
  data: any;
}

@Injectable()
export class JournalEntryMapper {
  async buildEntry(event: POSEvent, mappings: Record<string, any>) {
    const lines: any[] = [];
    const date = new Date();

    switch (event.type) {
      case 'ORDER_PAID':
        const { order, payment } = event.data;
        const methodKey = `${payment.method}_PAYMENT_DEBIT`;
        
        // Dr Cash/Card/E-Wallet
        lines.push({
          accountCode: mappings[methodKey].code,
          accountName: mappings[methodKey].name,
          debit: new Decimal(payment.amount),
          credit: null,
        });

        // Cr Food Revenue (Subtotal - Discount)
        lines.push({
          accountCode: mappings['FOOD_REVENUE'].code,
          accountName: mappings['FOOD_REVENUE'].name,
          debit: null,
          credit: new Decimal(order.subtotal).minus(order.discount || 0),
        });

        // Cr Tax Payable
        lines.push({
          accountCode: mappings['TAX_PAYABLE'].code,
          accountName: mappings['TAX_PAYABLE'].name,
          debit: null,
          credit: new Decimal(order.tax),
        });

        // If discount > 0: Dr Discount Given
        if (order.discount > 0) {
          lines.push({
            accountCode: mappings['DISCOUNT_GIVEN'].code,
            accountName: mappings['DISCOUNT_GIVEN'].name,
            debit: new Decimal(order.discount),
            credit: null,
          });
        }
        break;

      case 'STOCK_WASTED':
        const { ingredient, costValue } = event.data;
        // Dr Waste Expense
        lines.push({
          accountCode: mappings['WASTE_EXPENSE'].code,
          accountName: mappings['WASTE_EXPENSE'].name,
          debit: new Decimal(costValue),
          credit: null,
        });
        // Cr Inventory Asset
        lines.push({
          accountCode: mappings['INVENTORY_ASSET'].code,
          accountName: mappings['INVENTORY_ASSET'].name,
          debit: null,
          credit: new Decimal(costValue),
        });
        break;
    }

    return {
      eventId: event.id,
      eventType: event.type,
      description: `POS Event: ${event.type} - ${event.id}`,
      reference: event.id,
      date,
      lines,
    };
  }
}
