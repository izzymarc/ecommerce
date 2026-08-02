import { Link } from 'react-router-dom'

const SAMPLE_ORDERS = [
  { id: 'SP-A8X2K', date: '2026-07-28', status: 'delivered' as const, total: 529.98, items: [{ name: 'Wireless NC Headphones Pro', price: 299.99, qty: 1, image: '🎧' }, { name: 'Bluetooth Speaker Boom', price: 49.99, qty: 1, image: '🔊' }], tracking: '1Z999AA10123456784', estimatedDelivery: 'Jul 31, 2026' },
  { id: 'SP-B3Y7L', date: '2026-07-15', status: 'shipped' as const, total: 179.99, items: [{ name: 'UltraBoost Running Shoes', price: 179.99, qty: 1, image: '👟' }], tracking: '1Z999AA10123456785', estimatedDelivery: 'Jul 18, 2026' },
  { id: 'SP-C6W9M', date: '2026-06-20', status: 'delivered' as const, total: 239.98, items: [{ name: 'Mechanical Keyboard RGB', price: 149.99, qty: 1, image: '⌨️' }, { name: 'LED Desk Lamp', price: 89.99, qty: 1, image: '💡' }], tracking: '1Z999AA10123456786', estimatedDelivery: 'Jun 25, 2026' },
]

const statusConfig = {
  processing: { color: 'bg-blue-100 text-blue-700', label: 'Processing' },
  shipped: { color: 'bg-amber-100 text-amber-700', label: 'Shipped' },
  out_for_delivery: { color: 'bg-purple-100 text-purple-700', label: 'Out for Delivery' },
  delivered: { color: 'bg-emerald-100 text-emerald-700', label: 'Delivered' },
  cancelled: { color: 'bg-rose-100 text-rose-700', label: 'Cancelled' },
  returned: { color: 'bg-gray-100 text-gray-700', label: 'Returned' },
}

export function Orders() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      {SAMPLE_ORDERS.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-6xl">📦</span>
          <h2 className="text-xl font-bold text-gray-800 mt-4">No Orders Yet</h2>
          <p className="text-gray-500 mt-2">When you place an order, it will appear here.</p>
          <Link to="/" className="inline-block mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {SAMPLE_ORDERS.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order #{order.id}</p>
                    <p className="text-xs text-gray-400">{order.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig[order.status].color}`}>
                    {statusConfig[order.status].label}
                  </span>
                </div>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-3xl">{item.image}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.qty} × ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Total: <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span></p>
                    {order.tracking && <p className="text-xs text-indigo-600 mt-1">Tracking: {order.tracking}</p>}
                    <p className="text-xs text-gray-400">Est. delivery: {order.estimatedDelivery}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">Track</button>
                    <button className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Details</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}