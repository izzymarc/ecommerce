import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-xl">🛍️</span>
              </div>
              <span className="text-xl font-bold text-white">ShopSphere</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">Commerce, Perfected. The smarter way to shop online.</p>
            <div className="flex gap-3">
              {['📘', '🐦', '📷', '▶️'].map((icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors text-sm">{icon}</a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop?category=electronics" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link to="/shop?category=sports" className="hover:text-white transition-colors">Sports</Link></li>
              <li><Link to="/shop?category=home" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop?category=accessories" className="hover:text-white transition-colors">Accessories</Link></li>
              <li><Link to="/shop?sort=bestseller" className="hover:text-white transition-colors">Bestsellers</Link></li>
              <li><Link to="/shop?sort=newest" className="hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/account" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link to="/account/addresses" className="hover:text-white transition-colors">Addresses</Link></li>
              <li><Link to="/account/payments" className="hover:text-white transition-colors">Payment Methods</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white font-semibold mb-4">Help</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Customer Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">📧 support@shopsphere.com</li>
              <li className="flex items-center gap-2">📞 (555) 0123-4567</li>
              <li className="flex items-center gap-2">💬 Live Chat (24/7)</li>
              <li className="text-gray-500 mt-2">Mon-Fri: 9AM - 8PM EST</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 ShopSphere. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
          <p>🔒 Secure payments with SSL encryption</p>
        </div>
      </div>
    </footer>
  )
}