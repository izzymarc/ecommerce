import { create } from 'zustand'

export interface CartItem {
  id: string
  productId?: string
  name: string
  price: number
  quantity: number
  image: string
  selectedVariant?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  total: () => number
  count: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => {
    const existing = state.items.find((i) => i.id === item.id)
    if (existing) {
      return { items: state.items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) }
    }
    return { items: [...state.items, { ...item, quantity: 1 }] }
  }),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  updateQuantity: (id, quantity) => set((state) => {
    if (quantity <= 0) return { items: state.items.filter((i) => i.id !== id) }
    return { items: state.items.map((i) => i.id === id ? { ...i, quantity } : i) }
  }),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}))