import { test, expect } from '@playwright/test';

test.describe('POS Checkout Flow', () => {
  test('should complete a full checkout successfully', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'owner@demo.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // 2. Navigate to POS
    await page.waitForURL('/dashboard');
    await page.goto('/pos');

    // 3. Add item to cart
    await page.click('text=Cheeseburger');
    await expect(page.locator('text=Current Order')).toContainText('Cheeseburger');

    // 4. Checkout
    await page.click('button:has-text("Checkout")');
    await page.waitForURL('/pos/checkout');

    // 5. Payment
    await page.click('text=CASH');
    await page.click('text="100"'); // Click numpad
    await page.click('button:has-text("Confirm Payment")');

    // 6. Success
    await expect(page).toHaveURL(/\/pos\/receipt\/.*/);
    await expect(page.locator('h1')).toContainText('Payment Successful');
  });
});
