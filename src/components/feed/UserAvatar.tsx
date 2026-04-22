import type { FeedUser } from './types'

const sizeClasses = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-14 w-14 text-base',
} as const

type UserAvatarProps = {
  user: Pick<FeedUser, 'name' | 'avatarUrl'>
  size?: keyof typeof sizeClasses
  className?: string
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

export function UserAvatar({ user, size = 'md', className = '' }: UserAvatarProps) {
  const { name, avatarUrl } = user
  const dim = sizeClasses[size]

  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-full bg-neutral-200 ring-2 ring-white dark:bg-neutral-700 dark:ring-neutral-900 ${dim} ${className}`}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-semibold text-neutral-600 dark:text-neutral-200">
          {initials(name)}
        </span>
      )}
    </span>
  )
}
