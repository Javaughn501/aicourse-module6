import { useState } from 'react'
import type { FeedPost, FeedUser } from './types'
import { formatRelativeTime } from './formatTime'
import { CommentSection } from './CommentSection'
import { UserAvatar } from './UserAvatar'

type PostCardProps = {
  post: FeedPost
  currentUser: FeedUser
  onToggleLike: (postId: string) => void
  onAddComment: (postId: string, body: string) => void
  onShare: (post: FeedPost) => void
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`h-5 w-5 ${filled ? 'text-rose-500' : 'text-neutral-500 dark:text-neutral-400'}`}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.935-2.186 2.25 2.25 0 00-3.935 2.186z"
      />
    </svg>
  )
}

export function PostCard({ post, currentUser, onToggleLike, onAddComment, onShare }: PostCardProps) {
  const [showComments, setShowComments] = useState(true)

  const gridClass =
    post.imageUrls.length === 0
      ? ''
      : post.imageUrls.length === 1
        ? 'grid grid-cols-1'
        : 'grid grid-cols-2 gap-1 sm:gap-1.5'

  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="p-4 sm:p-5">
        <header className="flex gap-3">
          <UserAvatar user={post.author} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
              <h2 className="font-semibold text-neutral-900 dark:text-neutral-50">{post.author.name}</h2>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">@{post.author.handle}</span>
              <span className="text-neutral-300 dark:text-neutral-600">·</span>
              <time className="text-sm text-neutral-400 dark:text-neutral-500" dateTime={post.createdAt}>
                {formatRelativeTime(post.createdAt)}
              </time>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-neutral-800 dark:text-neutral-200">
              {post.content}
            </p>
          </div>
        </header>

        {post.imageUrls.length > 0 && (
          <div className={`mt-4 ${gridClass} overflow-hidden rounded-xl ring-1 ring-neutral-200/80 dark:ring-neutral-700`}>
            {post.imageUrls.map((url, i) => (
              <img
                key={`${url}-${i}`}
                src={url}
                alt=""
                className={`max-h-80 w-full object-cover ${post.imageUrls.length > 1 ? 'aspect-square sm:aspect-[4/3]' : 'max-h-96'}`}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-1 border-t border-neutral-100 pt-3 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => onToggleLike(post.id)}
            aria-pressed={post.liked}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition hover:bg-rose-500/10 ${post.liked ? 'text-rose-600 dark:text-rose-400' : 'text-neutral-600 dark:text-neutral-300'}`}
          >
            <HeartIcon filled={post.liked} />
            <span>{post.likeCount}</span>
            <span className="sr-only">{post.liked ? 'Unlike' : 'Like'} post</span>
          </button>

          <button
            type="button"
            onClick={() => setShowComments((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <CommentIcon />
            <span>{post.comments.length}</span>
            <span className="hidden sm:inline">{showComments ? 'Hide' : 'Show'} comments</span>
          </button>

          <button
            type="button"
            onClick={() => onShare(post)}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <ShareIcon />
            <span>Share</span>
            <span className="sr-only">Share post (demo)</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="bg-neutral-50/80 px-4 pb-1 sm:px-5 dark:bg-neutral-950/50">
          <CommentSection
            postId={post.id}
            comments={post.comments}
            currentUser={currentUser}
            onAddComment={onAddComment}
          />
        </div>
      )}
    </article>
  )
}
