"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalEntryMapper = void 0;
const common_1 = require("@nestjs/common");
const decimal_js_1 = require("decimal.js");
let JournalEntryMapper = class JournalEntryMapper {
    async buildEntry(event, mappings) {
        const lines = [];
        const date = new Date();
        switch (event.type) {
            case 'ORDER_PAID':
                const { order, payment } = event.data;
                const methodKey = `${payment.method}_PAYMENT_DEBIT`;
                lines.push({
                    accountCode: mappings[methodKey].code,
                    accountName: mappings[methodKey].name,
                    debit: new decimal_js_1.Decimal(payment.amount),
                    credit: null,
                });
                lines.push({
                    accountCode: mappings['FOOD_REVENUE'].code,
                    accountName: mappings['FOOD_REVENUE'].name,
                    debit: null,
                    credit: new decimal_js_1.Decimal(order.subtotal).minus(order.discount || 0),
                });
                lines.push({
                    accountCode: mappings['TAX_PAYABLE'].code,
                    accountName: mappings['TAX_PAYABLE'].name,
                    debit: null,
                    credit: new decimal_js_1.Decimal(order.tax),
                });
                if (order.discount > 0) {
                    lines.push({
                        accountCode: mappings['DISCOUNT_GIVEN'].code,
                        accountName: mappings['DISCOUNT_GIVEN'].name,
                        debit: new decimal_js_1.Decimal(order.discount),
                        credit: null,
                    });
                }
                break;
            case 'STOCK_WASTED':
                const { ingredient, costValue } = event.data;
                lines.push({
                    accountCode: mappings['WASTE_EXPENSE'].code,
                    accountName: mappings['WASTE_EXPENSE'].name,
                    debit: new decimal_js_1.Decimal(costValue),
                    credit: null,
                });
                lines.push({
                    accountCode: mappings['INVENTORY_ASSET'].code,
                    accountName: mappings['INVENTORY_ASSET'].name,
                    debit: null,
                    credit: new decimal_js_1.Decimal(costValue),
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
};
exports.JournalEntryMapper = JournalEntryMapper;
exports.JournalEntryMapper = JournalEntryMapper = __decorate([
    (0, common_1.Injectable)()
], JournalEntryMapper);
//# sourceMappingURL=journal-entry.mapper.js.map