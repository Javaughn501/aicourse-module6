import { useEffect, useId, useRef } from 'react'
import type { MobileMenuProps } from './types'

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function MobileMenu({
  id,
  isOpen,
  onClose,
  brandLabel,
  links,
  searchPlaceholder = 'Search…',
  onSearch,
  user,
  userMenuActions,
}: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const searchId = useId()

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('a[href], button:not([disabled])')?.focus()
    }, 60)
    return () => {
      document.body.style.overflow = ''
      window.clearTimeout(t)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  const submitSearch = (q: string) => {
    const trimmed = q.trim()
    if (trimmed) onSearch?.(trimmed)
    onClose()
  }

  return (
    <div
      id={id}
      className="lg:hidden"
      aria-hidden={!isOpen}
    >
      <div
        className={`fixed inset-0 z-40 bg-neutral-950/50 backdrop-blur-[2px] transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`fixed inset-y-0 right-0 z-50 flex w-[min(100vw-1rem,20rem)] flex-col border-l border-neutral-200 bg-white shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none dark:border-neutral-800 dark:bg-neutral-950 ${
          isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
        }`}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <p
            id={titleId}
            className="text-lg font-semibold text-neutral-900 dark:text-neutral-50"
          >
            {brandLabel}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-neutral-600 outline-none transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
            aria-label="Close menu"
          >
            <svg
              className="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-4">
          <form
            className="shrink-0"
            onSubmit={(e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget)
              submitSearch(String(fd.get('q') ?? ''))
            }}
            role="search"
          >
            <label
              htmlFor={searchId}
              className="sr-only"
            >
              Search
            </label>
            <div className="relative">
              <span
                className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400"
                aria-hidden
              >
                <svg
                  className="size-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                id={searchId}
                name="q"
                type="search"
                placeholder={searchPlaceholder}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-3 text-sm text-neutral-900 outline-none ring-violet-500/0 transition-[box-shadow,border-color,background-color] duration-200 placeholder:text-neutral-400 focus:border-violet-500/50 focus:bg-white focus:ring-2 focus:ring-violet-500/30 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:bg-neutral-950"
                autoComplete="off"
              />
            </div>
          </form>

          <nav
            aria-label="Mobile"
            className="flex flex-col gap-1"
          >
            {links.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                className={`rounded-xl px-3 py-3 text-sm font-medium outline-none transition-[background-color,color,transform] duration-200 motion-safe:hover:translate-x-0.5 motion-safe:active:scale-[0.99] ${
                  link.isActive
                    ? 'bg-violet-500/15 text-violet-700 dark:text-violet-300'
                    : 'text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900'
                }`}
                aria-current={link.isActive ? 'page' : undefined}
                onClick={onClose}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-auto border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <div className="flex items-center gap-3 rounded-xl bg-neutral-50 px-3 py-3 dark:bg-neutral-900/80">
              <span className="relative size-11 shrink-0 overflow-hidden rounded-full bg-violet-500/15 ring-2 ring-violet-500/25">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    width={44}
                    height={44}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center text-sm font-semibold text-violet-700 dark:text-violet-300">
                    {initials(user.name)}
                  </span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{user.name}</p>
                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{user.email}</p>
              </div>
            </div>
            <ul className="mt-3 flex flex-col gap-1">
              {userMenuActions.map((action) => (
                <li key={action.id}>
                  {action.href ? (
                    <a
                      href={action.href}
                      className={`block rounded-xl px-3 py-2.5 text-sm font-medium outline-none transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-violet-500 dark:hover:bg-neutral-900 ${
                        action.destructive
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-neutral-800 dark:text-neutral-200'
                      }`}
                      onClick={onClose}
                    >
                      {action.label}
                    </a>
                  ) : (
                    <button
                      type="button"
                      className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium outline-none transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-violet-500 dark:hover:bg-neutral-900 ${
                        action.destructive
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-neutral-800 dark:text-neutral-200'
                      }`}
                      onClick={() => {
                        action.onSelect?.()
                        onClose()
                      }}
                    >
                      {action.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
