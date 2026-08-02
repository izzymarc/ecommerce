import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCTS } from '../data/products'
import { useCartStore } from '../store/cartStore'

export function Wishlist() {
  const addItem = useCartStore((s) => s.addItem)
  const [wishlistIds, setWishlistIds] = useState<string[]>(['p1', 'p3', 'p6'])
  const wishlist = PRODUCTS.filter((p) => wishlistIds.includes(p.id))

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <span className="text-6xl">🤍</span>
        <h1 className="text-3xl font-bold text-gray-800 mt-6">Your Wishlist is Empty</h1>
        <p className="text-gray-500 mt-2">Save items you love for later.</p>
        <Link to="/" className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist ({wishlist.length})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
            <Link to={`/product/${product.slug}`}>
              <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <span className="text-6xl hover:scale-110 transition-transform">{product.image}</span>
              </div>
            </Link>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 text-sm">{product.name}</h3>
              <p className="text-lg font-bold mt-1">${product.price.toFixed(2)}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => addItem({ id: `${product.id}-wish`, productId: product.id, name: product.name, price: product.price, image: product.image })} className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">Add to Cart</button>
                <button onClick={() => setWishlistIds(wishlistIds.filter((id) => id !== product.id))} className="px-3 py-2 border border-gray-200 text-sm rounded-lg hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}