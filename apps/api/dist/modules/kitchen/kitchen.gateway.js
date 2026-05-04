"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KitchenGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let KitchenGateway = class KitchenGateway {
    server;
    handleConnection(client) {
        const tenantId = client.handshake.headers['x-tenant-id'];
        if (tenantId) {
            client.join(`tenant:${tenantId}:kitchen`);
            console.log(`Client ${client.id} joined kitchen room for tenant ${tenantId}`);
        }
    }
    handleDisconnect(client) {
        console.log(`Client ${client.id} disconnected`);
    }
    broadcastNewOrder(tenantId, order) {
        this.server.to(`tenant:${tenantId}:kitchen`).emit('order:new', order);
    }
    handleItemReady(client, payload) {
        const tenantId = client.handshake.headers['x-tenant-id'];
        this.server.to(`tenant:${tenantId}:kitchen`).emit('order:item:ready', payload);
    }
};
exports.KitchenGateway = KitchenGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], KitchenGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('order:item:ready'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], KitchenGateway.prototype, "handleItemReady", null);
exports.KitchenGateway = KitchenGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: 'kitchen',
    })
], KitchenGateway);
//# sourceMappingURL=kitchen.gateway.js.map