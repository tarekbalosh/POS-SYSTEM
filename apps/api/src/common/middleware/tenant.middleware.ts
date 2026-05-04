import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
      // In a real app, you might want to throw an error or handle public routes
      return next();
    }

    // Lookup tenant to get their schema name
    // For this demo, we assume the schema name is 'tenant_' + tenantId
    const schema = `tenant_${tenantId.replace(/-/g, '_')}`;

    // Run the rest of the request in the tenant context
    PrismaService.als.run({ schema, tenantId }, () => {
      next();
    });
  }
}
