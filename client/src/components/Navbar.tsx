import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'

export function Navbar() {
  const count = useCartStore((s) => s.count())
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-indigo-600">🛒 Shop</Link>
        <div className="flex gap-6 items-center">
          <Link to="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
          <Link to="/cart" className="relative text-gray-600 hover:text-indigo-600">
            🛍️ Cart
            {count > 0 && <span className="absolute -top-2 -right-4 bg-indigo-600 text-white text-xs rounded-full px-1.5 py-0.5">{count}</span>}
          </Link>
        </div>
      </div>
    </nav>
  )
}