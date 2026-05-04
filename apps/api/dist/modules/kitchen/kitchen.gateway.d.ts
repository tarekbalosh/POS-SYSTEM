import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class KitchenGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    broadcastNewOrder(tenantId: string, order: any): void;
    handleItemReady(client: Socket, payload: {
        orderId: string;
        itemId: string;
    }): void;
}
