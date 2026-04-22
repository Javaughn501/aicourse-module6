import { useId } from 'react'
import type { RatingStarsProps } from './types'

const STAR_PATH =
  'M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6L12 2z'

function clampRating(rating: number, maxStars: number) {
  return Math.min(maxStars, Math.max(0, rating))
}

type StarFill = 'empty' | 'half' | 'full'

function starFillForIndex(index: number, rating: number): StarFill {
  const position = index + 1
  if (rating >= position) return 'full'
  if (rating >= position - 0.5) return 'half'
  return 'empty'
}

function StarGlyph({
  fill,
  clipPathId,
}: {
  fill: StarFill
  clipPathId: string
}) {
  const empty = (
    <path
      d={STAR_PATH}
      fill="currentColor"
      className="text-neutral-200 dark:text-neutral-600"
    />
  )
  const full = (
    <path
      d={STAR_PATH}
      fill="currentColor"
      className="text-amber-400"
    />
  )

  if (fill === 'empty') return empty
  if (fill === 'full') return full

  return (
    <>
      {empty}
      <g clipPath={`url(#${clipPathId})`}>{full}</g>
    </>
  )
}

export function RatingStars({
  rating,
  maxStars = 5,
  reviewCount,
  className = '',
  idPrefix,
}: RatingStarsProps) {
  const generatedId = useId().replace(/:/g, '')
  const baseId = idPrefix ?? generatedId
  const safeRating = clampRating(rating, maxStars)
  const roundedLabel = Math.round(safeRating * 10) / 10

  const reviewSuffix =
    reviewCount != null
      ? `, ${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'}`
      : ''

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 ${className}`}
      role="img"
      aria-label={`${roundedLabel} out of ${maxStars} stars${reviewSuffix}`}
    >
      <span className="sr-only">
        {roundedLabel} out of {maxStars} stars
        {reviewCount != null
          ? `, ${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'}`
          : ''}
      </span>
      <svg
        viewBox="0 0 120 24"
        className="h-5 w-[120px] shrink-0 motion-safe:transition-opacity motion-safe:duration-200"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {Array.from({ length: maxStars }, (_, i) => (
            <clipPath
              key={i}
              id={`${baseId}-half-${i}`}
              clipPathUnits="userSpaceOnUse"
            >
              <rect
                x="0"
                y="0"
                width="12"
                height="24"
              />
            </clipPath>
          ))}
        </defs>
        <g>
          {Array.from({ length: maxStars }, (_, i) => {
            const fill = starFillForIndex(i, safeRating)
            return (
              <g
                key={i}
                transform={`translate(${i * 24} 0)`}
              >
                <StarGlyph
                  fill={fill}
                  clipPathId={`${baseId}-half-${i}`}
                />
              </g>
            )
          })}
        </g>
      </svg>
      {reviewCount != null && (
        <span
          className="text-sm tabular-nums text-neutral-500 dark:text-neutral-400"
          aria-hidden="true"
        >
          ({reviewCount})
        </span>
      )}
    </div>
  )
}
