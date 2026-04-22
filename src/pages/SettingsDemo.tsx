import { SettingsPanel } from '../components/settings'

export function SettingsDemo() {
  return (
    <div
      id="settings-demo"
      className="scroll-mt-24 border-t border-neutral-200 bg-neutral-50 py-10 dark:border-neutral-800 dark:bg-neutral-950 sm:scroll-mt-28 sm:py-14"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-4xl lg:px-8">
        <SettingsPanel />
      </div>
    </div>
  )
}
