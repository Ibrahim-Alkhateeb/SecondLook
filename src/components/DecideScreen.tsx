import { computeMarkers } from '../lib/markers'
import { buildOfferNote, type OfferNote } from '../lib/note'
import type { Offer } from '../types'
import { useLang } from './Lang'

/** The id of the picked offer, "none" for "None of these", or null before any choice. */
export type Choice = string | 'none' | null

interface Props {
  offers: Offer[]
  choice: Choice
  onChoose: (choice: Choice) => void
  onBack: () => void
}

const sectionHeading =
  'text-sm font-semibold tracking-wide text-stone-600 uppercase rtl:tracking-normal'

function NoteList({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) return <p className="mt-1 text-stone-800">{empty}</p>
  return (
    <ul className="mt-1 list-disc space-y-1 ps-5 text-stone-800">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

/** Sections 1 to 3 of the decision note, for one offer. */
function OfferNoteSections({ note, level }: { note: OfferNote; level: 'h3' | 'h4' }) {
  const { L } = useLang()
  const Heading = level
  return (
    <div className="space-y-4">
      <section>
        <Heading className={sectionHeading}>{L.noteSection.standsOut}</Heading>
        <NoteList items={note.standsOut} empty={L.noMarkers} />
      </section>
      <section>
        <Heading className={sectionHeading}>{L.noteSection.watchOuts}</Heading>
        <NoteList items={note.watchOuts} empty={L.compare.noFlags} />
      </section>
      <section>
        <Heading className={sectionHeading}>{L.noteSection.questions}</Heading>
        <NoteList items={note.questions} empty="" />
      </section>
    </div>
  )
}

const choiceButton = (pressed: boolean) =>
  `cursor-pointer rounded-md border-2 px-4 py-2 font-semibold ${
    pressed
      ? 'border-teal-800 bg-teal-800 text-white'
      : 'border-stone-400 bg-white text-stone-900 hover:border-stone-700'
  }`

export function DecideScreen({ offers, choice, onChoose, onBack }: Props) {
  const { lang, L } = useLang()
  const markers = computeMarkers(offers)
  const picked = offers.find((o) => o.id === choice)

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
        {L.decide.backToCompare}
      </button>
      <p className="mt-3 max-w-2xl text-stone-700">{L.decide.intro}</p>

      <div role="group" aria-label={L.decide.choices} className="mt-6">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => {
            const pressed = choice === offer.id
            return (
              <li
                key={offer.id}
                className={`flex flex-col items-start gap-3 rounded-lg border-2 bg-white p-4 ${
                  pressed ? 'border-teal-700' : 'border-stone-300'
                }`}
              >
                <div>
                  <p className="font-serif text-lg leading-snug font-semibold">{offer.name}</p>
                  <p className="text-sm text-stone-600">{offer.area}</p>
                </div>
                <button
                  type="button"
                  aria-pressed={pressed}
                  aria-label={L.decide.myPickName(offer.name)}
                  onClick={() => onChoose(offer.id)}
                  className={choiceButton(pressed)}
                >
                  {pressed ? '✓ ' : ''}
                  {L.decide.myPick}
                </button>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          aria-pressed={choice === 'none'}
          aria-label={L.decide.noneOfThese}
          onClick={() => onChoose('none')}
          className={`mt-4 ${choiceButton(choice === 'none')}`}
        >
          {choice === 'none' ? '✓ ' : ''}
          {L.decide.noneOfThese}
        </button>
      </div>

      <section
        aria-live="polite"
        aria-labelledby="decision-note-heading"
        className="mt-8 max-w-3xl rounded-lg border border-stone-300 bg-white p-5 sm:p-6"
      >
        <h2 id="decision-note-heading" className="font-serif text-2xl font-semibold">
          {L.decide.noteHeading}
        </h2>

        {choice === null && <p className="mt-2 text-stone-700">{L.decide.noChoiceYet}</p>}

        {picked && (
          <>
            <p className="mt-1 mb-5 text-stone-700">{L.decide.myPickName(picked.name)}</p>
            <OfferNoteSections
              note={buildOfferNote(picked, markers[picked.id], lang)}
              level="h3"
            />
          </>
        )}

        {choice === 'none' && (
          <>
            <p className="mt-1 mb-5 text-stone-700">{L.decide.noneOfThese}</p>
            <div className="space-y-6">
              {offers.map((offer) => (
                <section key={offer.id} className="border-s-4 border-stone-300 ps-4">
                  <h3 className="mb-3 font-serif text-lg font-semibold">{offer.name}</h3>
                  <OfferNoteSections
                    note={buildOfferNote(offer, markers[offer.id], lang)}
                    level="h4"
                  />
                </section>
              ))}
            </div>
          </>
        )}

        {choice !== null && (
          <section className="mt-6 border-t border-stone-300 pt-4">
            <h3 className={sectionHeading}>{L.noteSection.notChecked}</h3>
            <p className="mt-1 text-stone-800">{L.notChecked}</p>
          </section>
        )}
      </section>
    </div>
  )
}
