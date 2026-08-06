import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { HeroCarousel } from '../components/HeroCarousel'
import { ProductImage } from '../components/ProductImage'
import { PRODUCTS, CATEGORIES, BANNERS, FLASH_DEALS } from '../data/products'
import type { Product } from '../types'

function FlashDealTimer({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState('')

  const calc = useCallback(() => {
    const diff = new Date(endsAt).getTime() - Date.now()
    if (diff <= 0) { setTimeLeft('Expired'); return }
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    setTimeLeft(`${h}h ${m}m ${s}s`)
  }, [endsAt])

  useEffect(() => {
    calc()
    const i = setInterval(calc, 1000)
    return () => clearInterval(i)
  }, [calc])

  return <span className="font-mono text-sm font-bold">{timeLeft}</span>
}

function StarRating({ rating, count, size = 'sm' }: { rating: number; count?: number; size?: 'sm' | 'lg' }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = rating >= i + 1
    const half = rating >= i + 0.5 && rating < i + 1
    return filled ? '★' : half ? '⯨' : '☆'
  })
  return (
    <div className={`flex items-center gap-0.5 ${size === 'lg' ? 'text-base' : 'text-xs'}`}>
      <span className="text-amber-400">{stars.join('')}</span>
      <span className="text-gray-500 ml-1">{rating}</span>
      {count != null && <span className="text-gray-400 ml-1">({count.toLocaleString()})</span>}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem({ id: crypto.randomUUID(), productId: product.id, name: product.name, price: product.price, image: product.image })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300">
      <Link to={`/product/${product.slug}`} className="block relative">
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{discount}%</span>
          )}
          {product.bestseller && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Bestseller</span>
          )}
          {product.newArrival && (
            <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">New</span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 shadow-md"
          onClick={(e) => e.preventDefault()}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Product photograph, with emoji fallback */}
        <div className="h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <ProductImage
            photo={product.photo}
            emoji={product.image}
            alt={product.name}
            preset="card"
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
            emojiClass="text-6xl"
          />
        </div>
      </Link>

      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide mb-1">{product.category}</p>

        {/* Name */}
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2 text-sm mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <StarRating rating={product.rating} count={product.reviewCount} />

        {/* Stock indicator */}
        {product.stock <= product.lowStockThreshold && (
          <p className="text-xs text-rose-500 font-medium mt-1">Only {product.stock} left in stock</p>
        )}

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              added
                ? 'bg-emerald-500 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
            }`}
          >
            {added ? '✓ Added' : '+ Cart'}
          </button>
        </div>

        {/* Free shipping */}
        {product.freeShipping && (
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
            <span>🚚</span> Free Shipping
          </p>
        )}
      </div>
    </div>
  )
}

export function Home() {
  const bestsellers = PRODUCTS.filter((p) => p.bestseller)
  const newArrivals = PRODUCTS.filter((p) => p.newArrival)
  const trending = PRODUCTS.sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4)

  return (
    <div>
      <HeroCarousel banners={BANNERS} />

      {/* ============ Flash Deals ============ */}
      <section className="container mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-800">Flash Deals</h2>
                <p className="text-xs text-gray-500">Limited time offers</p>
              </div>
            </div>
            <Link to="/shop?tag=sale" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {FLASH_DEALS.map((deal) => (
              <Link
                key={deal.id}
                to={`/product/${PRODUCTS.find((p) => p.id === deal.productId)?.slug}`}
                className="group bg-gray-50 rounded-xl p-4 hover:bg-rose-50 hover:shadow-md transition-all"
              >
                <div className="text-4xl text-center mb-3 transform group-hover:scale-110 transition-transform">
                  {deal.image}
                </div>
                <h3 className="text-sm font-medium text-gray-800 truncate">{deal.name}</h3>
                <StarRating rating={PRODUCTS.find((p) => p.id === deal.productId)?.rating || 0} />
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold text-gray-900">${deal.dealPrice.toFixed(2)}</span>
                  <span className="text-xs text-gray-400 line-through">${deal.originalPrice.toFixed(2)}</span>
                  <span className="text-xs text-rose-600 font-bold ml-auto">-{deal.discount}%</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-full h-1.5"
                      style={{ width: `${(deal.sold / deal.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{deal.sold} sold</span>
                    <span className="text-xs text-rose-600 font-medium flex items-center gap-1">
                      ⏱ <FlashDealTimer endsAt={deal.endsAt} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Featured Categories ============ */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
          <p className="text-gray-500 mt-2">Find exactly what you need</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg hover:bg-indigo-50/50 transition-all"
            >
              <span className="text-4xl mb-3 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                {cat.image}
              </span>
              <span className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                {cat.subcategories?.length} subcategories
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ Bestsellers ============ */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Bestsellers</h2>
              <p className="text-gray-500 mt-1">Most popular products</p>
            </div>
            <Link to="/shop?sort=bestseller" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ Trending Now ============ */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Trending Now 🔥</h2>
            <p className="text-gray-500 mt-1">What everyone is buying</p>
          </div>
          <Link to="/shop?sort=rating" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ============ New Arrivals ============ */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">New Arrivals</h2>
              <p className="text-white/70 mt-1">Fresh products just landed</p>
            </div>
            <Link to="/shop?sort=newest" className="text-sm text-white hover:text-white/80 font-medium underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl p-4 group hover:shadow-xl transition-all">
                <Link to={`/product/${product.slug}`}>
                  <div className="h-36 overflow-hidden rounded-xl">
                    <ProductImage
                      photo={product.photo}
                      emoji={product.image}
                      alt={product.name}
                      preset="card"
                      className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                      emojiClass="text-5xl"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mt-2">{product.name}</h3>
                </Link>
                <StarRating rating={product.rating} />
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">New</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Trust Badges ============ */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $50' },
            { icon: '🔄', title: '30-Day Returns', desc: 'Hassle-free returns' },
            { icon: '🔒', title: 'Secure Checkout', desc: 'SSL encrypted payments' },
            { icon: '💬', title: '24/7 Support', desc: 'Live chat & phone' },
          ].map((item) => (
            <div key={item.title} className="text-center p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-semibold text-gray-800 mt-3">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ Newsletter ============ */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <span className="text-4xl">📬</span>
          <h2 className="text-3xl font-bold text-white mt-4">Stay in the Loop</h2>
          <p className="text-gray-400 mt-2 max-w-md mx-auto">
            Subscribe for exclusive deals, new arrivals, and insider tips.
          </p>
          <form className="flex gap-3 max-w-md mx-auto mt-6" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all">
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-3">No spam, unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  )
}