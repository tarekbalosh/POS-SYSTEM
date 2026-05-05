import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.client.menuItem.findMany({
      include: { category: true, modifiers: true },
    });
  }

  async findByCategory(categoryId: string) {
    return this.prisma.client.menuItem.findMany({
      where: { categoryId },
      include: { category: true },
    });
  }

  async create(data: any) {
    return this.prisma.client.menuItem.create({ data });
  }
}
