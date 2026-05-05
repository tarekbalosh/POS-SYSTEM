import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [OrdersService, PrismaService],
  exports: [OrdersService],
})
export class OrdersModule {}
