import { AnalyticsDashboard } from '../components/analytics'

export function AnalyticsDashboardDemo() {
  return (
    <div
      id="analytics-dashboard"
      className="scroll-mt-24 border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 sm:scroll-mt-28"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <AnalyticsDashboard />
      </div>
    </div>
  )
}
