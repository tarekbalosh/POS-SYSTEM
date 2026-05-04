import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 20 },  // Stay at 20 users
    { duration: '30s', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must be under 500ms
  },
};

export default function () {
  const BASE_URL = 'http://api.pos-saas.local';
  
  // 1. Get Menu
  const menuRes = http.get(`${BASE_URL}/menu/items`);
  check(menuRes, { 'status is 200': (r) => r.status === 200 });

  // 2. Create Order
  const payload = JSON.stringify({
    type: 'TAKEAWAY',
    items: [{ menuItemId: 'item_1', quantity: 1, price: 15.50 }]
  });
  
  const orderRes = http.post(`${BASE_URL}/orders`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(orderRes, { 'order created': (r) => r.status === 201 });

  sleep(1);
}
