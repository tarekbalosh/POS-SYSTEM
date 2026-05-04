import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  restaurantName: string;
  email: string;
  address: string;
  currency: string;
  taxRate: number;
  adminUsername: string;
  adminEmail: string;
  
  updateSettings: (settings: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      restaurantName: 'ProPOS Gourmet',
      email: 'manager@propos.com',
      address: '123 Luxury Ave, Dubai, UAE',
      currency: 'USD - US Dollar',
      taxRate: 10,
      adminUsername: 'admin_main',
      adminEmail: 'admin@restaurant.com',
      
      updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
    }),
    {
      name: 'settings-storage',
    }
  )
);
