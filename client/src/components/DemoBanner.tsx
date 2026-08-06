const PORTFOLIO_URL = 'https://ezekielgwamna.pages.dev/#/projects'

export function DemoBanner() {
  return (
    <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-indigo-50 text-sm">
      <div className="container mx-auto px-4 py-2 flex flex-wrap items-center justify-center md:justify-between gap-2 text-center md:text-left">
        <span>
          <strong className="text-white font-semibold">Portfolio demo</strong>
          {' '}— sample catalog data. No real payments are processed.
        </span>
        <a
          href={PORTFOLIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-semibold text-white border border-white/40 rounded-md px-3 py-1 hover:bg-white/15 transition-colors"
        >
          ← Back to portfolio
        </a>
      </div>
    </div>
  )
}
