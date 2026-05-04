import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('push')
  async push(@Body() body: { clientId: string; operations: any[] }) {
    return this.syncService.processPush(body.clientId, body.operations);
  }

  @Get('pull')
  async pull(@Query('since') since: string) {
    return this.syncService.processPull(since);
  }
}
