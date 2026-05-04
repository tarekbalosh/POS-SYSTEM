import { render, screen, fireEvent } from '@testing-library/react';
import { CartPanel } from '@/components/pos/CartPanel';
import { useCartStore } from '@/lib/stores/cartStore';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@/lib/stores/cartStore');

describe('CartPanel', () => {
  const mockStore = {
    items: [],
    getSubtotal: () => 0,
    getTaxAmount: () => 0,
    getTotal: () => 0,
    removeItem: vi.fn(),
    updateQty: vi.fn(),
    clearCart: vi.fn(),
  };

  beforeEach(() => {
    (useCartStore as any).mockReturnValue(mockStore);
  });

  it('renders empty state when no items', () => {
    render(<CartPanel />);
    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  it('renders items when present', () => {
    (useCartStore as any).mockReturnValue({
      ...mockStore,
      items: [{ id: '1', name: 'Burger', price: 10, quantity: 1 }],
      getSubtotal: () => 10,
      getTotal: () => 11,
    });

    render(<CartPanel />);
    expect(screen.getByText('Burger')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
  });
});
