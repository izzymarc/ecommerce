import { useState } from 'react'
import { useCartStore } from '../store/cartStore'

const PRODUCTS = [
  { id: '1', name: 'Wireless Headphones', price: 79.99, image: '🎧', category: 'Electronics', stock: 25 },
  { id: '2', name: 'Mechanical Keyboard', price: 129.99, image: '⌨️', category: 'Electronics', stock: 15 },
  { id: '3', name: 'Running Shoes', price: 89.99, image: '👟', category: 'Sports', stock: 40 },
  { id: '4', name: 'Coffee Maker', price: 49.99, image: '☕', category: 'Home', stock: 30 },
  { id: '5', name: 'Backpack', price: 59.99, image: '🎒', category: 'Accessories', stock: 20 },
  { id: '6', name: 'Smart Watch', price: 199.99, image: '⌚', category: 'Electronics', stock: 10 },
  { id: '7', name: 'Yoga Mat', price: 29.99, image: '🧘', category: 'Sports', stock: 50 },
  { id: '8', name: 'Desk Lamp', price: 39.99, image: '💡', category: 'Home', stock: 35 },
]

export function Home() {
  const addItem = useCartStore((s) => s.addItem)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const categories = ['All', ...new Set(PRODUCTS.map((p) => p.category))]
  const filtered = PRODUCTS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCat = category === 'All' || p.category === category
    return matchesSearch && matchesCat
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">🛒 E-Commerce Platform</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="text" placeholder="Search products..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg transition-colors ${category === cat ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}
            >{cat}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
            <div className="text-6xl text-center mb-4">{product.image}</div>
            <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
            <p className="text-gray-500 text-sm mb-2">{product.category}</p>
            <p className="text-2xl font-bold text-indigo-600 mb-4">${product.price}</p>
            <p className="text-gray-400 text-sm mb-4">{product.stock} in stock</p>
            <button
              onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image })}
              className="mt-auto w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  )
}