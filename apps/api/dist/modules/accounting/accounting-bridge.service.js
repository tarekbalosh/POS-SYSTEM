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
exports.AccountingBridgeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const journal_entry_mapper_1 = require("./mappers/journal-entry.mapper");
const decimal_js_1 = require("decimal.js");
let AccountingBridgeService = class AccountingBridgeService {
    prisma;
    mapper;
    constructor(prisma, mapper) {
        this.prisma = prisma;
        this.mapper = mapper;
    }
    async processEvent(event) {
        const existing = await this.prisma.client.processedEvent.findUnique({
            where: { eventId: event.id },
        });
        if (existing)
            return;
        const mappingRecords = await this.prisma.client.accountMapping.findMany();
        const mappings = mappingRecords.reduce((acc, rec) => {
            acc[rec.mappingKey] = { code: rec.accountCode, name: rec.accountName };
            return acc;
        }, {});
        const entryData = await this.mapper.buildEntry(event, mappings);
        this.validateBalance(entryData.lines);
        return this.prisma.client.$transaction(async (tx) => {
            const entry = await tx.journalEntry.create({
                data: {
                    eventId: entryData.eventId,
                    eventType: entryData.eventType,
                    description: entryData.description,
                    reference: entryData.reference,
                    date: entryData.date,
                    lines: {
                        create: entryData.lines.map(line => ({
                            accountCode: line.accountCode,
                            accountName: line.accountName,
                            debit: line.debit ? line.debit.toNumber() : null,
                            credit: line.credit ? line.credit.toNumber() : null,
                        }))
                    }
                }
            });
            await tx.processedEvent.create({
                data: {
                    eventId: event.id,
                    journalEntryId: entry.id,
                }
            });
            return entry;
        });
    }
    validateBalance(lines) {
        const totalDebit = lines.reduce((acc, l) => acc.plus(l.debit || 0), new decimal_js_1.Decimal(0));
        const totalCredit = lines.reduce((acc, l) => acc.plus(l.credit || 0), new decimal_js_1.Decimal(0));
        if (!totalDebit.equals(totalCredit)) {
            throw new common_1.BadRequestException(`Journal entry not balanced. Dr: ${totalDebit}, Cr: ${totalCredit}`);
        }
    }
};
exports.AccountingBridgeService = AccountingBridgeService;
exports.AccountingBridgeService = AccountingBridgeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        journal_entry_mapper_1.JournalEntryMapper])
], AccountingBridgeService);
//# sourceMappingURL=accounting-bridge.service.js.map