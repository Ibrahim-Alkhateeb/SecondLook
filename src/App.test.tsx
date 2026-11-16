// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'
import { offers } from './data/offers'
import { LABELS } from './lib/labels'

const { notice: NOTICE, notChecked: NOT_CHECKED, sourceTag: SOURCE_TAG, yieldNote: YIELD_NOTE } =
  LABELS.en
const AR = LABELS.ar

afterEach(cleanup)

const tick = (name: string) => fireEvent.click(screen.getByRole('checkbox', { name: new RegExp(name) }))
const compareButton = () => screen.getByRole('button', { name: 'Compare' }) as HTMLButtonElement
const heading = () => screen.getByRole('heading', { level: 1 }).textContent

const openCompare = (...names: string[]) => {
  render(<App />)
  names.forEach(tick)
  fireEvent.click(compareButton())
}

const sourceTagWords: string[] = Object.values(SOURCE_TAG)
const sourceTags = () =>
  screen.getAllByRole('button').filter((b) => sourceTagWords.includes(b.textContent ?? ''))

describe('Offers screen', () => {
  it('shows the six offers with name, area, price and size', () => {
    render(<App />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(6)
    const card = screen.getByRole('checkbox', { name: /Palm Grove Heights/ }).closest('label')!
    expect(card.textContent).toContain('JVC')
    expect(card.textContent).toContain('1,050,000 AED')
    expect(card.textContent).toContain('780 sqft')
    expect(screen.getByText(/Select 2 or 3 offers to compare\./)).toBeTruthy()
  })

  it('opens Compare only with 2 or 3 offers selected, and blocks a fourth', () => {
    render(<App />)
    expect(compareButton().disabled).toBe(true)
    tick('Palm Grove Heights')
    expect(compareButton().disabled).toBe(true)
    tick('Aurora Sky Tower')
    expect(compareButton().disabled).toBe(false)
    tick('Southgate Terraces')
    expect(compareButton().disabled).toBe(false)

    const fourth = screen.getByRole('checkbox', { name: /Canal View One/ }) as HTMLInputElement
    expect(fourth.disabled).toBe(true)
    fireEvent.click(fourth)
    expect(fourth.checked).toBe(false)
    expect(screen.getAllByRole('checkbox', { checked: true })).toHaveLength(3)

    fireEvent.click(compareButton())
    expect(heading()).toBe('Compare')
  })
})

describe('Compare screen', () => {
  it('shows all six numbers for each selected offer', () => {
    openCompare('Palm Grove Heights', 'Aurora Sky Tower', 'Southgate Terraces')
    const rowHeads = screen.getAllByRole('rowheader').map((th) => th.textContent)
    expect(rowHeads).toEqual([
      'Price per sqft',
      'Rental yield',
      'Service charges',
      'Payment plan',
      'Handover',
      'Developer record',
      'Flags',
    ])
    expect(screen.getAllByRole('columnheader')).toHaveLength(4)
    for (const label of [
      'Price per sqft',
      "Agent's yield",
      'Estimated yield after service charges',
      'Service charges per year',
      'Cash needed before handover (includes 4% registration fee)',
      'Stated handover',
      'Projects delivered',
    ]) {
      expect(screen.getAllByText(label, { selector: 'dt' })).toHaveLength(3)
    }
    expect(screen.getByText(YIELD_NOTE)).toBeTruthy()
    expect(
      screen.getByText('Developer record: 12 delivered - 83.3% on time - average delay 2 months'),
    ).toBeTruthy()
    expect(screen.getByText('Limited track record: 2 delivered, 0 on time')).toBeTruthy()
  })

  it('puts a source tag on every number', () => {
    openCompare('Palm Grove Heights', 'Aurora Sky Tower')
    const figures = document.querySelectorAll('dd')
    expect(figures.length).toBeGreaterThan(40)
    figures.forEach((dd) => {
      const tags = within(dd as HTMLElement)
        .getAllByRole('button')
        .filter((b) => sourceTagWords.includes(b.textContent ?? ''))
      expect(tags).toHaveLength(1)
    })
  })

  it('opens a tag panel with the source or the formula, and closes it with Escape', () => {
    openCompare('Palm Grove Heights', 'Aurora Sky Tower')
    const formula = 'Price / size = 1,050,000 / 780 = 1,346 AED per sqft'
    const tag = screen.getAllByRole('button', { name: 'Calculated, source for Price per sqft' })[0]

    expect(screen.queryByText(formula)).toBeNull()
    fireEvent.click(tag)
    expect(tag.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByText(formula)).toBeTruthy()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByText(formula)).toBeNull()
    expect(tag.getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(screen.getAllByRole('button', { name: "Agent figure, source for Agent's yield" })[0])
    expect(screen.getByText("From the agent's listing (mock data).")).toBeTruthy()
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Area figure (mock), source for Area annual rent' })[0],
    )
    expect(
      screen.getByText('Illustrative area figure. Mock data, not a real market figure.'),
    ).toBeTruthy()
  })

  it('every tag opens a panel with text', () => {
    openCompare('Aurora Sky Tower', 'Greenfield Park Residences', 'Harbour Lights')
    for (const tag of sourceTags()) {
      fireEvent.click(tag)
      const panel = document.getElementById(tag.getAttribute('aria-controls')!)
      expect(panel?.textContent?.length).toBeGreaterThan(10)
      if (tag.textContent === SOURCE_TAG.calculated) expect(panel?.textContent).toMatch(/ = .+ = /)
    }
  })

  it('marks highest, lowest, earliest and latest in words, and nothing when equal', () => {
    openCompare('Palm Grove Heights', 'Aurora Sky Tower', 'Southgate Terraces')
    const line = (label: string, column: number) =>
      screen.getAllByText(label, { selector: 'dt' })[column].nextElementSibling!.textContent
    expect(line('Price per sqft', 1)).toContain('Highest')
    expect(line('Price per sqft', 2)).toContain('Lowest')
    expect(line('Price per sqft', 0)).not.toMatch(/Highest|Lowest/)
    expect(line('Estimated yield after service charges', 0)).toContain('Highest')
    expect(line('Stated handover', 0)).toContain('Earliest')
    expect(line('Stated handover', 2)).toContain('Latest')
  })

  it('shows no marker in a row where the compared offers are equal', () => {
    // Aurora Sky Tower and Harbour Lights both state Q1 2028.
    openCompare('Aurora Sky Tower', 'Harbour Lights')
    const handovers = screen.getAllByText('Stated handover', { selector: 'dt' })
    handovers.forEach((dt) =>
      expect(dt.nextElementSibling!.textContent).not.toMatch(/Earliest|Latest/),
    )
  })

  it('lists flags per offer and shows the rule behind a flag', () => {
    openCompare('Aurora Sky Tower', 'Southgate Terraces')
    expect(screen.getByText('No flags from the four rules.')).toBeTruthy()
    fireEvent.click(
      screen.getByRole('button', { name: 'Price per sqft is 21.7% above the area figure.' }),
    )
    expect(
      screen.getByText('Rule: price per sqft more than 10% above the area figure.'),
    ).toBeTruthy()
  })

  it('goes back to Offers and keeps the selection', () => {
    openCompare('Palm Grove Heights', 'Aurora Sky Tower')
    fireEvent.click(screen.getByRole('button', { name: /Back to offers/ }))
    expect(heading()).toBe('Offers')
    expect(screen.getAllByRole('checkbox', { checked: true })).toHaveLength(2)
  })
})

describe('Decide screen', () => {
  const openDecide = (...names: string[]) => {
    openCompare(...names)
    fireEvent.click(screen.getByRole('button', { name: 'Decide' }))
  }
  const noteSections = () =>
    screen
      .getAllByRole('heading')
      .map((h) => h.textContent)
      .filter((t) =>
        ['What stands out', 'Watch-outs', 'Questions for the agent', 'Not checked by this tool'].includes(
          t ?? '',
        ),
      )

  it('offers one "My pick" per compared offer plus "None of these"', () => {
    openDecide('Palm Grove Heights', 'Aurora Sky Tower', 'Southgate Terraces')
    expect(screen.getAllByRole('button', { name: /^My pick: / })).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'None of these' })).toBeTruthy()
    expect(noteSections()).toEqual([])
  })

  it('shows the four-section decision note for a pick, and updates on a new choice', () => {
    openDecide('Palm Grove Heights', 'Aurora Sky Tower', 'Southgate Terraces')
    fireEvent.click(screen.getByRole('button', { name: 'My pick: Aurora Sky Tower' }))
    expect(noteSections()).toEqual([
      'What stands out',
      'Watch-outs',
      'Questions for the agent',
      'Not checked by this tool',
    ])
    expect(screen.getByText('Highest price per sqft')).toBeTruthy()
    expect(screen.getByText('Lowest cash needed before handover')).toBeTruthy()
    expect(screen.getByText('40% of the price (392,000 AED) is still due after handover.')).toBeTruthy()
    expect(
      screen.getByText('Over how long is it paid, and what happens if I miss a payment?'),
    ).toBeTruthy()
    expect(
      screen.getByText('Is the 4% registration fee included in the price, waived, or on top?'),
    ).toBeTruthy()
    expect(screen.getByText(NOT_CHECKED)).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'My pick: Southgate Terraces' }))
    expect(screen.queryByText('Highest price per sqft')).toBeNull()
    expect(screen.getByText('Lowest price per sqft')).toBeTruthy()
    expect(screen.getByText('No flags from the four rules.')).toBeTruthy()
  })

  it('"None of these" shows sections 1 to 3 for every offer, then section 4 once', () => {
    openDecide('Palm Grove Heights', 'Aurora Sky Tower')
    fireEvent.click(screen.getByRole('button', { name: 'None of these' }))
    expect(noteSections()).toEqual([
      'What stands out',
      'Watch-outs',
      'Questions for the agent',
      'What stands out',
      'Watch-outs',
      'Questions for the agent',
      'Not checked by this tool',
    ])
    expect(screen.getByRole('heading', { name: 'Palm Grove Heights' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Aurora Sky Tower' })).toBeTruthy()
  })
})

describe('language switch', () => {
  const switchTo = (label: string) => fireEvent.click(screen.getByRole('button', { name: label }))

  it('starts in English, left to right', () => {
    render(<App />)
    expect(document.documentElement.lang).toBe('en')
    expect(document.documentElement.dir).toBe('ltr')
    expect(screen.getByRole('button', { name: 'العربية' })).toBeTruthy()
  })

  it('switches the whole interface to Arabic, right to left, and back', () => {
    render(<App />)
    switchTo('العربية')
    expect(document.documentElement.lang).toBe('ar')
    expect(document.documentElement.dir).toBe('rtl')
    expect(heading()).toBe(AR.screen.offers)
    expect(screen.getByText(AR.notice)).toBeTruthy()
    expect(screen.queryByText(NOTICE)).toBeNull()
    expect(screen.getByText(new RegExp(AR.offers.hint))).toBeTruthy()
    const card = screen.getByRole('checkbox', { name: /Palm Grove Heights/ }).closest('label')!
    expect(card.textContent).toContain('1,050,000 درهم')

    switchTo('English')
    expect(document.documentElement.dir).toBe('ltr')
    expect(heading()).toBe('Offers')
    expect(screen.getByText(NOTICE)).toBeTruthy()
  })

  it('keeps the screen, the selection and the choice when the language changes', () => {
    openCompare('Palm Grove Heights', 'Aurora Sky Tower')
    switchTo('العربية')
    expect(heading()).toBe(AR.screen.compare)
    expect(screen.getAllByRole('columnheader')).toHaveLength(3)

    fireEvent.click(screen.getByRole('button', { name: AR.compare.decideButton }))
    fireEvent.click(screen.getByRole('button', { name: AR.decide.myPickName('Aurora Sky Tower') }))
    switchTo('English')
    expect(heading()).toBe('Decide')
    expect(screen.getByText('Highest price per sqft')).toBeTruthy()
  })

  it('shows the comparison, formulas, flags and decision note in Arabic', () => {
    openCompare('Palm Grove Heights', 'Aurora Sky Tower')
    switchTo('العربية')
    expect(screen.getAllByRole('rowheader').map((th) => th.textContent)).toEqual([
      ...Object.values(AR.row),
      AR.compare.flags,
    ])
    expect(screen.getByText(AR.yieldNote)).toBeTruthy()
    expect(screen.getByText('الربع الرابع 2027')).toBeTruthy()

    fireEvent.click(
      screen.getAllByRole('button', {
        name: AR.sourceTagName(AR.sourceTag.calculated, AR.field.pricePerSqft),
      })[0],
    )
    expect(
      screen.getByText('السعر / المساحة = 1,050,000 / 780 = 1,346 درهم للقدم المربعة'),
    ).toBeTruthy()

    fireEvent.click(
      screen.getByRole('button', { name: 'سعر القدم المربعة أعلى من رقم المنطقة بنسبة 21.7%.' }),
    )
    expect(
      screen.getByText('القاعدة: سعر القدم المربعة أعلى من رقم المنطقة بأكثر من 10%.'),
    ).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: AR.compare.decideButton }))
    fireEvent.click(screen.getByRole('button', { name: AR.decide.myPickName('Aurora Sky Tower') }))
    for (const title of Object.values(AR.noteSection)) {
      expect(screen.getByRole('heading', { name: title })).toBeTruthy()
    }
    expect(screen.getByText('الأعلى في سعر القدم المربعة')).toBeTruthy()
    expect(screen.getByText('40% من السعر (392,000 درهم) تبقى مستحقة بعد التسليم.')).toBeTruthy()
    expect(screen.getByText(AR.notChecked)).toBeTruthy()
  })
})

describe('mock-data notice', () => {
  it('is shown on every screen', () => {
    render(<App />)
    expect(screen.getByText(NOTICE)).toBeTruthy()
    tick(offers[0].name)
    tick(offers[1].name)
    fireEvent.click(compareButton())
    expect(heading()).toBe('Compare')
    expect(screen.getByText(NOTICE)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Decide' }))
    expect(heading()).toBe('Decide')
    expect(screen.getByText(NOTICE)).toBeTruthy()
  })
})
