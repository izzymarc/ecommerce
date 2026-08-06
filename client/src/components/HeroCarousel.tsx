import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { photoUrl } from '../utils/images'
import type { Banner } from '../types'

const SLIDE_DURATION = 6000

interface HeroCarouselProps {
  banners: Banner[]
}

/**
 * Full-bleed hero carousel.
 *
 * Behaviour follows the W3C carousel pattern: autoplay pauses on hover,
 * focus and when the tab is hidden, arrow keys move between slides, and
 * users who prefer reduced motion get no autoplay and no Ken Burns drift.
 */
export function HeroCarousel({ banners }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const count = banners.length
  const goTo = useCallback((i: number) => setCurrent(((i % count) + count) % count), [count])
  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  // Respect the user's motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Pause autoplay while the tab is in the background
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  // Autoplay
  useEffect(() => {
    if (paused || reducedMotion || count <= 1) return
    const timer = setTimeout(next, SLIDE_DURATION)
    return () => clearTimeout(timer)
  }, [current, paused, reducedMotion, count, next])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next() }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
  }

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 50) { delta < 0 ? next() : prev() }
    touchStartX.current = null
  }

  return (
    <section
      className="relative overflow-hidden bg-gray-900 focus:outline-none"
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative h-[420px] sm:h-[480px] lg:h-[560px]">
        {banners.map((banner, i) => {
          const active = i === current
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                active ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${banner.title}`}
              aria-hidden={!active}
            >
              {banner.photo && (
                <img
                  src={photoUrl(banner.photo, 'hero')}
                  alt=""
                  aria-hidden="true"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className={`absolute inset-0 h-full w-full object-cover ${
                    active && !reducedMotion ? 'animate-kenburns' : ''
                  }`}
                />
              )}

              {/* Scrims keep the copy legible over any photograph */}
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgGradient} opacity-80`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="relative h-full container mx-auto px-4 flex items-center">
                <div className={`max-w-xl ${banner.textColor}`}>
                  {banner.eyebrow && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                      <span aria-hidden="true">{banner.image}</span>
                      {banner.eyebrow}
                    </span>
                  )}
                  <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight drop-shadow-sm">
                    {banner.title}
                  </h1>
                  <p className="mt-4 text-base sm:text-lg text-white/90 max-w-md">{banner.subtitle}</p>
                  <Link
                    to={banner.ctaLink}
                    tabIndex={active ? 0 : -1}
                    className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-gray-900 shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                  >
                    {banner.cta}
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Progress indicators — the active pip fills over the slide duration */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
            {banners.map((banner, i) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}: ${banner.title}`}
                aria-current={i === current}
                className="group py-2 focus:outline-none"
              >
                <span
                  className={`block h-1.5 overflow-hidden rounded-full bg-white/40 transition-all duration-300 ${
                    i === current ? 'w-10' : 'w-4 group-hover:bg-white/70'
                  }`}
                >
                  {i === current && (
                    <span
                      className={`block h-full rounded-full bg-white ${
                        paused || reducedMotion ? 'w-full' : 'animate-progress'
                      }`}
                      style={{ animationDuration: `${SLIDE_DURATION}ms` }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

