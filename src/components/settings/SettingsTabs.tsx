import type { SettingsTabDef, SettingsTabId } from './types'

export interface SettingsTabsProps {
  tabs: readonly SettingsTabDef[]
  activeTab: SettingsTabId
  onTabChange: (id: SettingsTabId) => void
  /** Prefix for `aria-controls` / tabpanel ids (default `settings-panel`). */
  panelIdPrefix?: string
  className?: string
}

export function SettingsTabs({
  tabs,
  activeTab,
  onTabChange,
  panelIdPrefix = 'settings-panel',
  className = '',
}: SettingsTabsProps) {
  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      const next = tabs[(index + 1) % tabs.length]
      if (next) {
        onTabChange(next.id)
        window.requestAnimationFrame(() => document.getElementById(`tab-${next.id}`)?.focus())
      }
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      const next = tabs[(index - 1 + tabs.length) % tabs.length]
      if (next) {
        onTabChange(next.id)
        window.requestAnimationFrame(() => document.getElementById(`tab-${next.id}`)?.focus())
      }
    }
    if (e.key === 'Home') {
      e.preventDefault()
      const first = tabs[0]
      if (first) {
        onTabChange(first.id)
        window.requestAnimationFrame(() => document.getElementById(`tab-${first.id}`)?.focus())
      }
    }
    if (e.key === 'End') {
      e.preventDefault()
      const last = tabs[tabs.length - 1]
      if (last) {
        onTabChange(last.id)
        window.requestAnimationFrame(() => document.getElementById(`tab-${last.id}`)?.focus())
      }
    }
  }

  return (
    <div
      className={`border-b border-neutral-200 dark:border-neutral-800 ${className}`}
    >
      <div
        role="tablist"
        aria-label="Settings sections"
        className="-mb-px flex gap-1 overflow-x-auto pb-px sm:gap-2"
      >
        {tabs.map((tab, index) => {
          const selected = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${panelIdPrefix}-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={`shrink-0 rounded-t-xl border border-transparent px-3 py-2.5 text-sm font-medium outline-none transition-[color,background-color,border-color,box-shadow] duration-200 sm:px-4 ${
                selected
                  ? 'border-neutral-200 border-b-white bg-white text-violet-700 shadow-sm dark:border-neutral-800 dark:border-b-neutral-950 dark:bg-neutral-950 dark:text-violet-400'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100'
              } focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 dark:focus-visible:ring-offset-neutral-950`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
