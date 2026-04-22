import { useId, useState, type FormEvent } from 'react'
import type { FeedComment, FeedUser } from './types'
import { formatRelativeTime } from './formatTime'
import { UserAvatar } from './UserAvatar'

type CommentSectionProps = {
  postId: string
  comments: FeedComment[]
  currentUser: FeedUser
  onAddComment: (postId: string, body: string) => void
}

export function CommentSection({ postId, comments, currentUser, onAddComment }: CommentSectionProps) {
  const formId = useId()
  const [body, setBody] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const text = body.trim()
    if (!text) return
    onAddComment(postId, text)
    setBody('')
  }

  return (
    <div className="border-t border-neutral-100 dark:border-neutral-800">
      <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {comments.map((c) => (
          <li key={c.id} className="flex gap-3 py-3 first:pt-4">
            <UserAvatar user={c.author} size="sm" className="mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{c.author.name}</span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">@{c.author.handle}</span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500">{formatRelativeTime(c.createdAt)}</span>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-[15px] leading-snug text-neutral-800 dark:text-neutral-200">
                {c.body}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={submit} className="flex gap-3 py-4">
        <UserAvatar user={currentUser} size="sm" className="mt-1 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor={`${formId}-reply`} className="sr-only">
            Write a comment
          </label>
          <input
            id={`${formId}-reply`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a comment…"
            className="min-w-0 flex-1 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-violet-500/50 focus:bg-white focus:ring-2 focus:ring-violet-500/15 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:bg-neutral-900"
          />
          <button
            type="submit"
            disabled={!body.trim()}
            className="shrink-0 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
          >
            Reply
          </button>
        </div>
      </form>
    </div>
  )
}
