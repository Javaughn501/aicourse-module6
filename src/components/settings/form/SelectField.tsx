import { useId, type SelectHTMLAttributes } from 'react'

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string
  options: SelectOption[]
  hint?: string
  error?: string
  id?: string
  selectClassName?: string
}

export function SelectField({
  label,
  options,
  hint,
  error,
  id: idProp,
  className = '',
  selectClassName = '',
  required,
  ...selectProps
}: SelectFieldProps) {
  const genId = useId()
  const id = idProp ?? genId
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-neutral-900 dark:text-neutral-100"
      >
        {label}
        {required ? (
          <span className="ms-1 text-red-600 dark:text-red-400">*</span>
        ) : null}
      </label>
      {hint ? (
        <p
          id={hintId}
          className="mb-2 text-sm text-neutral-500 dark:text-neutral-400"
        >
          {hint}
        </p>
      ) : null}
      <div className="relative">
        <select
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          aria-required={required}
          required={required}
          className={`w-full appearance-none rounded-xl border bg-white py-2.5 pl-3 pr-10 text-sm text-neutral-900 outline-none ring-violet-500/0 transition-[border-color,box-shadow] focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/25 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-neutral-950 dark:text-neutral-100 ${error ? 'border-red-500 dark:border-red-500' : 'border-neutral-200 dark:border-neutral-700'} ${selectClassName}`}
          {...selectProps}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
            >
              {opt.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400"
          aria-hidden
        >
          <svg
            className="size-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}
