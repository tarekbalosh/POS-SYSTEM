import { test, expect } from '@playwright/test';

test.describe('POS System Functionality Test', () => {
  test('should add items to cart and calculate correct total', async ({ page }) => {
    // 1. Navigate to POS page
    await page.goto('http://localhost:3000/pos');
    
    // 2. Verify empty state
    await expect(page.getByText('Cart is Empty')).toBeVisible();
    
    // 3. Add Classic Burger
    await page.click('text=Classic Burger');
    await expect(page.getByText('Added Classic Burger')).toBeVisible();
    
    // 4. Add Fries
    await page.click('text=Fries');
    
    // 5. Verify cart items
    await expect(page.locator('section').getByText('Classic Burger')).toBeVisible();
    await expect(page.locator('section').getByText('Fries')).toBeVisible();
    
    // 6. Increase Fries quantity
    const friesRow = page.locator('section div').filter({ hasText: 'Fries' });
    await friesRow.getByRole('button').nth(1).click(); // Click Plus
    
    // 7. Check subtotal calculation
    // Burger (12.99) + 2x Fries (4.50 * 2 = 9.00) = 21.99
    await expect(page.getByText('$21.99')).toBeVisible();
    
    // 8. Test Sync Data button
    await page.click('button:has-text("Sync Data")');
    await expect(page.getByText('Data synchronized successfully')).toBeVisible();
    
    // 9. Complete Order
    await page.click('button:has-text("Complete Order")');
    await expect(page.getByText('Order completed and paid!')).toBeVisible();
    
    // 10. Verify cart is cleared
    await expect(page.getByText('Cart is Empty')).toBeVisible();
  });
});
