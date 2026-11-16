import { Fragment } from 'react'
import { buildRows, headlineFigures, type Figure } from '../lib/compare'
import { flagsFor } from '../lib/flags'
import { computeMarkers, type OfferMarkers } from '../lib/markers'
import type { Offer } from '../types'
import { useLang } from './Lang'
import { Reveal } from './Reveal'
import { SourceTag } from './SourceTag'

interface Props {
  offers: Offer[]
  onBack: () => void
  onDecide: () => void
}

function FigureList({ figures, markers }: { figures: Figure[]; markers?: OfferMarkers }) {
  const { L } = useLang()
  return (
    <dl className="space-y-2.5">
      {figures.map((figure) => {
        const kind = figure.markerKey && markers?.[figure.markerKey]
        return (
          <div key={figure.key}>
            <dt className="text-xs leading-snug text-stone-600">{figure.label}</dt>
            <dd className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-semibold tabular-nums">{figure.value}</span>
              {kind && (
                <span className="rounded bg-stone-800 px-1.5 py-0.5 text-[11px] leading-4 font-semibold tracking-wide text-white uppercase rtl:text-xs rtl:tracking-normal">
                  {L.marker[kind]}
                </span>
              )}
              <SourceTag source={figure.source} figure={figure.label} />
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

export function CompareScreen({ offers, onBack, onDecide }: Props) {
  const { lang, L } = useLang()
  const rowsByOffer = offers.map((o) => buildRows(o, lang))
  const markers = computeMarkers(offers)
  const rowHeads = rowsByOffer[0]

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer text-sm font-medium text-teal-800 underline underline-offset-2 hover:text-teal-950"
      >
        <span aria-hidden="true" className="inline-block rtl:rotate-180">
          ←
        </span>{' '}
        {L.compare.backToOffers}
      </button>
      <p className="mt-3 max-w-2xl text-stone-700">{L.compare.intro}</p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-stone-300 bg-white">
        <table className="w-full min-w-[42rem] table-fixed border-collapse text-sm">
          <caption className="sr-only">{L.compare.tableCaption}</caption>
          <colgroup>
            <col className="w-32" />
            {offers.map((o) => (
              <col key={o.id} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b-2 border-stone-800 align-top">
              <th scope="col" className="p-3 text-start">
                <span className="sr-only">{L.compare.numberColumn}</span>
              </th>
              {offers.map((offer) => (
                <th key={offer.id} scope="col" className="p-3 text-start font-normal">
                  <span className="block font-serif text-lg leading-snug font-semibold">
                    {offer.name}
                  </span>
                  <span className="mb-3 block text-stone-600">{offer.area}</span>
                  <FigureList figures={headlineFigures(offer, lang)} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowHeads.map((head, rowIndex) => (
              <Fragment key={head.key}>
                <tr className="border-t border-stone-300 align-top">
                  <th scope="row" className="bg-stone-50 p-3 text-start font-semibold">
                    {head.title}
                  </th>
                  {offers.map((offer, offerIndex) => {
                    const row = rowsByOffer[offerIndex][rowIndex]
                    return (
                      <td key={offer.id} className="p-3">
                        {row.summary && <p className="mb-2.5 text-stone-800">{row.summary}</p>}
                        <FigureList figures={row.figures} markers={markers[offer.id]} />
                      </td>
                    )
                  })}
                </tr>
                {head.note && (
                  <tr>
                    <td className="bg-stone-50" />
                    <td colSpan={offers.length} className="px-3 pb-3 text-xs text-stone-700">
                      {head.note}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            <tr className="border-t-2 border-stone-800 align-top">
              <th scope="row" className="bg-stone-50 p-3 text-start font-semibold">
                {L.compare.flags}
              </th>
              {offers.map((offer) => {
                const flags = flagsFor(offer, lang)
                return (
                  <td key={offer.id} className="p-3">
                    {flags.length === 0 ? (
                      <p className="text-stone-700">{L.compare.noFlags}</p>
                    ) : (
                      <ul className="space-y-2">
                        {flags.map((flag) => (
                          <li
                            key={flag.text}
                            className="flex flex-col items-start gap-1 border-s-4 border-amber-600 ps-2.5"
                          >
                            <Reveal
                              label={flag.text}
                              className="cursor-pointer text-start underline decoration-stone-400 decoration-dotted underline-offset-4 hover:decoration-stone-800"
                            >
                              {flag.rule}
                            </Reveal>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={onDecide}
          className="cursor-pointer rounded-md bg-teal-800 px-5 py-2.5 font-semibold text-white hover:bg-teal-900"
        >
          {L.compare.decideButton}
        </button>
      </div>
    </div>
  )
}
