import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'

export function Checkout() {
  const { total } = useCartStore()
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="text-center py-20">
        <div className="text-8xl mb-6">✅</div>
        <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>
        <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
        <p className="text-2xl font-bold text-green-600 mb-8">Total: ${total().toFixed(2)}</p>
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-md mx-auto text-left space-y-2">
          <p className="text-gray-500">Order #ORD-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
          <p className="text-gray-500">Shipping: 3-5 business days</p>
          <p className="text-gray-500">Payment: Stripe (simulated)</p>
        </div>
        <Link to="/" className="inline-block mt-8 text-indigo-600 hover:underline">← Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">💳 Checkout</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="john@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input type="text" className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="123 Main St" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><input type="text" className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label><input type="text" className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
        </div>
        <div className="pt-4 border-t">
          <p className="text-gray-600 mb-2">💳 Card: •••• 4242 (Stripe Test Mode)</p>
        </div>
        <div className="flex justify-between items-center pt-4">
          <div><span className="text-gray-600">Total: </span><span className="text-3xl font-bold text-indigo-600">${total().toFixed(2)}</span></div>
          <button onClick={() => setSubmitted(true)} className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">Place Order →</button>
        </div>
      </div>
    </div>
  )
}