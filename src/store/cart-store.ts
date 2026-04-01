import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  updateSize: (productId: string, oldSize: string, color: string, newSize: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => 
               item.product._id === newItem.product._id && 
               item.size === newItem.size && 
               item.color === newItem.color
          );

          if (existingItemIndex >= 0) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          }
          return { items: [...state.items, newItem] };
        }),
      removeItem: (productId, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product._id === productId && item.size === size && item.color === color)
          ),
        })),
      updateQuantity: (productId, size, color, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product._id === productId && item.size === size && item.color === color
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),
      updateSize: (productId, oldSize, color, newSize) =>
        set((state) => {
          const itemIndex = state.items.findIndex(
            (item) => item.product._id === productId && item.size === oldSize && item.color === color
          );
          
          if (itemIndex === -1) return state;
          
          const itemToUpdate = state.items[itemIndex];
          
          // Check if an item with the new size already exists
          const existingItemIndex = state.items.findIndex(
            (item) => item.product._id === productId && item.size === newSize && item.color === color
          );
          
          if (existingItemIndex !== -1 && existingItemIndex !== itemIndex) {
            // Merge into existing item
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += itemToUpdate.quantity;
            // Remove the old item
            updatedItems.splice(itemIndex, 1);
            return { items: updatedItems };
          }
          
          // Just update the size in place
          const updatedItems = [...state.items];
          updatedItems[itemIndex] = { ...itemToUpdate, size: newSize };
          return { items: updatedItems };
        }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'avren-cart',
    }
  )
);
