import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [MenuService, PrismaService],
  exports: [MenuService],
})
export class MenuModule {}
