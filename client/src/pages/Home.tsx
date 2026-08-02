import { useState } from 'react'
import { useCartStore } from '../store/cartStore'

const PRODUCTS = [
  { id: '1', name: 'Wireless Headphones', price: 79.99, image: '🎧', category: 'Electronics', stock: 25, rating: 4.5 },
  { id: '2', name: 'Mechanical Keyboard', price: 129.99, image: '⌨️', category: 'Electronics', stock: 15, rating: 4.8 },
  { id: '3', name: 'Running Shoes', price: 89.99, image: '👟', category: 'Sports', stock: 40, rating: 4.6 },
  { id: '4', name: 'Coffee Maker', price: 49.99, image: '☕', category: 'Home', stock: 30, rating: 4.3 },
  { id: '5', name: 'Backpack', price: 59.99, image: '🎒', category: 'Accessories', stock: 20, rating: 4.7 },
  { id: '6', name: 'Smart Watch', price: 199.99, image: '⌚', category: 'Electronics', stock: 10, rating: 4.9 },
  { id: '7', name: 'Yoga Mat', price: 29.99, image: '🧘', category: 'Sports', stock: 50, rating: 4.4 },
  { id: '8', name: 'Desk Lamp', price: 39.99, image: '💡', category: 'Home', stock: 35, rating: 4.2 },
]

export function Home() {
  const addItem = useCartStore((s) => s.addItem)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [addedToCart, setAddedToCart] = useState<string | null>(null)

  const categories = ['All', ...new Set(PRODUCTS.map((p) => p.category))]
  const filtered = PRODUCTS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCat = category === 'All' || p.category === category
    return matchesSearch && matchesCat
  })

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image })
    setAddedToCart(product.id)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
              Welcome to ShopSphere
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8">
              Discover amazing products at unbeatable prices
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                Shop Now
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-300 pl-14"
              />
              <svg
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-3 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  category === cat
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
            >
              {/* Product Image */}
              <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 p-12 flex items-center justify-center overflow-hidden">
                <div className="text-8xl transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  {product.image}
                </div>
                {product.stock < 15 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Low Stock
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ${product.price}
                  </span>
                  <span className="text-sm text-gray-500">{product.stock} in stock</span>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    addedToCart === product.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-200'
                  }`}
                >
                  {addedToCart === product.id ? '✓ Added!' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
