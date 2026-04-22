import { useId, type InputHTMLAttributes } from 'react'

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  hint?: string
  error?: string
  id?: string
  inputClassName?: string
}

export function TextField({
  label,
  hint,
  error,
  id: idProp,
  className = '',
  inputClassName = '',
  required,
  ...inputProps
}: TextFieldProps) {
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
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        aria-required={required}
        required={required}
        className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none ring-violet-500/0 transition-[border-color,box-shadow] placeholder:text-neutral-400 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/25 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500 ${error ? 'border-red-500 dark:border-red-500' : 'border-neutral-200 dark:border-neutral-700'} ${inputClassName}`}
        {...inputProps}
      />
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
