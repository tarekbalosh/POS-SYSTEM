import { PrismaService } from '../../prisma/prisma.service';
export declare class TenantsService {
    private prisma;
    constructor(prisma: PrismaService);
    createTenant(name: string, subdomain: string): Promise<{
        id: string;
        name: string;
        subdomain: string;
        plan: import(".prisma/client").$Enums.Plan;
        status: import(".prisma/client").$Enums.TenantStatus;
        createdAt: Date;
    }>;
}
