import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useState, useEffect, useRef } from 'react'
import { CATEGORIES } from '../data/products'

export function Navbar() {
  const count = useCartStore((s) => s.count())
  const items = useCartStore((s) => s.items)
  const [scrolled, setScrolled] = useState(false)
  const [showMiniCart, setShowMiniCart] = useState(false)
  const [showMegaMenu, setShowMegaMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const megaMenuRef = useRef<HTMLDivElement>(null)
  const miniCartRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setShowMegaMenu(false)
      }
      if (miniCartRef.current && !miniCartRef.current.contains(e.target as Node)) {
        setShowMiniCart(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white shadow-sm'
    }`}>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs py-1.5 px-4 text-center">
        <span className="font-medium">🚚 Free shipping on orders over $50</span>
        <span className="mx-3">|</span>
        <span>30-day easy returns</span>
        <span className="mx-3">|</span>
        <span className="cursor-pointer hover:underline">📞 (555) 0123-4567</span>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <span className="text-2xl">🛍️</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ShopSphere
              </span>
              <span className="text-xs text-gray-500 -mt-1">Commerce, Perfected</span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, brands, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors">
                Search
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-5 shrink-0">
            {/* Account */}
            <Link to="/account" className="hidden lg:flex flex-col items-center text-gray-700 hover:text-indigo-600 transition-colors group">
              <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs mt-0.5">Account</span>
            </Link>

            {/* Orders */}
            <Link to="/orders" className="hidden lg:flex flex-col items-center text-gray-700 hover:text-indigo-600 transition-colors group">
              <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="text-xs mt-0.5">Orders</span>
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="hidden lg:flex flex-col items-center text-gray-700 hover:text-rose-600 transition-colors group">
              <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-xs mt-0.5">Wishlist</span>
            </Link>

            {/* Cart with Mini Cart */}
            <div className="relative" ref={miniCartRef}>
              <button
                onClick={() => setShowMiniCart(!showMiniCart)}
                className="flex flex-col items-center text-gray-700 hover:text-indigo-600 transition-colors group"
              >
                <div className="relative">
                  <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {count > 0 && (
                    <span className="absolute -top-2 -right-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
                      {count}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-0.5">Cart</span>
              </button>

              {/* Mini Cart Dropdown */}
              {showMiniCart && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 animate-fadeIn">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-800">Cart ({count} items)</h3>
                      <button onClick={() => setShowMiniCart(false)} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {items.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        <span className="text-3xl">🛒</span>
                        <p className="text-sm mt-2">Your cart is empty</p>
                      </div>
                    ) : (
                      <>
                        <div className="max-h-60 overflow-y-auto space-y-3">
                          {items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                              <span className="text-2xl">{item.image}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span>Qty: {item.quantity}</span>
                                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {items.length > 3 && (
                          <p className="text-xs text-gray-500 text-center mt-2">+{items.length - 3} more items</p>
                        )}
                        <Link
                          to="/cart"
                          onClick={() => setShowMiniCart(false)}
                          className="block w-full text-center mt-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
                        >
                          View Cart
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-indigo-600"
              onClick={() => setShowMegaMenu(!showMegaMenu)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMegaMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mega Menu / Desktop Nav */}
      <div className="border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            <div className="relative" ref={megaMenuRef}>
              <button
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap"
                onMouseEnter={() => setShowMegaMenu(true)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                All Categories
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Mega Menu Panel */}
              {showMegaMenu && (
                <div
                  className="absolute left-0 top-full w-[600px] bg-white rounded-b-xl shadow-2xl border border-gray-100 p-6 z-40 animate-fadeIn"
                  onMouseLeave={() => setShowMegaMenu(false)}
                >
                  <div className="grid grid-cols-3 gap-6">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/shop?category=${cat.slug}`}
                        onClick={() => setShowMegaMenu(false)}
                        className="group"
                      >
                        <p className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                          <span className="text-lg">{cat.icon}</span>
                          {cat.name}
                        </p>
                        {cat.subcategories && (
                          <div className="mt-2 space-y-1">
                            {cat.subcategories.map((sub) => (
                              <Link
                                key={sub.id}
                                to={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                                onClick={(e) => e.stopPropagation()}
                                className="block text-xs text-gray-500 hover:text-indigo-600 transition-colors ml-7"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/shop?tag=sale" className="px-4 py-2.5 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors whitespace-nowrap">
              🔥 Deals
            </Link>
            <Link to="/shop?sort=bestseller" className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap">
              Bestsellers
            </Link>
            <Link to="/shop?sort=newest" className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap">
              New Arrivals
            </Link>
            <Link to="/shop?category=electronics" className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap">
              Electronics
            </Link>
            <Link to="/shop?category=sports" className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap">
              Sports
            </Link>
            <Link to="/shop?category=home" className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap">
              Home
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}