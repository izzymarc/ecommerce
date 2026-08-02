import { Link } from 'react-router-dom'

export function Account() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold">
              JD
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-4">John Doe</h2>
            <p className="text-sm text-gray-500">john@example.com</p>
            <button className="mt-4 text-sm text-indigo-600 font-medium hover:underline">Edit Profile</button>
          </div>
          {/* Nav */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {[
              { label: 'My Orders', href: '/orders', icon: '📦' },
              { label: 'Wishlist', href: '/wishlist', icon: '❤️' },
              { label: 'Addresses', href: '#', icon: '📍' },
              { label: 'Payment Methods', href: '#', icon: '💳' },
              { label: 'Settings', href: '#', icon: '⚙️' },
              { label: 'Sign Out', href: '#', icon: '🚪' },
            ].map((item) => (
              <Link key={item.label} to={item.href} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors text-sm">
                <span>{item.icon}</span>
                <span className="text-gray-700">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Summary */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Orders', value: '3', icon: '📦' },
              { label: 'Wishlist Items', value: '3', icon: '❤️' },
              { label: 'Store Credit', value: '$0.00', icon: '💰' },
              { label: 'Reward Points', value: '250', icon: '⭐' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-4">
                <span className="text-3xl">{stat.icon}</span>
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { text: 'Order #SP-A8X2K was delivered', time: '3 days ago', icon: '📦' },
                { text: 'Added UltraBoost Shoes to wishlist', time: '1 week ago', icon: '❤️' },
                { text: 'Account created', time: '1 month ago', icon: '🎉' },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span>{a.icon}</span>
                  <span className="text-gray-700">{a.text}</span>
                  <span className="text-gray-400 ml-auto text-xs">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}