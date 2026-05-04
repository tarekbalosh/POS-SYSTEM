import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../src/modules/orders/orders.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { orderFactory } from './factories/pos.factory';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should create a PENDING order for dine-in', async () => {
    const dto = { type: 'DINE_IN', tableId: 'T1', items: [] };
    const mockOrder = orderFactory({ type: 'DINE_IN', status: 'PENDING' });
    
    (prisma.client.order as any).create.mockResolvedValue(mockOrder);

    const result = await service.create(dto as any, 'user_1');
    expect(result.status).toBe('PENDING');
    expect(prisma.client.order.create).toHaveBeenCalled();
  });

  it('should throw ConflictException if table is occupied', async () => {
    (prisma.client.order as any).findFirst.mockResolvedValue({ id: 'existing' });
    
    const dto = { type: 'DINE_IN', tableId: 'T1', items: [] };
    await expect(service.create(dto as any, 'user_1')).rejects.toThrow();
  });
});
