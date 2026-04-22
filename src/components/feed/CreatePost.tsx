import { useId, useState, type FormEvent } from 'react'
import type { FeedUser } from './types'
import { UserAvatar } from './UserAvatar'

export type CreatePostPayload = {
  content: string
  imageUrls: string[]
}

type CreatePostProps = {
  currentUser: FeedUser
  onSubmit: (payload: CreatePostPayload) => void
  placeholder?: string
}

export function CreatePost({
  currentUser,
  onSubmit,
  placeholder = "What's happening?",
}: CreatePostProps) {
  const formId = useId()
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const text = content.trim()
    if (!text) return
    const urls = imageUrl.trim() ? [imageUrl.trim()] : []
    onSubmit({ content: text, imageUrls: urls })
    setContent('')
    setImageUrl('')
  }

  return (
    <article className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-5">
      <form onSubmit={handleSubmit} className="flex gap-3 sm:gap-4">
        <UserAvatar user={currentUser} className="mt-0.5" />
        <div className="min-w-0 flex-1 space-y-3">
          <label htmlFor={`${formId}-content`} className="sr-only">
            Post content
          </label>
          <textarea
            id={`${formId}-content`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder={placeholder}
            className="w-full resize-none rounded-xl border border-transparent bg-neutral-50 px-3 py-2.5 text-[15px] text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-violet-500/40 focus:bg-white focus:ring-2 focus:ring-violet-500/20 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-violet-400/40 dark:focus:bg-neutral-900"
          />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <label htmlFor={`${formId}-image`} className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Image URL (optional)
              </label>
              <input
                id={`${formId}-image`}
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://…"
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/15 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
              />
            </div>
            <button
              type="submit"
              disabled={!content.trim()}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-violet-500 dark:hover:bg-violet-400"
            >
              Post
            </button>
          </div>
        </div>
      </form>
    </article>
  )
}
