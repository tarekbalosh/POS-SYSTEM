import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createOrderDto: CreateOrderDto, userId: string): Promise<{
        items: {
            id: string;
            status: import(".prisma/client").$Enums.OrderItemStatus;
            menuItemId: string;
            orderId: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            modifiers: import("@prisma/client/runtime/library").JsonValue | null;
            notes: string | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        tableId: string | null;
        type: import(".prisma/client").$Enums.OrderType;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        tax: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        openedAt: Date;
        closedAt: Date | null;
        createdById: string;
    }>;
    updateItemStatus(orderId: string, itemId: string, status: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.OrderItemStatus;
        menuItemId: string;
        orderId: string;
        quantity: number;
        unitPrice: import("@prisma/client/runtime/library").Decimal;
        modifiers: import("@prisma/client/runtime/library").JsonValue | null;
        notes: string | null;
    }>;
    private deductStock;
}
