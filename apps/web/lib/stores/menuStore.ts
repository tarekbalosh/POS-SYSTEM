import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'BURGER' | 'SHAWARMA' | 'RICE' | 'DRINK';
  image: string;
}

interface MenuStore {
  menuItems: MenuItem[];
  addItem: (item: Omit<MenuItem, 'id'>) => void;
  updateItem: (id: string, item: Partial<MenuItem>) => void;
  deleteItem: (id: string) => void;
}

export const useMenuStore = create<MenuStore>()(
  persist(
    (set) => ({
      menuItems: [
        { id: '1', name: 'Classic Burger', price: 12.99, category: 'BURGER', image: '/images/classic_burger_pos_1777879237778.png' },
        { id: '2', name: 'Double Cheese', price: 15.50, category: 'BURGER', image: '/images/double_cheese_pos_1777879257356.png' },
        { id: '3', name: 'Veggie Burger', price: 11.00, category: 'BURGER', image: '/images/veggie_burger_pos_1777879273042.png' },
        { id: '7', name: 'Chicken Shawarma', price: 8.50, category: 'SHAWARMA', image: '/images/chicken_shawarma_pos_1777879651330.png' },
        { id: '8', name: 'Beef Shawarma', price: 9.50, category: 'SHAWARMA', image: '/images/beef_shawarma_pos_1777879668099.png' },
        { id: '9', name: 'Lamb Mandy', price: 18.00, category: 'RICE', image: '/images/lamb_mandy_pos_1777879683739.png' },
        { id: '10', name: 'Chicken Kabsa', price: 16.50, category: 'RICE', image: '/images/chicken_kabsa_pos_1777879700010.png' },
        { id: '4', name: 'Fries', price: 4.50, category: 'BURGER', image: '/images/crispy_fries_pos_1777879287179.png' },
        { id: '5', name: 'Coke', price: 2.50, category: 'DRINK', image: '/images/cold_coke_pos_1777879304659.png' },
        { id: '6', name: 'Onion Rings', price: 5.00, category: 'BURGER', image: '/images/onion_rings_pos_1777879321493.png' },
      ],
      addItem: (item) => set((state) => ({
        menuItems: [...state.menuItems, { ...item, id: Math.random().toString(36).substr(2, 9) }]
      })),
      updateItem: (id, updatedItem) => set((state) => ({
        menuItems: state.menuItems.map((item) => item.id === id ? { ...item, ...updatedItem } : item)
      })),
      deleteItem: (id) => set((state) => ({
        menuItems: state.menuItems.filter((item) => item.id !== id)
      })),
    }),
    {
      name: 'menu-storage',
    }
  )
);
