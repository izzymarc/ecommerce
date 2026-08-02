import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'

type Step = 'shipping' | 'payment' | 'review'

export function Checkout() {
  const { items, total, count } = useCartStore()
  const [step, setStep] = useState<Step>('shipping')
  const [orderPlaced, setOrderPlaced] = useState(false)

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <span className="text-6xl">🛒</span>
        <h1 className="text-3xl font-bold text-gray-800 mt-6">Nothing to Checkout</h1>
        <p className="text-gray-500 mt-2">Your cart is empty.</p>
        <Link to="/" className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">Start Shopping</Link>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <span className="text-8xl">🎉</span>
        <h1 className="text-3xl font-bold text-gray-800 mt-6">Order Confirmed!</h1>
        <p className="text-gray-500 mt-2">Thank you for your purchase!</p>
        <p className="text-gray-500">Order #SP-{Date.now().toString(36).toUpperCase()} — Est. delivery in 3-5 business days</p>
        <div className="flex gap-4 justify-center mt-8">
          <Link to="/orders" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">View Orders</Link>
          <Link to="/" className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  const subtotal = total()
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const grandTotal = subtotal + shipping + tax

  const steps: { key: Step; label: string }[] = [
    { key: 'shipping', label: 'Shipping' },
    { key: 'payment', label: 'Payment' },
    { key: 'review', label: 'Review' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div className={`flex items-center gap-2 ${step === s.key ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === s.key ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i + 1}
              </div>
              <span className="font-medium text-sm">{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className="w-16 h-0.5 bg-gray-200 mx-4" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 'shipping' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="John Doe" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="123 Main St" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="New York" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="NY" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="10001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="(555) 000-0000" />
                </div>
              </div>
              <button onClick={() => setStep('payment')} className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                Continue to Payment →
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-4">
                {[
                  { icon: '💳', label: 'Credit / Debit Card', description: 'Visa, Mastercard, Amex' },
                  { icon: '🏦', label: 'Bank Transfer', description: 'Direct bank payment' },
                  { icon: '🍎', label: 'Apple Pay', description: 'Fast & secure' },
                  { icon: '📱', label: 'Google Pay', description: 'Fast & secure' },
                ].map((method) => (
                  <label key={method.label} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors">
                    <input type="radio" name="payment" className="w-4 h-4 text-indigo-600" defaultChecked={method.label === 'Credit / Debit Card'} />
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="font-medium text-gray-800">{method.label}</p>
                      <p className="text-xs text-gray-500">{method.description}</p>
                    </div>
                  </label>
                ))}
              </div>
              {true && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                    <input className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="123" />
                  </div>
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep('shipping')} className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors">← Back</button>
                <button onClick={() => setStep('review')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">Review Order →</button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Review Your Order</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2">
                    <span className="text-3xl">{item.image}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep('payment')} className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors">← Back</button>
                <button onClick={() => setOrderPlaced(true)} className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl">
                  🔒 Place Order — ${grandTotal.toFixed(2)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
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
                <span className={shipping === 0 ? 'text-emerald-600' : ''}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}