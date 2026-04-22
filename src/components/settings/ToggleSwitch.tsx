import { useId } from 'react'

export interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  disabled?: boolean
  /** Optional id for the switch (defaults to generated id). */
  id?: string
  className?: string
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  id: idProp,
  className = '',
}: ToggleSwitchProps) {
  const genId = useId()
  const baseId = idProp ?? genId
  const labelId = `${baseId}-label`
  const descId = `${baseId}-desc`

  return (
    <div
      className={`flex gap-4 sm:items-center sm:justify-between ${className}`}
    >
      <div className="min-w-0 flex-1">
        <p
          id={labelId}
          className="text-sm font-medium text-neutral-900 dark:text-neutral-100"
        >
          {label}
        </p>
        {description ? (
          <p
            id={descId}
            className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400"
          >
            {description}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        id={baseId}
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={description ? descId : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-neutral-200 bg-neutral-200 p-0.5 outline-none transition-[background-color,border-color,box-shadow] duration-200 ease-out after:absolute after:left-0.5 after:top-0.5 after:size-6 after:rounded-full after:bg-white after:shadow after:transition-transform after:duration-200 after:ease-out after:content-[''] focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white enabled:hover:border-neutral-300 enabled:hover:bg-neutral-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-700 dark:after:bg-neutral-100 dark:enabled:hover:border-neutral-500 dark:enabled:hover:bg-neutral-600 dark:focus-visible:ring-offset-neutral-950 aria-checked:border-violet-600/50 aria-checked:bg-violet-600 aria-checked:after:translate-x-5 aria-checked:enabled:hover:bg-violet-500 dark:aria-checked:border-violet-500/50 dark:aria-checked:bg-violet-600 dark:aria-checked:enabled:hover:bg-violet-500"
      />
    </div>
  )
}
