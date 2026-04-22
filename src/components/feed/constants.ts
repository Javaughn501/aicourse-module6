import type { FeedPost, FeedUser } from './types'

export const DEMO_USERS: FeedUser[] = [
  {
    id: 'u1',
    name: 'Jordan Lee',
    handle: 'jordanlee',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop',
  },
  {
    id: 'u2',
    name: 'Sam Rivera',
    handle: 'samrivera',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face',
  },
  {
    id: 'u3',
    name: 'Priya Shah',
    handle: 'priyashah',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&crop=face',
  },
]

function iso(minsAgo: number) {
  return new Date(Date.now() - minsAgo * 60_000).toISOString()
}

export function createSeedPosts(): FeedPost[] {
  const [jordan, sam, priya] = DEMO_USERS
  return [
    {
      id: 'p1',
      author: jordan,
      content:
        'Shipped a big refactor today — the feed feels snappier and the bundle is smaller. Thanks to everyone who reviewed!',
      imageUrls: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
        'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80',
      ],
      likeCount: 128,
      liked: false,
      comments: [
        {
          id: 'c1',
          author: sam,
          body: 'Congrats! Can’t wait to try it.',
          createdAt: iso(12),
        },
        {
          id: 'c2',
          author: priya,
          body: 'Nice work on perf — those numbers look great.',
          createdAt: iso(8),
        },
      ],
      createdAt: iso(45),
    },
    {
      id: 'p2',
      author: sam,
      content: 'Golden hour from the rooftop. Sometimes you need to step away from the keyboard.',
      imageUrls: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80'],
      likeCount: 89,
      liked: true,
      comments: [
        {
          id: 'c3',
          author: jordan,
          body: 'That sky 😮',
          createdAt: iso(120),
        },
      ],
      createdAt: iso(180),
    },
    {
      id: 'p3',
      author: priya,
      content:
        'Reminder: accessibility is not a polish pass. Bake it in from the first sketch. Small checklist in thread 👇',
      imageUrls: [],
      likeCount: 256,
      liked: false,
      comments: [],
      createdAt: iso(360),
    },
  ]
}
