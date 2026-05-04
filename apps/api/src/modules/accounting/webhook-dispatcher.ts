import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class WebhookDispatcher {
  async dispatch(payload: any, config: { endpointUrl: string; secret: string }) {
    const signature = this.generateSignature(payload, config.secret);

    try {
      await axios.post(config.endpointUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': signature,
        },
        timeout: 5000,
      });
      return { success: true };
    } catch (error) {
      console.error(`Webhook dispatch failed to ${config.endpointUrl}`, error.message);
      // In prod, this would trigger BullMQ retry logic
      throw error;
    }
  }

  private generateSignature(payload: any, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');
  }
}
