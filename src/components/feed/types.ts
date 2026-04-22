export type FeedUser = {
  id: string
  name: string
  handle: string
  avatarUrl: string
}

export type FeedComment = {
  id: string
  author: FeedUser
  body: string
  createdAt: string
}

export type FeedPost = {
  id: string
  author: FeedUser
  content: string
  imageUrls: string[]
  likeCount: number
  liked: boolean
  comments: FeedComment[]
  createdAt: string
}
