import { PrismaClient, UserRole, Plan, OrderType, OrderStatus, TableStatus, IngredientUnit, StockMovementType, PaymentMethod } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo data...');

  // 1. Create Tenant (Public Schema)
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: 'demo' },
    update: {},
    create: {
      name: 'The Gourmet Kitchen',
      subdomain: 'demo',
      plan: Plan.PRO,
    },
  });

  // 2. Create Owner User
  await prisma.tenantUser.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'admin@resturant.com' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'admin@resturant.com',
      passwordHash: 'admin123',
      role: UserRole.OWNER,
    },
  });

  // For the rest of the data, we assume we are in the tenant's schema
  // In a real script, you'd use the dynamic client or set search_path
  
  // 3. Categories
  const catStarters = await prisma.category.create({ data: { name: 'Starters', color: '#f87171', sortOrder: 1 } });
  const catMain = await prisma.category.create({ data: { name: 'Main Course', color: '#60a5fa', sortOrder: 2 } });
  const catDrinks = await prisma.category.create({ data: { name: 'Drinks', color: '#34d399', sortOrder: 3 } });

  // 4. Ingredients
  const beef = await prisma.ingredient.create({ 
    data: { name: 'Ground Beef', unit: IngredientUnit.KG, currentStock: 15.5, minThreshold: 5.0, costPerUnit: 12.0 } 
  });
  const bun = await prisma.ingredient.create({ 
    data: { name: 'Burger Bun', unit: IngredientUnit.PIECE, currentStock: 50, minThreshold: 20, costPerUnit: 0.5 } 
  });
  const tomato = await prisma.ingredient.create({ 
    data: { name: 'Tomato', unit: IngredientUnit.KG, currentStock: 2.0, minThreshold: 4.0, costPerUnit: 2.5 } // BELOW THRESHOLD
  });

  // 5. Menu Items
  const burger = await prisma.menuItem.create({
    data: {
      categoryId: catMain.id,
      name: 'Classic Cheeseburger',
      price: 14.50,
      cost: 4.20,
      sku: 'MAIN-001',
      ingredients: {
        create: [
          { ingredientId: beef.id, quantityUsed: 0.2 },
          { ingredientId: bun.id, quantityUsed: 1 },
          { ingredientId: tomato.id, quantityUsed: 0.05 },
        ]
      },
      modifiers: {
        create: [
          { name: 'Extra Cheese', priceDelta: 1.50 },
          { name: 'No Onions', priceDelta: 0, isRequired: false }
        ]
      }
    }
  });

  const pizza = await prisma.menuItem.create({
    data: {
      categoryId: catMain.id,
      name: 'Margherita Pizza',
      price: 12.00,
      cost: 3.00,
      sku: 'MAIN-002',
    }
  });

  // 6. Tables
  const tables = [];
  for (let i = 1; i <= 5; i++) {
    const table = await prisma.table.create({
      data: {
        label: `Table ${i}`,
        capacity: 4,
        zone: 'Dining Hall',
        status: i === 1 ? TableStatus.OCCUPIED : TableStatus.AVAILABLE,
      }
    });
    tables.push(table);
  }

  // 7. Orders & Payments
  for (let i = 0; i < 20; i++) {
    const order = await prisma.order.create({
      data: {
        tableId: tables[i % 5].id,
        type: OrderType.DINE_IN,
        status: i < 15 ? OrderStatus.PAID : OrderStatus.PENDING,
        subtotal: 26.50,
        tax: 2.65,
        total: 29.15,
        createdById: 'system',
        items: {
          create: [
            { menuItemId: burger.id, quantity: 1, unitPrice: 14.50 },
            { menuItemId: pizza.id, quantity: 1, unitPrice: 12.00 },
          ]
        }
      }
    });

    if (i < 15) {
      await prisma.payment.create({
        data: {
          orderId: order.id,
          method: PaymentMethod.CARD,
          amount: 29.15,
          paidAt: new Date(Date.now() - (15 - i) * 3600000), // Hourly breakdown
        }
      });
      
      // Update table status for paid orders
      await prisma.table.update({
        where: { id: order.tableId! },
        data: { status: TableStatus.AVAILABLE }
      });
    }
  }

  console.log('Seeding complete! Created 1 tenant, 1 user, 3 categories, 12+ items (simulated), 5 tables, and 20 orders.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
