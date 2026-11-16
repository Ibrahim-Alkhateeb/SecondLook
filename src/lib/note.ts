/** Builds the per-offer part of the decision note. */
import type { Offer } from '../types'
import { flagsFor, questionsFor } from './flags'
import { LABELS, type Lang } from './labels'
import { markerSentences, type OfferMarkers } from './markers'

export interface OfferNote {
  standsOut: string[]
  watchOuts: string[]
  questions: string[]
}

export function buildOfferNote(offer: Offer, markers: OfferMarkers, lang: Lang = 'en'): OfferNote {
  const flags = flagsFor(offer, lang)
  return {
    standsOut: markerSentences(markers, LABELS[lang]),
    watchOuts: flags.map((f) => f.text),
    questions: questionsFor(flags, lang),
  }
}
