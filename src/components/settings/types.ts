export type SettingsTabId = 'profile' | 'notifications' | 'privacy' | 'appearance'

export const SETTINGS_TAB_IDS: readonly SettingsTabId[] = [
  'profile',
  'notifications',
  'privacy',
  'appearance',
] as const

export interface SettingsTabDef {
  id: SettingsTabId
  label: string
}
