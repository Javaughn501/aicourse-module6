import { useEffect, useId, useMemo, useState } from 'react'
import { MobileMenu } from './MobileMenu'
import { UserDropdown } from './UserDropdown'
import type { NavbarProps, NavigationLink } from './types'

function hashNavKey(hash: string): string {
  if (!hash || hash === '#') return '__home__'
  return hash
}

function linkNavKey(linkHref: string, homeHref: string): string {
  if (linkHref === '#' || linkHref === homeHref) return '__home__'
  return linkHref
}

function withComputedActive(links: NavigationLink[], hash: string, homeHref: string): NavigationLink[] {
  const cur = hashNavKey(hash)
  return links.map((link) => ({
    ...link,
    isActive: linkNavKey(link.href, homeHref) === cur,
  }))
}

export function Navbar({
  brandLabel,
  homeHref = '/',
  logo,
  links,
  user,
  userMenuActions,
  searchPlaceholder = 'Search products…',
  onSearch,
  navAriaLabel = 'Main',
  className = '',
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [hash, setHash] = useState(() =>
    typeof window !== 'undefined' ? window.location.hash : '',
  )

  const mobileMenuId = useId().replace(/:/g, '')
  const userMenuId = `${mobileMenuId}-user-menu`
  const userButtonId = `${mobileMenuId}-user-button`
  const desktopSearchId = `${mobileMenuId}-nav-search`

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const resolvedHomeHref = homeHref ?? '/'
  const resolvedLinks = useMemo(
    () => withComputedActive(links, hash, resolvedHomeHref),
    [links, hash, resolvedHomeHref],
  )

  const openMobile = () => {
    setUserMenuOpen(false)
    setMobileOpen(true)
  }

  const submitDesktopSearch = (q: string) => {
    const trimmed = q.trim()
    if (trimmed) onSearch?.(trimmed)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-30 w-full border-b transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ease-out motion-reduce:duration-150 ${
          scrolled
            ? 'border-neutral-200/80 bg-white/90 shadow-md shadow-neutral-950/5 backdrop-blur-lg dark:border-neutral-800/80 dark:bg-neutral-950/90 dark:shadow-black/20'
            : 'border-transparent bg-white/75 backdrop-blur-md dark:bg-neutral-950/75'
        } ${className}`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:gap-6 lg:px-8"
          aria-label={navAriaLabel}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 lg:flex-none">
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-neutral-700 outline-none transition-[background-color,transform] duration-200 hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-violet-500 lg:hidden dark:text-neutral-200 dark:hover:bg-neutral-900 motion-safe:active:scale-95"
              aria-expanded={mobileOpen}
              aria-controls={mobileMenuId}
              onClick={() => (mobileOpen ? setMobileOpen(false) : openMobile())}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <svg
                className={`size-6 motion-safe:transition-transform motion-safe:duration-200 ${mobileOpen ? 'rotate-90 opacity-70' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                {mobileOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <>
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </>
                )}
              </svg>
            </button>

            <a
              href={resolvedHomeHref}
              className="group flex min-w-0 items-center gap-2 rounded-xl py-1 pr-2 outline-none transition-[transform,opacity] duration-200 focus-visible:ring-2 focus-visible:ring-violet-500 motion-safe:hover:opacity-90 motion-safe:active:scale-[0.98]"
            >
              {logo ?? (
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 text-sm font-bold text-white shadow-sm ring-2 ring-white/30 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:scale-105 dark:ring-white/10"
                  aria-hidden
                >
                  {brandLabel.slice(0, 1).toUpperCase()}
                </span>
              )}
              <span className="truncate text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                {brandLabel}
              </span>
            </a>
          </div>

          <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {resolvedLinks.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                className={`relative rounded-xl px-3 py-2 text-sm font-medium outline-none transition-[color,background-color,transform] duration-200 motion-safe:hover:-translate-y-px ${
                  link.isActive
                    ? 'bg-violet-500/15 text-violet-700 dark:text-violet-300'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100'
                }`}
                aria-current={link.isActive ? 'page' : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden min-w-0 flex-[1.25] md:block md:max-w-md">
            <form
              className="relative w-full"
              onSubmit={(e) => {
                e.preventDefault()
                const fd = new FormData(e.currentTarget)
                submitDesktopSearch(String(fd.get('q') ?? ''))
              }}
              role="search"
            >
              <label
                htmlFor={desktopSearchId}
                className="sr-only"
              >
                Search
              </label>
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
                id={desktopSearchId}
                name="q"
                type="search"
                placeholder={searchPlaceholder}
                className="w-full rounded-xl border border-neutral-200/80 bg-neutral-50/90 py-2.5 pl-10 pr-3 text-sm text-neutral-900 outline-none ring-violet-500/0 transition-[box-shadow,border-color,background-color] duration-200 placeholder:text-neutral-400 focus:border-violet-500/50 focus:bg-white focus:ring-2 focus:ring-violet-500/25 dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-neutral-100 dark:focus:bg-neutral-950"
                autoComplete="off"
              />
            </form>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
            <div className="hidden lg:block">
              <UserDropdown
                user={user}
                actions={userMenuActions}
                isOpen={userMenuOpen}
                onOpenChange={setUserMenuOpen}
                menuId={userMenuId}
                buttonId={userButtonId}
              />
            </div>
          </div>
        </nav>
      </header>

      <MobileMenu
        id={mobileMenuId}
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        brandLabel={brandLabel}
        links={resolvedLinks}
        searchPlaceholder={searchPlaceholder}
        onSearch={onSearch}
        user={user}
        userMenuActions={userMenuActions}
      />
    </>
  )
}
