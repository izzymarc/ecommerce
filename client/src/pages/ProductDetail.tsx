import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { PRODUCTS } from '../data/products'

function StarRating({ rating, count, size = 'sm' }: { rating: number; count?: number; size?: 'sm' | 'lg' }) {
  const stars = Array.from({ length: 5 }, (_, i) => (rating >= i + 1 ? '★' : rating >= i + 0.5 ? '⯨' : '☆'))
  return (
    <div className={`flex items-center gap-0.5 ${size === 'lg' ? 'text-lg' : 'text-xs'}`}>
      <span className="text-amber-400">{stars.join('')}</span>
      <span className="text-gray-500 ml-1">{rating}</span>
      {count != null && <span className="text-gray-400 ml-1">({count.toLocaleString()})</span>}
    </div>
  )
}

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const product = PRODUCTS.find((p) => p.slug === slug)
  const addItem = useCartStore((s) => s.addItem)
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({})
  const [selectedImage, setSelectedImage] = useState(0)
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <span className="text-6xl">🔍</span>
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Product Not Found</h1>
        <p className="text-gray-500 mt-2">The product you're looking for doesn't exist.</p>
        <Link to="/" className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
          Back to Home
        </Link>
      </div>
    )
  }

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0

  const handleAdd = () => {
    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      selectedVariant: Object.values(selectedVariant).join(' / ') || undefined,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category.toLowerCase()}`} className="hover:text-indigo-600">{product.category}</Link>
        {product.subcategory && (
          <>
            <span>/</span>
            <Link to={`/shop?subcategory=${product.subcategory.toLowerCase()}`} className="hover:text-indigo-600">{product.subcategory}</Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-800">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-[10rem] transform hover:scale-105 transition-transform duration-300">
              {product.images[selectedImage]}
            </span>
          </div>
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 rounded-xl flex items-center justify-center transition-all ${
                  i === selectedImage
                    ? 'bg-indigo-100 border-2 border-indigo-500 scale-105'
                    : 'bg-gray-50 border-2 border-transparent hover:border-gray-300'
                }`}
              >
                <span className="text-3xl">{img}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          {/* Badges */}
          <div className="flex gap-2 mb-3">
            {discount > 0 && <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">-{discount}%</span>}
            {product.bestseller && <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">Bestseller</span>}
            {product.newArrival && <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">New Arrival</span>}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-sm text-indigo-600 font-medium mb-4">Sold by {product.seller}</p>

          <StarRating rating={product.rating} count={product.reviewCount} size="lg" />

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-4 mb-6">
            <span className="text-4xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
            {discount > 0 && <span className="text-sm text-rose-600 font-bold">Save ${(product.originalPrice! - product.price).toFixed(2)}</span>}
          </div>

          {/* Stock */}
          {product.stock <= product.lowStockThreshold ? (
            <p className="text-sm text-rose-600 font-medium mb-2">⚠ Only {product.stock} left in stock — order soon</p>
          ) : (
            <p className="text-sm text-emerald-600 font-medium mb-2">✓ In Stock</p>
          )}

          {/* Variants */}
          {product.variants?.map((variant) => (
            <div key={variant.type} className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">{variant.label}</p>
              <div className="flex flex-wrap gap-2">
                {variant.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedVariant((prev) => ({ ...prev, [variant.type]: opt }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      selectedVariant[variant.type] === opt
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-gray-200 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-sm font-medium text-gray-700">Quantity</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50">−</button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50">+</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAdd}
              className={`flex-1 py-3 px-6 rounded-xl text-base font-semibold transition-all ${
                added ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
            <button className="w-12 h-12 border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-rose-400 hover:text-rose-500 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Shipping */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <p className="flex items-center gap-2 text-gray-600">
              <span>🚚</span> {product.freeShipping ? <span className="text-emerald-600 font-medium">Free Shipping</span> : 'Shipping calculated at checkout'}
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <span>📦</span> Estimated delivery: <span className="font-medium">{product.shippingETA}</span>
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <span>🔄</span> 30-day easy returns
            </p>
          </div>
        </div>
      </div>

      {/* Tabs: Description / Specs / Reviews */}
      <div className="mt-16">
        <div className="flex border-b gap-0">
          {(['description', 'specs', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-all border-b-2 -mb-[1px] ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'description' ? 'Description' : tab === 'specs' ? 'Specifications' : `Reviews (${product.reviewCount})`}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="max-w-3xl">
              <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
              <h3 className="font-semibold text-gray-800 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-600">
                    <span className="text-emerald-500">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <div className="divide-y">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-3">
                    <span className="text-gray-500 font-medium">{key}</span>
                    <span className="text-gray-900">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl font-bold text-gray-900">{product.rating}</span>
                <div>
                  <StarRating rating={product.rating} size="lg" />
                  <p className="text-sm text-gray-500">{product.reviewCount.toLocaleString()} reviews</p>
                </div>
              </div>
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{review.avatar}</span>
                        <div>
                          <p className="font-medium text-gray-800">{review.userName}</p>
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} />
                            {review.verified && <span className="text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">✓ Verified Purchase</span>}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">{review.title}</h4>
                    <p className="text-gray-600 text-sm">{review.body}</p>
                    <p className="text-xs text-gray-400 mt-2">{review.helpful} people found this helpful</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4).map((related) => (
            <Link key={related.id} to={`/product/${related.slug}`} className="group bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-lg transition-all">
              <div className="h-32 flex items-center justify-center">
                <span className="text-5xl group-hover:scale-110 transition-transform">{related.image}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-800 mt-2 truncate">{related.name}</h3>
              <StarRating rating={related.rating} count={related.reviewCount} />
              <p className="font-bold text-gray-900 mt-1">${related.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}