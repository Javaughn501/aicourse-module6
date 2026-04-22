import { useCallback, useEffect, useRef, useState } from 'react'
import type { FeedPost, FeedUser } from './types'
import { createSeedPosts } from './constants'
import { CreatePost, type CreatePostPayload } from './CreatePost'
import { PostCard } from './PostCard'

function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`
}

type FeedProps = {
  currentUser: FeedUser
  initialPosts?: FeedPost[]
}

export function Feed({ currentUser, initialPosts }: FeedProps) {
  const [posts, setPosts] = useState<FeedPost[]>(() => initialPosts ?? createSeedPosts())
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [shareHint, setShareHint] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const toggleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p
        const liked = !p.liked
        return {
          ...p,
          liked,
          likeCount: Math.max(0, p.likeCount + (liked ? 1 : -1)),
        }
      }),
    )
  }, [])

  const addComment = useCallback((postId: string, body: string) => {
    const comment = {
      id: newId('c'),
      author: currentUser,
      body,
      createdAt: new Date().toISOString(),
    }
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, comment] } : p)),
    )
  }, [currentUser])

  const sharePost = useCallback((post: FeedPost) => {
    const demo = `${window.location.origin}${window.location.pathname}#post-${post.id}`
    void navigator.clipboard?.writeText(demo).catch(() => {
      /* demo: clipboard may be blocked */
    })
    setShareHint('Share link copied to clipboard (demo).')
    window.setTimeout(() => setShareHint(null), 2600)
  }, [])

  const createPost = useCallback(
    ({ content, imageUrls }: CreatePostPayload) => {
      const post: FeedPost = {
        id: newId('p'),
        author: currentUser,
        content,
        imageUrls,
        likeCount: 0,
        liked: false,
        comments: [],
        createdAt: new Date().toISOString(),
      }
      setPosts((prev) => [post, ...prev])
    },
    [currentUser],
  )

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting)
        if (!hit || loadingMore) return

        setLoadingMore(true)
        /* Placeholder: simulate network delay; no extra pages in demo */
        window.setTimeout(() => {
          setLoadingMore(false)
          setHasMore(false)
        }, 900)
      },
      { rootMargin: '120px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loadingMore])

  return (
    <div className="mx-auto w-full max-w-xl space-y-5 lg:max-w-2xl">
      {shareHint ? (
        <p
          role="status"
          className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center text-sm text-violet-900 dark:border-violet-500/30 dark:bg-violet-950/50 dark:text-violet-100"
        >
          {shareHint}
        </p>
      ) : null}

      <CreatePost currentUser={currentUser} onSubmit={createPost} />

      <ul className="list-none space-y-5 p-0">
        {posts.map((post) => (
          <li key={post.id} id={`post-${post.id}`}>
            <PostCard
              post={post}
              currentUser={currentUser}
              onToggleLike={toggleLike}
              onAddComment={addComment}
              onShare={sharePost}
            />
          </li>
        ))}
      </ul>

      {/* Infinite scroll sentinel — swap the timeout for fetch + append. */}
      <div
        ref={sentinelRef}
        className="flex min-h-14 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50/50 px-4 py-6 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/40 dark:text-neutral-400"
        aria-busy={loadingMore}
      >
        {loadingMore && (
          <span className="inline-flex items-center gap-2 font-medium text-neutral-600 dark:text-neutral-300">
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-violet-600 border-t-transparent dark:border-violet-400"
              aria-hidden
            />
            Loading more…
          </span>
        )}
        {!loadingMore && hasMore && (
          <span>Scroll to load more — placeholder for infinite scroll.</span>
        )}
        {!hasMore && !loadingMore && <span className="text-neutral-400 dark:text-neutral-500">You&apos;re all caught up.</span>}
      </div>
    </div>
  )
}
