import { describe, expect, it } from 'vitest'
import { offers } from '../data/offers'
import {
  agentRentAgainstAreaRent,
  agentYield,
  cashBeforeHandover,
  dueAfterHandover,
  dueOnHandover,
  estimatedYieldAfterServiceCharges,
  extremes,
  formatMoney,
  formatPct,
  formatSignedPct,
  formatWhole,
  handoverOrder,
  onTimeShare,
  priceAgainstArea,
  pricePerSqft,
  registrationFee,
  serviceChargesPerYear,
  yieldAtAreaRent,
} from './calc'

// Expected results after display rounding.
const expected = [
  ['palm-grove', '1,346', '+3.6%', '8.4%', '7.4%', '10,920', '6.4%', '+12.8%', '42,000', '672,000', '0'],
  ['aurora', '1,400', '+21.7%', '9.5%', '7.1%', '14,700', '5.6%', '+32.9%', '39,200', '529,200', '392,000'],
  ['southgate', '1,113', '+1.1%', '7.0%', '6.7%', '9,600', '5.7%', '+3.3%', '35,600', '569,600', '0'],
  ['canal-view', '2,134', '+4.1%', '6.6%', '6.3%', '18,040', '5.3%', '+4.5%', '70,000', '1,295,000', '0'],
  ['greenfield', '2,171', '+3.4%', '6.4%', '6.1%', '12,920', '5.3%', '+5.0%', '66,000', '1,386,000', '0'],
  ['harbour', '2,568', '+4.8%', '5.8%', '5.7%', '14,060', '4.9%', '+1.9%', '76,000', '1,406,000', '0'],
] as const

const byId = (id: string) => {
  const offer = offers.find((o) => o.id === id)
  if (!offer) throw new Error(`No offer ${id}`)
  return offer
}

describe('calculations, after display rounding', () => {
  it('covers all six offers', () => {
    expect(expected.map((row) => row[0])).toEqual(offers.map((o) => o.id))
  })

  describe.each(expected)(
    '%s',
    (id, perSqft, againstArea, agent, atAreaRent, charges, estimated, rentGap, fee, cash, after) => {
      const o = byId(id)
      it('price per sqft', () => expect(formatWhole(pricePerSqft(o))).toBe(perSqft))
      it('price against area', () => expect(formatSignedPct(priceAgainstArea(o))).toBe(againstArea))
      it("agent's yield", () => expect(formatPct(agentYield(o))).toBe(agent))
      it('yield at area rent', () => expect(formatPct(yieldAtAreaRent(o))).toBe(atAreaRent))
      it('service charges per year', () =>
        expect(formatMoney(serviceChargesPerYear(o))).toBe(`${charges} AED`))
      it('estimated yield after service charges', () =>
        expect(formatPct(estimatedYieldAfterServiceCharges(o))).toBe(estimated))
      it("agent's rent against area rent", () =>
        expect(formatSignedPct(agentRentAgainstAreaRent(o))).toBe(rentGap))
      it('registration fee', () => expect(formatMoney(registrationFee(o))).toBe(`${fee} AED`))
      it('cash needed before handover', () =>
        expect(formatMoney(cashBeforeHandover(o))).toBe(`${cash} AED`))
      it('due after handover', () => expect(formatMoney(dueAfterHandover(o))).toBe(`${after} AED`))
    },
  )
})

describe('other values', () => {
  it('due on handover is the handover share of the price', () => {
    expect(formatMoney(dueOnHandover(byId('palm-grove')))).toBe('420,000 AED')
    expect(formatMoney(dueOnHandover(byId('aurora')))).toBe('98,000 AED')
  })

  it('on-time share needs 3 or more delivered projects', () => {
    expect(onTimeShare(byId('aurora'))).toBeNull()
    expect(formatPct(onTimeShare(byId('palm-grove'))!)).toBe('83.3%')
    expect(formatPct(onTimeShare(byId('greenfield'))!)).toBe('95.0%')
  })

  it('orders stated handovers by date', () => {
    expect(handoverOrder('Q4 2027')).toBeLessThan(handoverOrder('Q1 2028'))
    expect(handoverOrder('Q2 2027')).toBeLessThan(handoverOrder('Q3 2027'))
  })

  it('finds no extremes when all values are equal', () => {
    expect(extremes([5, 5, 5])).toBeNull()
    expect(extremes([3, 9, 5])).toEqual({ min: 3, max: 9 })
  })
})

describe('display rounding', () => {
  it('rounds money halves up', () => {
    expect(formatWhole(1112.5)).toBe('1,113')
    expect(formatMoney(980000)).toBe('980,000 AED')
  })

  it('shows percentages to one decimal place, with a sign where asked', () => {
    expect(formatPct(0.07)).toBe('7.0%')
    expect(formatSignedPct(0.2174)).toBe('+21.7%')
    expect(formatSignedPct(-0.052)).toBe('-5.2%')
  })
})
