import { create } from 'zustand';

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  notes?: string;
}

interface Discount {
  type: 'percent' | 'fixed';
  value: number;
}

interface CartStore {
  items: CartItem[];
  discount: Discount;
  tableId: string | null;
  orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  
  // Actions
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  updateNotes: (id: string, notes: string) => void;
  setDiscount: (discount: Discount) => void;
  setTable: (id: string | null) => void;
  setOrderType: (type: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY') => void;
  clearCart: () => void;
  
  // Computed (Getters)
  getSubtotal: () => number;
  getTaxAmount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  discount: { type: 'fixed', value: 0 },
  tableId: null,
  orderType: 'DINE_IN',

  addItem: (item) => set((state) => {
    const existing = state.items.find((i) => i.menuItemId === item.id);
    if (existing) {
      return {
        items: state.items.map((i) =>
          i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    return {
      items: [...state.items, {
        id: Math.random().toString(36).substr(2, 9),
        menuItemId: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: 1,
        image: item.image,
      }],
    };
  }),

  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),

  updateQty: (id, qty) => set((state) => ({
    items: state.items.map((i) =>
      i.id === id ? { ...i, quantity: Math.max(1, qty) } : i
    ),
  })),

  updateNotes: (id, notes) => set((state) => ({
    items: state.items.map((i) => i.id === id ? { ...i, notes } : i),
  })),

  setDiscount: (discount) => set({ discount }),
  setTable: (tableId) => set({ tableId }),
  setOrderType: (orderType) => set({ orderType }),
  clearCart: () => set({ items: [], discount: { type: 'fixed', value: 0 }, tableId: null }),

  getSubtotal: () => {
    return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  },

  getTaxAmount: () => {
    return get().getSubtotal() * 0.1; // 10% tax
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const tax = get().getTaxAmount();
    const disc = get().discount;
    const discountAmount = disc.type === 'percent' ? (subtotal * disc.value) / 100 : disc.value;
    return subtotal + tax - discountAmount;
  },
}));
