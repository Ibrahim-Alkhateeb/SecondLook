/**
 * Neutral markers: which compared offer has the highest and lowest value in a row.
 * They describe, they do not judge. No marker is shown when a row is all equal.
 */
import type { Offer } from '../types'
import {
  cashBeforeHandover,
  estimatedYieldAfterServiceCharges,
  extremes,
  handoverOrder,
  pricePerSqft,
  serviceChargesPerYear,
} from './calc'
import type { Labels } from './labels'

export type MarkerKey = keyof Labels['markerSubject']
export type MarkerKind = keyof Labels['marker']

export type OfferMarkers = Partial<Record<MarkerKey, MarkerKind>>

const MARKED_ROWS: {
  key: MarkerKey
  value: (o: Offer) => number
  low: MarkerKind
  high: MarkerKind
}[] = [
  { key: 'pricePerSqft', value: pricePerSqft, low: 'lowest', high: 'highest' },
  { key: 'estimatedYield', value: estimatedYieldAfterServiceCharges, low: 'lowest', high: 'highest' },
  { key: 'serviceChargesPerYear', value: serviceChargesPerYear, low: 'lowest', high: 'highest' },
  { key: 'cashBeforeHandover', value: cashBeforeHandover, low: 'lowest', high: 'highest' },
  {
    key: 'statedHandover',
    value: (o) => handoverOrder(o.statedHandover),
    low: 'earliest',
    high: 'latest',
  },
]

/** Markers for each compared offer, keyed by offer id. */
export function computeMarkers(offers: Offer[]): Record<string, OfferMarkers> {
  const result: Record<string, OfferMarkers> = {}
  for (const o of offers) result[o.id] = {}

  for (const row of MARKED_ROWS) {
    const values = offers.map(row.value)
    const range = extremes(values)
    if (!range) continue
    offers.forEach((o, i) => {
      if (values[i] === range.max) result[o.id][row.key] = row.high
      else if (values[i] === range.min) result[o.id][row.key] = row.low
    })
  }
  return result
}

/** An offer's markers as sentences, for example "Lowest cash needed before handover". */
export function markerSentences(markers: OfferMarkers, L: Labels): string[] {
  return MARKED_ROWS.flatMap((row) => {
    const kind = markers[row.key]
    return kind ? [L.markerSentence(L.marker[kind], L.markerSubject[row.key])] : []
  })
}
