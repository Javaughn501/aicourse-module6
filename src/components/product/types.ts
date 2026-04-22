export interface Product {
  id: string
  title: string
  description: string
  price: number
  currency?: string
  category?: string
  imageUrl: string
  imageAlt: string
  rating: number
  reviewCount?: number
}

export interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  className?: string
}

export interface RatingStarsProps {
  /** Average rating from 0 to `maxStars`. */
  rating: number
  maxStars?: number
  reviewCount?: number
  className?: string
  /** Unique id prefix for SVG defs when multiple instances exist on one page. */
  idPrefix?: string
}
