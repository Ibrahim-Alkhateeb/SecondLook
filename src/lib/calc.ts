/**
 * Every number SecondLook shows is computed here, and only here.
 * All functions are pure. Values stay unrounded until a format function is called.
 */
import type { Offer } from '../types'

export const REGISTRATION_FEE_RATE = 0.04
export const MIN_DELIVERED_FOR_ON_TIME_SHARE = 3

// ---- Values ----

export const pricePerSqft = (o: Offer): number => o.priceAED / o.sizeSqft

export const priceAgainstArea = (o: Offer): number =>
  (pricePerSqft(o) - o.areaPricePerSqft) / o.areaPricePerSqft

export const agentYield = (o: Offer): number => o.agentAnnualRent / o.priceAED

export const yieldAtAreaRent = (o: Offer): number => o.areaAnnualRent / o.priceAED

export const serviceChargesPerYear = (o: Offer): number =>
  o.serviceChargePerSqftYear * o.sizeSqft

export const estimatedYieldAfterServiceCharges = (o: Offer): number =>
  (o.areaAnnualRent - serviceChargesPerYear(o)) / o.priceAED

export const agentRentAgainstAreaRent = (o: Offer): number =>
  (o.agentAnnualRent - o.areaAnnualRent) / o.areaAnnualRent

export const registrationFee = (o: Offer): number => REGISTRATION_FEE_RATE * o.priceAED

export const cashBeforeHandover = (o: Offer): number =>
  (o.priceAED * o.pctBeforeHandover) / 100 + registrationFee(o)

export const dueOnHandover = (o: Offer): number => (o.priceAED * o.pctOnHandover) / 100

export const dueAfterHandover = (o: Offer): number => (o.priceAED * o.pctAfterHandover) / 100

/** Share of delivered projects that were on time. Null when the record is too short to say. */
export const onTimeShare = (o: Offer): number | null =>
  o.devProjectsDelivered >= MIN_DELIVERED_FOR_ON_TIME_SHARE
    ? o.devDeliveredOnTime / o.devProjectsDelivered
    : null

/** Reads a stated handover such as "Q4 2027" into its quarter and year. */
export const handoverParts = (statedHandover: string): { quarter: number; year: number } => {
  const match = /^Q([1-4])\s+(\d{4})$/.exec(statedHandover.trim())
  if (!match) throw new Error(`Unreadable handover: ${statedHandover}`)
  return { quarter: Number(match[1]), year: Number(match[2]) }
}

/** Turns a stated handover such as "Q4 2027" into a number that sorts by date. */
export const handoverOrder = (statedHandover: string): number => {
  const { quarter, year } = handoverParts(statedHandover)
  return year * 4 + quarter
}

/** The lowest and highest of a set of values, or null when they are all equal. */
export const extremes = (values: number[]): { min: number; max: number } | null => {
  const min = Math.min(...values)
  const max = Math.max(...values)
  return min === max ? null : { min, max }
}

// ---- Display rounding ----
// Money and price per sqft: nearest AED, halves rounded up.
// Yields and other percentages: one decimal place.

export const formatWhole = (value: number): string => Math.round(value).toLocaleString('en-US')

/** `currency` is the word shown after the amount; it changes with the interface language. */
export const formatMoney = (value: number, currency = 'AED'): string =>
  `${formatWhole(value)} ${currency}`

export const formatPct = (fraction: number): string =>
  `${(Math.round(fraction * 1000) / 10).toFixed(1)}%`

export const formatSignedPct = (fraction: number): string =>
  `${fraction >= 0 ? '+' : ''}${formatPct(fraction)}`

/** A rate held as a fraction, shown as a whole percentage: 0.04 becomes "4%". */
export const formatWholePct = (fraction: number): string => `${Math.round(fraction * 100)}%`

/** A share already held as a whole percentage: 60 becomes "60%". */
export const formatShare = (pct: number): string => `${pct}%`
