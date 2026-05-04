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
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const child_process_1 = require("child_process");
let TenantsService = class TenantsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTenant(name, subdomain) {
        const existing = await this.prisma.tenant.findUnique({ where: { subdomain } });
        if (existing)
            throw new common_1.BadRequestException('Subdomain already exists');
        const tenant = await this.prisma.tenant.create({
            data: { name, subdomain },
        });
        const schemaName = `tenant_${tenant.id.replace(/-/g, '_')}`;
        try {
            await this.prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
            const dbUrl = process.env.DATABASE_URL;
            if (!dbUrl)
                throw new Error('DATABASE_URL not configured');
            const tenantDbUrl = `${dbUrl}${dbUrl.includes('?') ? '&' : '?'}schema=${schemaName}`;
            (0, child_process_1.execSync)(`npx prisma db push --schema=../../packages/database/schema.prisma`, {
                env: { ...process.env, DATABASE_URL: tenantDbUrl },
            });
            return tenant;
        }
        catch (error) {
            console.error('Failed to provision tenant:', error);
            throw new Error('Provisioning failed');
        }
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map