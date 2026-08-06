import { useState } from 'react'
import { photoUrl, photoSrcSet, type ImagePreset } from '../utils/images'

interface ProductImageProps {
  /** Unsplash photo ID. When omitted the emoji fallback is rendered. */
  photo?: string
  /** Emoji shown while loading, on error, or when no photo is set. */
  emoji: string
  alt: string
  preset?: ImagePreset
  className?: string
  /** Tailwind text size for the emoji fallback. */
  emojiClass?: string
  /** Skip lazy loading for above-the-fold images. */
  priority?: boolean
}

/**
 * Product imagery with a real photograph and an emoji fallback.
 *
 * The emoji stays visible underneath while the photo loads, so a slow or
 * failed image request degrades to something meaningful rather than an
 * empty box or a broken-image icon.
 */
export function ProductImage({
  photo,
  emoji,
  alt,
  preset = 'card',
  className = '',
  emojiClass = 'text-6xl',
  priority = false,
}: ProductImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  const showPhoto = Boolean(photo) && !failed

  return (
    <div className={`relative overflow-hidden bg-gray-50 ${className}`}>
      {/* Emoji fallback sits underneath and shows until the photo paints */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
          showPhoto && loaded ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden={showPhoto && loaded}
      >
        <span className={emojiClass}>{emoji}</span>
      </div>

      {showPhoto && (
        <img
          src={photoUrl(photo!, preset)}
          srcSet={photoSrcSet(photo!, preset)}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`relative h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}
