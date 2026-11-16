import type { Source } from '../lib/compare'
import type { SourceKind } from '../lib/labels'
import { useLang } from './Lang'
import { Reveal } from './Reveal'

// The tag's words carry the meaning; the border style is only a second cue.
const TAG_STYLE: Record<SourceKind, string> = {
  agent: 'border-stone-400 bg-white text-stone-700',
  area: 'border-dashed border-stone-500 bg-stone-50 text-stone-700',
  calculated: 'border-teal-700 bg-teal-50 text-teal-900',
}

/** The tag every number carries. Opens a panel with the source or the formula. */
export function SourceTag({ source, figure }: { source: Source; figure: string }) {
  const { L } = useLang()
  const tag = L.sourceTag[source.kind]
  return (
    <Reveal
      label={tag}
      name={L.sourceTagName(tag, figure)}
      className={`cursor-pointer rounded-full border px-2 py-0.5 text-[11px] leading-4 font-medium whitespace-nowrap hover:bg-stone-200 rtl:text-xs ${TAG_STYLE[source.kind]}`}
    >
      {source.detail}
    </Reveal>
  )
}
