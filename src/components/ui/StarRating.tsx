import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/cn'

type Size = 'sm' | 'md' | 'lg'
const PX: Record<Size, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
}

interface Props {
  value: number
  onChange?: (v: number) => void
  size?: Size
  className?: string
}

/** Display or input star rating (interactive when `onChange` is provided). */
export function StarRating({ value, onChange, size = 'md', className }: Props) {
  const [hover, setHover] = useState(0)
  const interactive = Boolean(onChange)
  const shown = hover || value

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          aria-label={`${i} star${i > 1 ? 's' : ''}`}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => onChange?.(i)}
          className={cn(interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default')}
        >
          <Star className={cn(PX[size], i <= shown ? 'fill-warn text-warn' : 'fill-transparent text-ink/25')} />
        </button>
      ))}
    </div>
  )
}
