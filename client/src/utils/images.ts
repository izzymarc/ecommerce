/**
 * Image helpers for Unsplash-hosted product photography.
 *
 * Photos are referenced by Unsplash photo ID so the exact crop, size and
 * quality can be requested per usage instead of shipping oversized assets.
 */

const UNSPLASH_BASE = 'https://images.unsplash.com'

export type ImagePreset = 'thumb' | 'card' | 'detail' | 'hero'

const PRESETS: Record<ImagePreset, { w: number; h: number; q: number }> = {
  thumb: { w: 160, h: 160, q: 70 },
  card: { w: 500, h: 500, q: 75 },
  detail: { w: 900, h: 900, q: 80 },
  hero: { w: 1600, h: 900, q: 80 },
}

/** Build a sized, cropped Unsplash URL for a photo ID. */
export function photoUrl(photoId: string, preset: ImagePreset = 'card'): string {
  const { w, h, q } = PRESETS[preset]
  return `${UNSPLASH_BASE}/${photoId}?auto=format&fit=crop&w=${w}&h=${h}&q=${q}`
}

/**
 * Build a srcSet at 1x and 2x so high-density displays get a sharper image
 * without forcing the cost on standard displays.
 */
export function photoSrcSet(photoId: string, preset: ImagePreset = 'card'): string {
  const { w, h, q } = PRESETS[preset]
  return [
    `${UNSPLASH_BASE}/${photoId}?auto=format&fit=crop&w=${w}&h=${h}&q=${q} 1x`,
    `${UNSPLASH_BASE}/${photoId}?auto=format&fit=crop&w=${w * 2}&h=${h * 2}&q=${q} 2x`,
  ].join(', ')
}
