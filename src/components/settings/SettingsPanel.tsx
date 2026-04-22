import { useId, useState, type FormEvent } from 'react'
import { SelectField } from './form/SelectField'
import { TextAreaField } from './form/TextAreaField'
import { TextField } from './form/TextField'
import { SettingsTabs } from './SettingsTabs'
import { ToggleSwitch } from './ToggleSwitch'
import type { SettingsTabDef, SettingsTabId } from './types'

const TABS: readonly SettingsTabDef[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'appearance', label: 'Appearance' },
] as const

const PANEL_PREFIX = 'settings-panel'

export interface SettingsPanelProps {
  className?: string
}

export function SettingsPanel({ className = '' }: SettingsPanelProps) {
  const formId = useId().replace(/:/g, '')
  const statusId = `${formId}-status`

  const [activeTab, setActiveTab] = useState<SettingsTabId>('profile')
  const [statusMessage, setStatusMessage] = useState('')

  const [displayName, setDisplayName] = useState('Alex Morgan')
  const [email, setEmail] = useState('alex@example.com')
  const [bio, setBio] = useState('Designer and coffee enthusiast.')
  const [jobTitle, setJobTitle] = useState('designer')

  const [emailProducts, setEmailProducts] = useState(true)
  const [pushOrders, setPushOrders] = useState(true)
  const [smsRare, setSmsRare] = useState(false)
  const [digest, setDigest] = useState('weekly')

  const [profileVisibility, setProfileVisibility] = useState('signed-in')
  const [activityStatus, setActivityStatus] = useState(true)
  const [dataSharing, setDataSharing] = useState(false)

  const [density, setDensity] = useState('comfortable')
  const [reducedMotionUi, setReducedMotionUi] = useState(false)
  const [colorScheme, setColorScheme] = useState('system')

  const announce = (msg: string) => {
    setStatusMessage('')
    window.requestAnimationFrame(() => setStatusMessage(msg))
  }

  const handleSave = (e: FormEvent, label: string) => {
    e.preventDefault()
    announce(`${label} saved.`)
  }

  return (
    <section
      className={`rounded-2xl border border-neutral-200/90 bg-white/90 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80 dark:ring-white/10 ${className}`}
      aria-labelledby={`${formId}-heading`}
    >
      <div className="border-b border-neutral-200 px-4 py-5 sm:px-6 dark:border-neutral-800">
        <h2
          id={`${formId}-heading`}
          className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
        >
          Settings
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Manage your profile, alerts, privacy, and display preferences.
        </p>
        <div
          id={statusId}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="mt-3 min-h-5 text-sm font-medium text-violet-700 dark:text-violet-300"
        >
          {statusMessage}
        </div>
      </div>

      <SettingsTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        panelIdPrefix={PANEL_PREFIX}
        className="px-4 sm:px-6"
      />

      <div className="p-4 sm:p-6">
        <div
          id={`${PANEL_PREFIX}-profile`}
          role="tabpanel"
          aria-labelledby="tab-profile"
          hidden={activeTab !== 'profile'}
        >
          {activeTab === 'profile' ? (
            <form
              className="space-y-6"
              onSubmit={(e) => handleSave(e, 'Profile')}
              noValidate
            >
              <fieldset className="space-y-4 border-0 p-0">
                <legend className="mb-2 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  Profile details
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="Display name"
                    name="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    hint="Used for sign-in and order updates."
                  />
                </div>
                <SelectField
                  label="Role"
                  name="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  options={[
                    { value: 'designer', label: 'Designer' },
                    { value: 'developer', label: 'Developer' },
                    { value: 'manager', label: 'Manager' },
                    { value: 'other', label: 'Other' },
                  ]}
                  hint="Helps us tailor tips in your dashboard."
                />
                <TextAreaField
                  label="Bio"
                  name="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  hint="Short description visible on your public profile if enabled."
                />
              </fieldset>
              <div className="flex flex-wrap gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm outline-none transition-[background-color,transform,box-shadow] duration-200 hover:bg-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.99] dark:focus-visible:ring-offset-neutral-950"
                >
                  Save profile
                </button>
                <button
                  type="reset"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-800 outline-none transition-colors hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus-visible:ring-offset-neutral-950"
                  onClick={() => {
                    setDisplayName('Alex Morgan')
                    setEmail('alex@example.com')
                    setBio('Designer and coffee enthusiast.')
                    setJobTitle('designer')
                    announce('Profile form reset.')
                  }}
                >
                  Reset
                </button>
              </div>
            </form>
          ) : null}
        </div>

        <div
          id={`${PANEL_PREFIX}-notifications`}
          role="tabpanel"
          aria-labelledby="tab-notifications"
          hidden={activeTab !== 'notifications'}
        >
          {activeTab === 'notifications' ? (
            <form
              className="space-y-6"
              onSubmit={(e) => handleSave(e, 'Notification preferences')}
            >
              <fieldset className="space-y-0 border-0 p-0">
                <legend className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  Channels
                </legend>
                <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
                  <li className="p-4">
                    <ToggleSwitch
                      label="Product recommendations"
                      description="Occasional emails with items based on your activity."
                      checked={emailProducts}
                      onChange={setEmailProducts}
                    />
                  </li>
                  <li className="p-4">
                    <ToggleSwitch
                      label="Order updates (push)"
                      description="Shipment and delivery alerts on this device."
                      checked={pushOrders}
                      onChange={setPushOrders}
                    />
                  </li>
                  <li className="p-4">
                    <ToggleSwitch
                      label="SMS for urgent issues only"
                      description="Rare texts for security or delivery problems."
                      checked={smsRare}
                      onChange={setSmsRare}
                    />
                  </li>
                </ul>
              </fieldset>
              <SelectField
                label="Email digest"
                name="digest"
                value={digest}
                onChange={(e) => setDigest(e.target.value)}
                options={[
                  { value: 'off', label: 'Off' },
                  { value: 'daily', label: 'Daily summary' },
                  { value: 'weekly', label: 'Weekly digest' },
                ]}
                hint="How often we send non-urgent activity summaries."
              />
              <div className="flex flex-wrap gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm outline-none transition-[background-color,transform] duration-200 hover:bg-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.99] dark:focus-visible:ring-offset-neutral-950"
                >
                  Save notifications
                </button>
              </div>
            </form>
          ) : null}
        </div>

        <div
          id={`${PANEL_PREFIX}-privacy`}
          role="tabpanel"
          aria-labelledby="tab-privacy"
          hidden={activeTab !== 'privacy'}
        >
          {activeTab === 'privacy' ? (
            <form
              className="space-y-6"
              onSubmit={(e) => handleSave(e, 'Privacy settings')}
            >
              <SelectField
                label="Who can see your profile"
                name="profileVisibility"
                value={profileVisibility}
                onChange={(e) => setProfileVisibility(e.target.value)}
                options={[
                  { value: 'public', label: 'Everyone' },
                  { value: 'signed-in', label: 'Signed-in users only' },
                  { value: 'private', label: 'Only you' },
                ]}
              />
              <fieldset className="space-y-0 border-0 p-0">
                <legend className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  Data & personalization
                </legend>
                <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
                  <li className="p-4">
                    <ToggleSwitch
                      label="Show activity status"
                      description="Let teammates see when you are likely available."
                      checked={activityStatus}
                      onChange={setActivityStatus}
                    />
                  </li>
                  <li className="p-4">
                    <ToggleSwitch
                      label="Share usage analytics"
                      description="Helps us improve performance (no sale of personal data)."
                      checked={dataSharing}
                      onChange={setDataSharing}
                    />
                  </li>
                </ul>
              </fieldset>
              <div className="flex flex-wrap gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm outline-none transition-[background-color,transform] duration-200 hover:bg-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.99] dark:focus-visible:ring-offset-neutral-950"
                >
                  Save privacy
                </button>
              </div>
            </form>
          ) : null}
        </div>

        <div
          id={`${PANEL_PREFIX}-appearance`}
          role="tabpanel"
          aria-labelledby="tab-appearance"
          hidden={activeTab !== 'appearance'}
        >
          {activeTab === 'appearance' ? (
            <form
              className="space-y-6"
              onSubmit={(e) => handleSave(e, 'Appearance')}
            >
              <SelectField
                label="Interface density"
                name="density"
                value={density}
                onChange={(e) => setDensity(e.target.value)}
                options={[
                  { value: 'comfortable', label: 'Comfortable (default)' },
                  { value: 'compact', label: 'Compact' },
                ]}
                hint="Adjusts spacing in lists and forms."
              />
              <SelectField
                label="Color scheme"
                name="colorScheme"
                value={colorScheme}
                onChange={(e) => setColorScheme(e.target.value)}
                options={[
                  { value: 'system', label: 'Match system' },
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                ]}
                hint="Requires theme wiring in your app root (class on html)."
              />
              <ToggleSwitch
                label="Prefer reduced motion in UI"
                description="Minimizes transitions and animations in supported surfaces."
                checked={reducedMotionUi}
                onChange={setReducedMotionUi}
              />
              <div className="flex flex-wrap gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm outline-none transition-[background-color,transform] duration-200 hover:bg-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.99] dark:focus-visible:ring-offset-neutral-950"
                >
                  Save appearance
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </section>
  )
}
