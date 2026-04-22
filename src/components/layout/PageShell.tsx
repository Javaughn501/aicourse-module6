import type { ReactNode } from 'react'

type PageShellProps = {
  children: ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col border-x border-neutral-200 bg-white px-6 py-12 text-neutral-800 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
      {children}
    </div>
  )
}
