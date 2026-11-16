import { describe, expect, it } from 'vitest'
import { offers } from '../data/offers'
import { ALWAYS_QUESTIONS, QUESTIONS, flagsFor, questionsFor } from './flags'

const flagsOf = (id: string) => {
  const offer = offers.find((o) => o.id === id)
  if (!offer) throw new Error(`No offer ${id}`)
  return flagsFor(offer).map((f) => [f.id, f.text])
}

describe('flags from the four rules', () => {
  it('Palm Grove Heights: F2 only', () => {
    expect(flagsOf('palm-grove')).toEqual([
      ['F2', "The agent's yield assumes a rent 12.8% above the area figure."],
    ])
  })

  it('Aurora Sky Tower: F1, F2, F3 and both F4 texts', () => {
    expect(flagsOf('aurora')).toEqual([
      ['F1', 'Price per sqft is 21.7% above the area figure.'],
      ['F2', "The agent's yield assumes a rent 32.9% above the area figure."],
      ['F3', '40% of the price (392,000 AED) is still due after handover.'],
      ['F4', 'Limited track record: 2 delivered, 0 on time.'],
      ['F4', 'Past projects were 14 months late on average.'],
    ])
  })

  it.each(['southgate', 'canal-view', 'greenfield', 'harbour'])('%s: no flags', (id) => {
    expect(flagsOf(id)).toEqual([])
  })

  it('applies thresholds to unrounded values, strictly above', () => {
    const base = offers.find((o) => o.id === 'southgate')!
    // Exactly 10% above the area rent: not flagged.
    expect(flagsFor({ ...base, areaAnnualRent: 60000, agentAnnualRent: 66000 })).toEqual([])
    // Just over 10%: flagged, even though it displays as 10.0%.
    expect(
      flagsFor({ ...base, areaAnnualRent: 60000, agentAnnualRent: 66010 }).map((f) => f.id),
    ).toEqual(['F2'])
    // Exactly 6 months average delay: not flagged. Exactly 3 delivered: not flagged.
    expect(flagsFor({ ...base, devAvgDelayMonths: 6, devProjectsDelivered: 3 })).toEqual([])
  })
})

describe('questions for the agent', () => {
  it('always asks the two fixed questions', () => {
    expect(questionsFor([])).toEqual([
      'Is the 4% registration fee included in the price, waived, or on top?',
      'Who confirmed the service charge rate, and can it change after handover?',
    ])
  })

  it('puts each flagged rule’s question first, once', () => {
    const aurora = offers.find((o) => o.id === 'aurora')!
    expect(questionsFor(flagsFor(aurora))).toEqual([
      QUESTIONS.F1,
      QUESTIONS.F2,
      QUESTIONS.F3,
      QUESTIONS.F4,
      ...ALWAYS_QUESTIONS,
    ])
  })
})
