import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createOrderDto: CreateOrderDto, userId: string): Promise<{
        items: {
            menuItemId: string;
            quantity: number;
            notes: string | null;
            id: string;
            status: import(".prisma/client").$Enums.OrderItemStatus;
            orderId: string;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            modifiers: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    } & {
        tableId: string | null;
        type: import(".prisma/client").$Enums.OrderType;
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        tax: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        openedAt: Date;
        closedAt: Date | null;
        createdById: string;
    }>;
    updateItemStatus(orderId: string, itemId: string, status: string): Promise<{
        menuItemId: string;
        quantity: number;
        notes: string | null;
        id: string;
        status: import(".prisma/client").$Enums.OrderItemStatus;
        orderId: string;
        unitPrice: import("@prisma/client/runtime/library").Decimal;
        modifiers: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    private deductStock;
}
