export interface POSEvent {
    id: string;
    type: 'ORDER_PAID' | 'PAYMENT_VOIDED' | 'STOCK_PURCHASED' | 'STOCK_WASTED';
    data: any;
}
export declare class JournalEntryMapper {
    buildEntry(event: POSEvent, mappings: Record<string, any>): Promise<{
        eventId: string;
        eventType: "ORDER_PAID" | "PAYMENT_VOIDED" | "STOCK_PURCHASED" | "STOCK_WASTED";
        description: string;
        reference: string;
        date: Date;
        lines: any[];
    }>;
}
