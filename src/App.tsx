import { useEffect, useRef, useState } from 'react'
import { CompareScreen } from './components/CompareScreen'
import { DecideScreen, type Choice } from './components/DecideScreen'
import { LangContext } from './components/Lang'
import { MAX_COMPARED, MIN_COMPARED, OffersScreen } from './components/OffersScreen'
import { RevealProvider } from './components/Reveal'
import { offers } from './data/offers'
import { LABELS, type Labels, type Lang } from './lib/labels'

type ScreenKey = keyof Labels['screen']

const SCREEN_ORDER: ScreenKey[] = ['offers', 'compare', 'decide']

export default function App() {
  const [lang, setLang] = useState<Lang>('en')
  const [requestedScreen, setScreen] = useState<ScreenKey>('offers')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [choice, setChoice] = useState<Choice>(null)
  const L = LABELS[lang]

  // Compare and Decide only ever open with 2 or 3 offers selected.
  const canCompare = selectedIds.length >= MIN_COMPARED && selectedIds.length <= MAX_COMPARED
  const screen: ScreenKey = canCompare ? requestedScreen : 'offers'
  const selectedOffers = offers.filter((o) => selectedIds.includes(o.id))

  // The whole page follows the interface language and its reading direction.
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = L.dir
  }, [lang, L.dir])

  // Move keyboard and screen-reader focus to the heading when the screen changes.
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus()
  }, [screen])

  const toggleOffer = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((x) => x !== id)
      if (current.length >= MAX_COMPARED) return current
      return [...current, id]
    })
    // A choice belongs to one set of compared offers.
    setChoice(null)
  }

  return (
    <LangContext.Provider value={lang}>
      <div className="min-h-screen" lang={lang} dir={L.dir}>
        <p
          role="note"
          className="sticky top-0 z-20 border-b border-amber-300 bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-950"
        >
          {L.notice}
        </p>

        <header className="border-b border-stone-300 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-x-8 gap-y-3 px-4 py-4">
            <div>
              <p className="font-serif text-2xl font-semibold tracking-tight">{L.appName}</p>
              <p className="text-sm text-stone-600">{L.tagline}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <ol className="flex gap-1 text-sm">
                {SCREEN_ORDER.map((key, index) => {
                  const current = key === screen
                  return (
                    <li
                      key={key}
                      aria-current={current ? 'step' : undefined}
                      className={`flex items-center gap-2 rounded-full px-3 py-1 ${
                        current ? 'bg-stone-800 font-semibold text-white' : 'text-stone-600'
                      }`}
                    >
                      <span className="tabular-nums">{index + 1}</span>
                      <span className={current ? 'underline underline-offset-4' : ''}>
                        {L.screen[key]}
                      </span>
                    </li>
                  )
                })}
              </ol>
              <button
                type="button"
                lang={L.switchTo.lang}
                onClick={() => setLang(L.switchTo.lang)}
                className="cursor-pointer rounded-md border border-stone-400 bg-white px-3 py-1 text-sm font-semibold text-stone-900 hover:border-stone-700"
              >
                {L.switchTo.label}
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mb-3 scroll-mt-16 font-serif text-3xl font-semibold outline-none"
          >
            {L.screen[screen]}
          </h1>

          <RevealProvider key={`${screen}-${lang}`}>
            {screen === 'offers' && (
              <OffersScreen
                offers={offers}
                selectedIds={selectedIds}
                onToggle={toggleOffer}
                onCompare={() => setScreen('compare')}
              />
            )}
            {screen === 'compare' && (
              <CompareScreen
                offers={selectedOffers}
                onBack={() => setScreen('offers')}
                onDecide={() => setScreen('decide')}
              />
            )}
            {screen === 'decide' && (
              <DecideScreen
                offers={selectedOffers}
                choice={choice}
                onChoose={setChoice}
                onBack={() => setScreen('compare')}
              />
            )}
          </RevealProvider>
        </main>
      </div>
    </LangContext.Provider>
  )
}
