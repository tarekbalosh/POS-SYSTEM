import { Decimal } from 'decimal.js';
export interface TaxRate {
    id: string;
    name: string;
    rate: number;
    type: 'INCLUSIVE' | 'EXCLUSIVE';
}
export declare class TaxEngine {
    calculateItemTax(price: number, quantity: number, rate: TaxRate): {
        taxAmount: Decimal;
        netRevenue: Decimal;
    };
    calculateOrderTaxBreakdown(items: any[], rates: TaxRate[]): {
        taxRateId: string;
        name: string;
        amount: number;
    }[];
}
