import { MultiStepRegistrationForm } from '../components/registration'

export function RegistrationDemo() {
  return (
    <div
      id="registration-demo"
      className="scroll-mt-24 border-t border-neutral-200 bg-neutral-100 py-12 dark:border-neutral-800 dark:bg-neutral-950 sm:scroll-mt-28 sm:py-16"
    >
      <div className="mx-auto max-w-lg px-4 sm:px-6">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Create an account</h1>
        <p className="mb-8 text-sm text-neutral-600 dark:text-neutral-400">
          Multi-step registration with validation. Use <code className="rounded bg-neutral-200 px-1 text-xs dark:bg-neutral-800">?simulateRegistrationError=1</code> to demo a submit error.
        </p>
        <MultiStepRegistrationForm />
      </div>
    </div>
  )
}
