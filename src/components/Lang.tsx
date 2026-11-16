import { createContext, useContext } from 'react'
import { LABELS, type Labels, type Lang } from '../lib/labels'

/** The interface language, shared with every screen. */
export const LangContext = createContext<Lang>('en')

export function useLang(): { lang: Lang; L: Labels } {
  const lang = useContext(LangContext)
  return { lang, L: LABELS[lang] }
}
