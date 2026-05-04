import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  public static readonly als = new AsyncLocalStorage<{ schema: string; tenantId: string }>();

  constructor() {
    super({
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Extends the Prisma Client to automatically set the search_path for every query.
   */
  get client() {
    return this.$extends({
      query: {
        $allModels: {
          async $allOperations({ args, query, operation, model }) {
            const store = PrismaService.als.getStore();
            if (!store?.schema) return query(args);

            // Using a transaction to ensure SET search_path only affects the current query's connection
            return (this as any).$transaction(async (tx: any) => {
              await tx.$executeRawUnsafe(`SET search_path TO "${store.schema}", public`);
              return tx[model][operation](args);
            });
          },
        },
      },
    });
  }
}
