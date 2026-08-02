import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'

export function Cart() {
  const { items, removeItem, updateQuantity, total, count } = useCartStore()
  const subtotal = total()
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const grandTotal = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <span className="text-6xl">🛒</span>
        <h1 className="text-3xl font-bold text-gray-800 mt-6">Your Cart is Empty</h1>
        <p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
        <Link to="/" className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-500 mt-1">{count()} items in your cart</p>
        </div>
        <Link to="/" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          ← Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 hover:shadow-md transition-all">
              <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-4xl">{item.image}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <Link to={`/product/${item.name.toLowerCase().replace(/\s+/g, '-')}`} className="font-semibold text-gray-800 hover:text-indigo-600">
                      {item.name}
                    </Link>
                    {item.selectedVariant && (
                      <p className="text-xs text-gray-500 mt-0.5">{item.selectedVariant}</p>
                    )}
                  </div>
                  <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)} each</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 text-sm">−</button>
                    <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 text-sm">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-sm text-rose-500 hover:text-rose-700 font-medium">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Promo Code */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter promo code"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                Apply
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Try: SHOP20, SAVE10, FREESHIP</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-28">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({count()} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-emerald-600 font-medium' : ''}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {shipping > 0 && (
                <div className="text-xs text-indigo-600 mt-1">
                  🚚 Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </div>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block w-full text-center mt-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Proceed to Checkout →
            </Link>

            <div className="mt-4 text-center text-xs text-gray-400">
              <p>🔒 Secure checkout with SSL encryption</p>
              <div className="flex justify-center gap-2 mt-2">
                {['💳', '🏦', '🍎', '📱'].map((i, idx) => (
                  <span key={idx} className="text-lg">{i}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}