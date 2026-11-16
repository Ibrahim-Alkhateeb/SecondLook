import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/**
 * A button that opens a small panel right below it. Used for source tags and
 * for the rule behind a flag. One panel is open at a time; Escape closes it.
 * Native buttons give click, Enter and Space for free.
 */

interface RevealState {
  openId: string | null
  toggle: (id: string) => void
}

const RevealContext = createContext<RevealState>({ openId: null, toggle: () => {} })

export function RevealProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    if (openId === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenId(null)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [openId])

  const toggle = useCallback((id: string) => setOpenId((current) => (current === id ? null : id)), [])
  const value = useMemo(() => ({ openId, toggle }), [openId, toggle])

  return <RevealContext.Provider value={value}>{children}</RevealContext.Provider>
}

interface RevealProps {
  /** Visible content of the button. */
  label: ReactNode
  /** Accessible name, when the visible label alone is ambiguous. */
  name?: string
  className?: string
  panelClassName?: string
  children: ReactNode
}

export function Reveal({ label, name, className, panelClassName, children }: RevealProps) {
  const id = useId()
  const { openId, toggle } = useContext(RevealContext)
  const open = openId === id

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label={name}
        className={className}
        onClick={() => toggle(id)}
      >
        {label}
      </button>
      {open && (
        <div
          id={id}
          role="note"
          className={
            panelClassName ??
            'w-full rounded border border-stone-300 bg-white px-2.5 py-2 text-xs leading-relaxed font-normal text-stone-800 shadow-sm'
          }
        >
          {children}
        </div>
      )}
    </>
  )
}
