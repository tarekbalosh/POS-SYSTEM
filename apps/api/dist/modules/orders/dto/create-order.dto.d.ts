export declare enum OrderType {
    DINE_IN = "DINE_IN",
    TAKEAWAY = "TAKEAWAY",
    DELIVERY = "DELIVERY"
}
declare class OrderItemDto {
    menuItemId: string;
    quantity: number;
    price: number;
    notes?: string;
}
export declare class CreateOrderDto {
    tableId?: string;
    type: OrderType;
    items: OrderItemDto[];
}
export {};
