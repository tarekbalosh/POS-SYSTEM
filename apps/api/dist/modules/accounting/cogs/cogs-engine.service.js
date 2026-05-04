"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COGSEngine = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const decimal_js_1 = require("decimal.js");
let COGSEngine = class COGSEngine {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async calculateOrderCOGS(orderId) {
        const orderItems = await this.prisma.client.orderItem.findMany({
            where: { orderId },
            include: { menuItem: { include: { ingredients: { include: { ingredient: true } } } } }
        });
        let totalCOGS = new decimal_js_1.Decimal(0);
        for (const item of orderItems) {
            for (const recipeItem of item.menuItem.ingredients) {
                const qtyUsed = new decimal_js_1.Decimal(recipeItem.quantityUsed);
                const costPerUnit = new decimal_js_1.Decimal(recipeItem.ingredient.costPerUnit);
                const itemCOGS = qtyUsed.mul(item.quantity).mul(costPerUnit);
                totalCOGS = totalCOGS.add(itemCOGS);
            }
        }
        return totalCOGS;
    }
};
exports.COGSEngine = COGSEngine;
exports.COGSEngine = COGSEngine = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], COGSEngine);
//# sourceMappingURL=cogs-engine.service.js.map