import { RatingStars } from './RatingStars'
import type { ProductCardProps } from './types'

function formatPrice(amount: number, currency = 'USD') {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
    }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

export function ProductCard({ product, onAddToCart, className = '' }: ProductCardProps) {
  const {
    title,
    description,
    price,
    currency,
    imageUrl,
    imageAlt,
    rating,
    reviewCount,
  } = product

  const cartLabel = `Add ${title} to cart`

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm ring-1 ring-transparent transition-[transform,box-shadow,ring-color] duration-300 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.02] motion-safe:hover:shadow-lg motion-reduce:transition-none dark:border-neutral-800 dark:bg-neutral-900/50 dark:ring-neutral-800 motion-safe:hover:dark:ring-violet-500/30 ${className}`}
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={imageUrl}
          alt={imageAlt}
          width={400}
          height={400}
          loading="lazy"
          decoding="async"
          className="size-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-105 motion-reduce:transition-none"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-1 flex-col gap-2 text-left">
          <h2 className="text-lg font-semibold leading-snug tracking-tight text-neutral-900 dark:text-neutral-100">
            {title}
          </h2>
          <p className="line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        </div>
        <RatingStars
          rating={rating}
          reviewCount={reviewCount}
          idPrefix={`product-${product.id}`}
        />
        <div className="mt-auto flex flex-col gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xl font-semibold tabular-nums text-neutral-900 dark:text-neutral-50">
            <span className="sr-only">Price: </span>
            {formatPrice(price, currency)}
          </p>
          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            className="inline-flex min-h-11 min-w-[44px] items-center justify-center rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm outline-none transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-violet-700 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-safe:active:scale-[0.98] dark:focus-visible:ring-offset-neutral-950"
            aria-label={cartLabel}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}
