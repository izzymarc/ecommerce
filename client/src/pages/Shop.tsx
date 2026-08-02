import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PRODUCTS, CATEGORIES } from '../data/products'
import type { SortOption } from '../types'

function StarRating({ rating, count }: { rating: number; count: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => (rating >= i + 1 ? '★' : rating >= i + 0.5 ? '⯨' : '☆'))
  return <div className="flex items-center gap-0.5 text-xs"><span className="text-amber-400">{stars.join('')}</span><span className="text-gray-500 ml-1">{rating}</span><span className="text-gray-400 ml-1">({count})</span></div>
}

export function Shop() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const categorySlug = searchParams.get('category') || ''
  const tag = searchParams.get('tag') || ''
  const sortParam = searchParams.get('sort') || ''

  const [sortBy, setSortBy] = useState<SortOption>((sortParam as SortOption) || 'featured')
  const [selectedCategory, setSelectedCategory] = useState(categorySlug)
  const [search, setSearch] = useState(query)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [onSale, setOnSale] = useState(false)

  const filtered = useMemo(() => {
    let result = [...PRODUCTS]
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
    if (selectedCategory) result = result.filter((p) => p.category.toLowerCase() === selectedCategory)
    if (tag) result = result.filter((p) => p.tags.includes(tag))
    if (inStockOnly) result = result.filter((p) => p.stock > 0)
    if (onSale) result = result.filter((p) => p.originalPrice)
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break
      case 'price-desc': result.sort((a, b) => b.price - a.price); break
      case 'rating': result.sort((a, b) => b.rating - a.rating); break
      case 'newest': result.reverse(); break
      case 'bestseller': result.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0)); break
    }
    return result
  }, [search, selectedCategory, tag, sortBy, priceRange, inStockOnly, onSale])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {query ? `Results for "${query}"` : selectedCategory ? CATEGORIES.find((c) => c.slug === selectedCategory)?.name || 'Shop' : 'All Products'}
          </h1>
          <p className="text-gray-500 mt-1">{filtered.length} products found</p>
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="bestseller">Bestseller</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 sticky top-28">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
              <div className="space-y-1">
                <button onClick={() => setSelectedCategory('')} className={`block text-sm w-full text-left px-2 py-1 rounded ${!selectedCategory ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>All Categories</button>
                {CATEGORIES.map((c) => (
                  <button key={c.id} onClick={() => setSelectedCategory(c.slug)} className={`block text-sm w-full text-left px-2 py-1 rounded ${selectedCategory === c.slug ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>{c.icon} {c.name}</button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
              <div className="flex gap-2">
                <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])} className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm" placeholder="Min" />
                <span className="text-gray-400">-</span>
                <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], +e.target.value])} className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm" placeholder="Max" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="w-4 h-4 text-indigo-600" /> In Stock Only</label>
              <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={onSale} onChange={(e) => setOnSale(e.target.checked)} className="w-4 h-4 text-indigo-600" /> On Sale</label>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <span className="text-5xl">🔍</span>
              <p className="mt-4">No products found matching your criteria.</p>
              <button onClick={() => { setSearch(''); setSelectedCategory(''); setPriceRange([0, 1000]); setInStockOnly(false); setOnSale(false) }} className="mt-4 text-indigo-600 font-medium">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((product) => {
                const d = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0
                return (
                  <Link key={product.id} to={`/product/${product.slug}`} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
                    <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                      <span className="text-6xl group-hover:scale-110 transition-transform">{product.image}</span>
                      <div className="absolute top-3 left-3 flex gap-1">{d > 0 && <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{d}%</span>}{product.bestseller && <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Best</span>}</div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-indigo-600 font-medium mb-1">{product.category}</p>
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{product.name}</h3>
                      <StarRating rating={product.rating} count={product.reviewCount} />
                      <div className="flex items-center justify-between mt-2">
                        <div><span className="text-lg font-bold">${product.price.toFixed(2)}</span>{product.originalPrice && <span className="text-xs text-gray-400 line-through ml-2">${product.originalPrice.toFixed(2)}</span>}</div>
                      </div>
                      {product.freeShipping && <p className="text-xs text-emerald-600 mt-1">🚚 Free Shipping</p>}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}