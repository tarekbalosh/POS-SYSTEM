import { Decimal } from 'decimal.js';

export const orderFactory = (overrides = {}) => ({
  id: 'order_123',
  tableId: 'table_1',
  type: 'DINE_IN',
  status: 'PENDING',
  subtotal: new Decimal(100),
  tax: new Decimal(10),
  total: new Decimal(110),
  items: [],
  createdAt: new Date(),
  ...overrides,
});

export const menuItemFactory = (overrides = {}) => ({
  id: 'item_1',
  name: 'Cheeseburger',
  price: new Decimal(15.5),
  isAvailable: true,
  categoryId: 'cat_1',
  ...overrides,
});

export const ingredientFactory = (overrides = {}) => ({
  id: 'ing_1',
  name: 'Beef Patty',
  currentStock: new Decimal(50),
  minThreshold: new Decimal(10),
  unit: 'PIECE',
  ...overrides,
});
