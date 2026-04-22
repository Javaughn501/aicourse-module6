import { Feed } from '../components/feed'
import type { FeedUser } from '../components/feed'

const CURRENT_USER: FeedUser = {
  id: 'me',
  name: 'Alex Morgan',
  handle: 'alexm',
  avatarUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&facepad=2&crop=face',
}

export function FeedDemo() {
  return (
    <div
      id="social-feed"
      className="scroll-mt-24 border-t border-neutral-200 bg-neutral-100 py-10 dark:border-neutral-800 dark:bg-neutral-950 sm:scroll-mt-28 sm:py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Social feed</h1>
          <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
            A compact timeline with likes, threaded comments, and a placeholder infinite scroll.
          </p>
        </header>
        <Feed currentUser={CURRENT_USER} />
      </div>
    </div>
  )
}
