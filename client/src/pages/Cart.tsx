import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'

export function Cart() {
  const { items, removeItem, updateQuantity, total, count } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/" className="text-indigo-600 hover:underline">← Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">🛍️ Shopping Cart ({count()} items)</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-0">
            <span className="text-4xl">{item.image}</span>
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-indigo-600 font-bold">${item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded border hover:bg-gray-100">−</button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded border hover:bg-gray-100">+</button>
            </div>
            <p className="font-bold text-lg w-24 text-right">${(item.price * item.quantity).toFixed(2)}</p>
            <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 ml-4">✕</button>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center bg-white rounded-xl shadow-sm p-6">
        <div><span className="text-gray-600">Total: </span><span className="text-3xl font-bold text-indigo-600">${total().toFixed(2)}</span></div>
        <Link to="/checkout" className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">Proceed to Checkout →</Link>
      </div>
    </div>
  )
}