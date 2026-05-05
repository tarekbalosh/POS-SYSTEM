import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'kitchen',
})
export class KitchenGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const tenantId = client.handshake.headers['x-tenant-id'] as string;
    if (tenantId) {
      client.join(`tenant:${tenantId}:kitchen`);
      console.log(
        `Client ${client.id} joined kitchen room for tenant ${tenantId}`,
      );
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }

  // Method to be called from OrdersService when a new order is created
  broadcastNewOrder(tenantId: string, order: any) {
    this.server.to(`tenant:${tenantId}:kitchen`).emit('order:new', order);
  }

  @SubscribeMessage('order:item:ready')
  handleItemReady(
    client: Socket,
    payload: { orderId: string; itemId: string },
  ) {
    const tenantId = client.handshake.headers['x-tenant-id'] as string;
    this.server
      .to(`tenant:${tenantId}:kitchen`)
      .emit('order:item:ready', payload);
  }
}
