import { useEffect, useRef } from 'react'
import type { UserDropdownProps } from './types'

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function UserDropdown({
  user,
  actions,
  isOpen,
  onOpenChange,
  menuId,
  buttonId,
}: UserDropdownProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        onOpenChange(false)
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onOpenChange])

  const handleAction = (action: (typeof actions)[number]) => {
    action.onSelect?.()
    onOpenChange(false)
  }

  return (
    <div
      ref={rootRef}
      className="relative"
    >
      <button
        id={buttonId}
        type="button"
        className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2 text-left outline-none transition-[background-color,box-shadow] duration-200 ease-out hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:hover:bg-neutral-800 dark:focus-visible:ring-offset-neutral-950 motion-safe:active:scale-[0.98]"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => onOpenChange(!isOpen)}
      >
        <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-violet-500/15 ring-2 ring-violet-500/20 motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:scale-105">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              width={36}
              height={36}
              className="size-full object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-xs font-semibold text-violet-700 dark:text-violet-300">
              {initials(user.name)}
            </span>
          )}
        </span>
        <span className="hidden min-w-0 flex-1 sm:block">
          <span className="block truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {user.name}
          </span>
          <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">{user.email}</span>
        </span>
        <svg
          className={`size-4 shrink-0 text-neutral-500 motion-safe:transition-transform motion-safe:duration-200 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div
        id={menuId}
        role="menu"
        aria-labelledby={buttonId}
        className={`absolute right-0 z-50 mt-2 min-w-[13rem] origin-top-right overflow-hidden rounded-xl border border-neutral-200/90 bg-white/95 p-1 shadow-lg ring-1 ring-black/5 backdrop-blur-md transition-[opacity,transform,visibility] duration-200 ease-out dark:border-neutral-800 dark:bg-neutral-900/95 dark:ring-white/10 motion-reduce:transition-none ${
          isOpen
            ? 'visible translate-y-0 scale-100 opacity-100'
            : 'invisible -translate-y-1 scale-95 opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="border-b border-neutral-100 px-3 py-2 dark:border-neutral-800 sm:hidden"
          role="presentation"
        >
          <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{user.name}</p>
          <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{user.email}</p>
        </div>
        <ul className="py-1">
          {actions.map((action) => (
            <li
              key={action.id}
              role="none"
            >
              {action.href ? (
                <a
                  role="menuitem"
                  href={action.href}
                  className={`block rounded-lg px-3 py-2 text-sm outline-none transition-colors duration-150 hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800 ${
                    action.destructive
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-neutral-800 dark:text-neutral-200'
                  }`}
                  onClick={() => onOpenChange(false)}
                >
                  {action.label}
                </a>
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm outline-none transition-colors duration-150 hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800 ${
                    action.destructive
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-neutral-800 dark:text-neutral-200'
                  }`}
                  onClick={() => handleAction(action)}
                >
                  {action.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
