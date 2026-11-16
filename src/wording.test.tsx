// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'
import { offers } from './data/offers'
import { LABELS, type Lang } from './lib/labels'

afterEach(cleanup)

/** Words SecondLook never uses: it gives no verdict, ranking or promise. */
const BANNED_WORDS: Record<Lang, string[]> = {
  en: [
    'buy',
    'best deal',
    'recommended',
    'guaranteed',
    'net yield',
    'score',
    'likely handover',
    'best',
    'worst',
    'strongest',
    'weakest',
  ],
  // The same list, in Arabic.
  ar: [
    'اشتر',
    'أفضل صفقة',
    'موصى',
    'مضمون',
    'العائد الصافي',
    'درجة',
    'التسليم المرجح',
    'أفضل',
    'أسوأ',
    'الأقوى',
    'الأضعف',
  ],
}

/** Everything a person can read or hear right now: visible text plus accessible names. */
const renderedText = (): string => {
  const names = [...document.querySelectorAll('[aria-label]')].map((el) =>
    el.getAttribute('aria-label'),
  )
  return [document.body.textContent, ...names].join('\n')
}

/** Opens every panel on the current screen in turn and collects all the text seen. */
const textWithEveryPanelOpen = (): string => {
  const seen = [renderedText()]
  for (const button of screen.getAllByRole('button')) {
    if (!button.hasAttribute('aria-expanded')) continue
    fireEvent.click(button)
    seen.push(renderedText())
  }
  return seen.join('\n')
}

/** Walks all three screens for one selection, including every pick and "None of these". */
const walkAllScreens = (lang: Lang, names: string[]): string => {
  const L = LABELS[lang]
  render(<App />)
  if (lang !== 'en') fireEvent.click(screen.getByRole('button', { name: LABELS.en.switchTo.label }))
  const seen = [textWithEveryPanelOpen()]

  for (const name of names) {
    fireEvent.click(screen.getByRole('checkbox', { name: new RegExp(name) }))
  }
  seen.push(renderedText())

  fireEvent.click(screen.getByRole('button', { name: L.offers.compareButton }))
  seen.push(textWithEveryPanelOpen())

  fireEvent.click(screen.getByRole('button', { name: L.compare.decideButton }))
  seen.push(renderedText())
  for (const name of names) {
    fireEvent.click(screen.getByRole('button', { name: L.decide.myPickName(name) }))
    seen.push(renderedText())
  }
  fireEvent.click(screen.getByRole('button', { name: L.decide.noneOfThese }))
  seen.push(renderedText())

  cleanup()
  return seen.join('\n')
}

describe.each(['en', 'ar'] as const)('interface wording (%s)', (lang) => {
  const L = LABELS[lang]
  const names = offers.map((o) => o.name)
  // Two selections that between them cover all six offers, plus a pair.
  const text = [
    walkAllScreens(lang, names.slice(0, 3)),
    walkAllScreens(lang, names.slice(3, 6)),
    walkAllScreens(lang, [names[1], names[5]]),
  ].join('\n')

  it('walked all three screens', () => {
    expect(text).toContain(L.offers.hint)
    expect(text).toContain(`${L.formula.pricePerSqft} = 1,050,000 / 780 = 1,346 ${L.unit.perSqft}`)
    expect(text).toContain(L.noteSection.notChecked)
  })

  it.each(BANNED_WORDS[lang])('never shows "%s"', (word) => {
    expect(text.toLowerCase()).not.toContain(word)
  })

  // The English list also holds in the Arabic interface, where offer names stay in Latin script.
  if (lang !== 'en') {
    it.each(BANNED_WORDS.en)('never shows "%s"', (word) => {
      expect(text.toLowerCase()).not.toContain(word)
    })
  }
})
