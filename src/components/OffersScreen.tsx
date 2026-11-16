import { formatMoney, formatWhole } from '../lib/calc'
import type { Offer } from '../types'
import { useLang } from './Lang'

export const MIN_COMPARED = 2
export const MAX_COMPARED = 3

interface Props {
  offers: Offer[]
  selectedIds: string[]
  onToggle: (id: string) => void
  onCompare: () => void
}

export function OffersScreen({ offers, selectedIds, onToggle, onCompare }: Props) {
  const { L } = useLang()
  const count = selectedIds.length
  const atLimit = count >= MAX_COMPARED
  const canCompare = count >= MIN_COMPARED && count <= MAX_COMPARED

  return (
    <div>
      <p className="max-w-2xl text-stone-700">{L.offers.intro}</p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => {
          const checked = selectedIds.includes(offer.id)
          const disabled = !checked && atLimit
          return (
            <li key={offer.id}>
              <label
                className={`flex h-full gap-3 rounded-lg border-2 bg-white p-4 ${
                  checked ? 'border-teal-700' : 'border-stone-300'
                } ${disabled ? 'opacity-60' : 'cursor-pointer hover:border-stone-500'}`}
              >
                <input
                  type="checkbox"
                  className="mt-1 size-5 shrink-0 accent-teal-700"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => onToggle(offer.id)}
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-lg leading-snug font-semibold">
                    {offer.name}
                  </span>
                  <span className="block text-sm text-stone-600">{offer.area}</span>
                  <span className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <span>
                      <span className="block text-xs text-stone-600">{L.offers.price}</span>
                      <span className="font-semibold tabular-nums">
                        {formatMoney(offer.priceAED, L.unit.aed)}
                      </span>
                    </span>
                    <span>
                      <span className="block text-xs text-stone-600">{L.offers.size}</span>
                      <span className="font-semibold tabular-nums">
                        {formatWhole(offer.sizeSqft)} {L.unit.sqft}
                      </span>
                    </span>
                  </span>
                </span>
              </label>
            </li>
          )
        })}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          disabled={!canCompare}
          onClick={onCompare}
          className="rounded-md bg-teal-800 px-5 py-2.5 font-semibold text-white hover:bg-teal-900 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-600"
        >
          {L.offers.compareButton}
        </button>
        <p className="text-sm text-stone-700">
          {L.offers.hint}{' '}
          <span aria-live="polite" className="font-medium">
            {L.offers.selectedCount(count)}
            {atLimit ? `. ${L.offers.limitReached}` : ''}
          </span>
        </p>
      </div>
    </div>
  )
}
