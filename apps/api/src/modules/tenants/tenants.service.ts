import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { execSync } from 'child_process';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async createTenant(name: string, subdomain: string) {
    const existing = await this.prisma.tenant.findUnique({
      where: { subdomain },
    });
    if (existing) throw new BadRequestException('Subdomain already exists');

    const tenant = await this.prisma.tenant.create({
      data: { name, subdomain },
    });

    const schemaName = `tenant_${tenant.id.replace(/-/g, '_')}`;

    try {
      // Create schema and push database structure
      await this.prisma.$executeRawUnsafe(
        `CREATE SCHEMA IF NOT EXISTS "${schemaName}"`,
      );

      const dbUrl = process.env.DATABASE_URL;
      if (!dbUrl) throw new Error('DATABASE_URL not configured');
      const tenantDbUrl = `${dbUrl}${dbUrl.includes('?') ? '&' : '?'}schema=${schemaName}`;

      // In production, use migrations. For this demo, db push is used.
      execSync(
        `npx prisma db push --schema=../../packages/database/schema.prisma`,
        {
          env: { ...process.env, DATABASE_URL: tenantDbUrl },
        },
      );

      return tenant;
    } catch (error) {
      console.error('Failed to provision tenant:', error);
      throw new Error('Provisioning failed');
    }
  }
}
