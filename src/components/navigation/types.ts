import type { ReactNode } from 'react'

export interface NavigationLink {
  label: string
  href: string
  /** Marks the current page for styling and `aria-current`. */
  isActive?: boolean
}

export interface UserProfile {
  name: string
  email: string
  avatarUrl?: string
}

export interface UserMenuAction {
  id: string
  label: string
  href?: string
  onSelect?: () => void
  destructive?: boolean
}

export interface NavbarProps {
  brandLabel: string
  homeHref?: string
  logo?: ReactNode
  links: NavigationLink[]
  user: UserProfile
  userMenuActions: UserMenuAction[]
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  navAriaLabel?: string
  className?: string
}

export interface UserDropdownProps {
  user: UserProfile
  actions: UserMenuAction[]
  /** Controlled open state from parent (e.g. closes when mobile menu opens). */
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  menuId: string
  buttonId: string
}

export interface MobileMenuProps {
  id: string
  isOpen: boolean
  onClose: () => void
  brandLabel: string
  links: NavigationLink[]
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  user: UserProfile
  userMenuActions: UserMenuAction[]
}
