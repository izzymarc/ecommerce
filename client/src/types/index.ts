// ── Product Types ──
export interface Review {
  id: string
  userId: string
  userName: string
  avatar: string
  rating: number
  title: string
  body: string
  date: string
  verified: boolean
  helpful: number
  images?: string[]
}

export interface Variant {
  type: 'size' | 'color' | 'storage' | 'material'
  label: string
  options: string[]
}

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  /** Unsplash photo IDs for real product photography. Falls back to `image` emoji when absent. */
  photo?: string
  photos?: string[]
  category: string
  subcategory?: string
  description: string
  features: string[]
  specs: Record<string, string>
  stock: number
  lowStockThreshold: number
  rating: number
  reviewCount: number
  reviews: Review[]
  variants?: Variant[]
  seller: string
  tags: string[]
  bestseller?: boolean
  newArrival?: boolean
  freeShipping: boolean
  shippingETA: string
}

// ── Cart Types ──
export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  selectedVariant?: string
}

export interface PromoCode {
  code: string
  discount: number // percentage
  type: 'percentage' | 'fixed'
  minimumOrder: number
  expiry: string
}

// ── User & Auth Types ──
export interface Address {
  id: string
  fullName: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  isDefault: boolean
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'applepay' | 'googlepay'
  last4?: string
  brand?: string
  expiry?: string
  isDefault: boolean
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  phone: string
  addresses: Address[]
  paymentMethods: PaymentMethod[]
  wishlist: string[]
  orders: Order[]
}

// ── Order Types ──
export type OrderStatus = 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned'

export interface OrderItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  selectedVariant?: string
}

export interface TrackingEvent {
  date: string
  location: string
  status: string
  description: string
}

export interface Order {
  id: string
  date: string
  status: OrderStatus
  total: number
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  items: OrderItem[]
  shippingAddress: Address
  paymentMethod: string
  trackingNumber?: string
  trackingEvents?: TrackingEvent[]
  estimatedDelivery: string
}

// ── Category Types ──
export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  image: string
  featured: boolean
  subcategories?: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  slug: string
}

// ── Flash Deal Types ──
export interface FlashDeal {
  id: string
  productId: string
  name: string
  image: string
  originalPrice: number
  dealPrice: number
  discount: number
  sold: number
  total: number
  endsAt: string
}

// ── Banner Types ──
export interface Banner {
  id: string
  title: string
  subtitle: string
  cta: string
  ctaLink: string
  image: string
  /** Unsplash photo ID for the hero background image. */
  photo?: string
  /** Short eyebrow label shown above the headline. */
  eyebrow?: string
  bgGradient: string
  textColor: string
}

// ── Navigation Types ──
export interface NavLink {
  label: string
  href: string
  badge?: string
  children?: { label: string; href: string; description?: string }[]
}

// ── Filter Types ──
export interface FilterOption {
  label: string
  value: string
  count: number
}

export interface PriceRange {
  min: number
  max: number
}

export interface Filters {
  categories: string[]
  priceRange: PriceRange
  ratings: number[]
  onSale: boolean
  inStock: boolean
  freeShipping: boolean
  tags: string[]
  sortBy: SortOption
}

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'bestseller'