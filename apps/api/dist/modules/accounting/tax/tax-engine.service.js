"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxEngine = void 0;
const common_1 = require("@nestjs/common");
const decimal_js_1 = require("decimal.js");
let TaxEngine = class TaxEngine {
    calculateItemTax(price, quantity, rate) {
        const total = new decimal_js_1.Decimal(price).mul(quantity);
        const rateDec = new decimal_js_1.Decimal(rate.rate);
        if (rate.type === 'INCLUSIVE') {
            const taxAmount = total.mul(rateDec).div(new decimal_js_1.Decimal(1).add(rateDec));
            const netRevenue = total.minus(taxAmount);
            return { taxAmount, netRevenue };
        }
        else {
            const taxAmount = total.mul(rateDec);
            const netRevenue = total;
            return { taxAmount, netRevenue };
        }
    }
    calculateOrderTaxBreakdown(items, rates) {
        const breakdown = new Map();
        for (const item of items) {
            const rate = rates.find(r => r.id === item.taxRateId);
            if (!rate)
                continue;
            const { taxAmount } = this.calculateItemTax(item.unitPrice, item.quantity, rate);
            const existing = breakdown.get(rate.id) || { name: rate.name, amount: new decimal_js_1.Decimal(0) };
            breakdown.set(rate.id, {
                name: rate.name,
                amount: existing.amount.plus(taxAmount)
            });
        }
        return Array.from(breakdown.entries()).map(([id, val]) => ({
            taxRateId: id,
            name: val.name,
            amount: val.amount.toNumber(),
        }));
    }
};
exports.TaxEngine = TaxEngine;
exports.TaxEngine = TaxEngine = __decorate([
    (0, common_1.Injectable)()
], TaxEngine);
//# sourceMappingURL=tax-engine.service.js.map