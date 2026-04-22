import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ className = '', children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-lg border border-violet-500/50 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-700 transition-colors hover:border-violet-500 hover:bg-violet-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 dark:text-violet-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
