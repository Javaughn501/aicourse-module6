import { useCallback, useId, useMemo, useRef, useState, type FormEvent } from 'react'

const STEP_LABELS = ['Account', 'Profile', 'Confirm'] as const

export type RegistrationFormData = {
  email: string
  password: string
  firstName: string
  lastName: string
}

const initialData: RegistrationFormData = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
}

function validateEmail(v: string): string | null {
  const t = v.trim()
  if (!t) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return 'Enter a valid email address.'
  return null
}

function validatePassword(v: string): string | null {
  if (!v) return 'Password is required.'
  if (v.length < 8) return 'Password must be at least 8 characters.'
  if (!/[A-Za-z]/.test(v)) return 'Password must include at least one letter.'
  if (!/[0-9]/.test(v)) return 'Password must include at least one number.'
  return null
}

function validateName(v: string, label: string): string | null {
  const t = v.trim()
  if (!t) return `${label} is required.`
  if (t.length < 2) return `${label} must be at least 2 characters.`
  return null
}

function shouldFailSubmitFromUrl(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('simulateRegistrationError') === '1'
}

export function MultiStepRegistrationForm() {
  const formId = useId().replace(/:/g, '')
  const [step, setStep] = useState(1)
  const [data, setData] = useState<RegistrationFormData>(() => ({ ...initialData }))
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegistrationFormData, string>>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const submitLock = useRef(false)

  const statusId = `${formId}-status`

  const validateStep1 = useCallback((): boolean => {
    const e = validateEmail(data.email)
    const p = validatePassword(data.password)
    const next: Partial<Record<keyof RegistrationFormData, string>> = {}
    if (e) next.email = e
    if (p) next.password = p
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }, [data.email, data.password])

  const validateStep2 = useCallback((): boolean => {
    const f = validateName(data.firstName, 'First name')
    const l = validateName(data.lastName, 'Last name')
    const next: Partial<Record<keyof RegistrationFormData, string>> = {}
    if (f) next.firstName = f
    if (l) next.lastName = l
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }, [data.firstName, data.lastName])

  const goNext = () => {
    setSubmitError(null)
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) setStep(3)
  }

  const goBack = () => {
    setSubmitError(null)
    setFieldErrors({})
    setStep((s) => Math.max(1, s - 1))
  }

  const performSubmit = useCallback(async () => {
    if (step !== 3 || submitLock.current) return
    submitLock.current = true
    setSubmitError(null)
    setSubmitting(true)

    try {
      await new Promise((r) => setTimeout(r, 400))

      if (shouldFailSubmitFromUrl()) {
        setSubmitError('Registration could not be completed. Please try again later.')
        return
      }

      setSuccess(true)
    } finally {
      submitLock.current = false
      setSubmitting(false)
    }
  }, [step])

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (step === 3) void performSubmit()
  }

  const errorProps = (key: keyof RegistrationFormData) => {
    const msg = fieldErrors[key]
    return {
      'aria-invalid': Boolean(msg) as boolean,
      'aria-describedby': msg ? `${formId}-${key}-error` : undefined,
    }
  }

  const stepAnnouncement = useMemo(
    () => `Step ${step} of 3: ${STEP_LABELS[step - 1]}`,
    [step],
  )

  if (success) {
    return (
      <div
        data-testid="registration-success"
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900/50 dark:bg-emerald-950/40"
      >
        <h2 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100">You are registered</h2>
        <p className="mt-2 text-emerald-800 dark:text-emerald-200">
          Welcome, {data.firstName.trim()}! Check your email at {data.email.trim()} to verify your account.
        </p>
      </div>
    )
  }

  return (
    <form
      data-testid="registration-form"
      onSubmit={onFormSubmit}
      aria-busy={submitting}
      className="space-y-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/80 sm:p-8"
      noValidate
    >
      <nav
        aria-label="Registration progress"
        data-testid="registration-step-nav"
      >
        <ol className="flex flex-wrap gap-2 sm:gap-4">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1
            const current = n === step
            return (
              <li
                key={label}
                className="flex items-center gap-2"
              >
                <span
                  className={`flex size-8 items-center justify-center rounded-full text-sm font-semibold ${
                    current
                      ? 'bg-violet-600 text-white'
                      : n < step
                        ? 'bg-violet-200 text-violet-900 dark:bg-violet-900 dark:text-violet-100'
                        : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                  }`}
                  aria-hidden
                >
                  {n}
                </span>
                <span
                  className={`text-sm font-medium ${current ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'}`}
                  aria-current={current ? 'step' : undefined}
                >
                  {label}
                </span>
              </li>
            )
          })}
        </ol>
      </nav>

      <div
        id={statusId}
        data-testid="registration-step-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only self-start"
      >
        {stepAnnouncement}
      </div>

      {submitError ? (
        <div
          data-testid="registration-submit-error"
          role="alert"
          aria-live="assertive"
          className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-200"
        >
          {submitError}
        </div>
      ) : null}

      {step === 1 ? (
        <fieldset className="space-y-4 border-0 p-0">
          <legend className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Account details</legend>

          <div>
            <label
              htmlFor={`${formId}-email`}
              className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
            >
              Email
            </label>
            <input
              id={`${formId}-email`}
              data-testid="reg-email"
              type="email"
              autoComplete="email"
              value={data.email}
              onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
              {...errorProps('email')}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 aria-invalid:border-red-500 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100"
            />
            {fieldErrors.email ? (
              <p
                id={`${formId}-email-error`}
                data-testid="registration-field-error-email"
                role="alert"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor={`${formId}-password`}
              className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
            >
              Password
            </label>
            <input
              id={`${formId}-password`}
              data-testid="reg-password"
              type="password"
              autoComplete="new-password"
              value={data.password}
              onChange={(e) => setData((d) => ({ ...d, password: e.target.value }))}
              {...errorProps('password')}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 aria-invalid:border-red-500 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100"
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">At least 8 characters with a letter and a number.</p>
            {fieldErrors.password ? (
              <p
                id={`${formId}-password-error`}
                data-testid="registration-field-error-password"
                role="alert"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                {fieldErrors.password}
              </p>
            ) : null}
          </div>
        </fieldset>
      ) : null}

      {step === 2 ? (
        <fieldset className="space-y-4 border-0 p-0">
          <legend className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Your name</legend>

          <div>
            <label
              htmlFor={`${formId}-firstName`}
              className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
            >
              First name
            </label>
            <input
              id={`${formId}-firstName`}
              data-testid="reg-first-name"
              type="text"
              autoComplete="given-name"
              value={data.firstName}
              onChange={(e) => setData((d) => ({ ...d, firstName: e.target.value }))}
              {...errorProps('firstName')}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 aria-invalid:border-red-500 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100"
            />
            {fieldErrors.firstName ? (
              <p
                id={`${formId}-firstName-error`}
                data-testid="registration-field-error-firstName"
                role="alert"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                {fieldErrors.firstName}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor={`${formId}-lastName`}
              className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
            >
              Last name
            </label>
            <input
              id={`${formId}-lastName`}
              data-testid="reg-last-name"
              type="text"
              autoComplete="family-name"
              value={data.lastName}
              onChange={(e) => setData((d) => ({ ...d, lastName: e.target.value }))}
              {...errorProps('lastName')}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 aria-invalid:border-red-500 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100"
            />
            {fieldErrors.lastName ? (
              <p
                id={`${formId}-lastName-error`}
                data-testid="registration-field-error-lastName"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {fieldErrors.lastName}
              </p>
            ) : null}
          </div>
        </fieldset>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Review and submit</h2>
          <dl
            data-testid="registration-summary"
            className="grid gap-2 text-sm"
          >
            <div className="flex justify-between gap-4 border-b border-neutral-100 py-2 dark:border-neutral-800">
              <dt className="text-neutral-500 dark:text-neutral-400">Email</dt>
              <dd className="font-medium text-neutral-900 dark:text-neutral-100">{data.email.trim()}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-neutral-100 py-2 dark:border-neutral-800">
              <dt className="text-neutral-500 dark:text-neutral-400">Name</dt>
              <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                {data.firstName.trim()} {data.lastName.trim()}
              </dd>
            </div>
          </dl>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        {step > 1 ? (
          <button
            type="button"
            data-testid="registration-back"
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200"
            onClick={goBack}
          >
            Previous
          </button>
        ) : null}

        {step < 3 ? (
          <button
            type="button"
            data-testid="registration-next"
            className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-violet-500"
            onClick={goNext}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            data-testid="registration-submit"
            className={`rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-violet-500 ${submitting ? 'pointer-events-none opacity-80' : ''}`}
            aria-busy={submitting}
            onClick={() => void performSubmit()}
          >
            {submitting ? 'Submitting…' : 'Create account'}
          </button>
        )}
      </div>
    </form>
  )
}
