import { PenLine } from 'lucide-react'
import { useReviewsStore, SAMPLE_REVIEWS, type Review } from '@/state/useReviewsStore'
import { StarRating } from '@/components/ui/StarRating'

function timeAgo(ts: number): string {
  const d = Math.floor((Date.now() - ts) / 86_400_000)
  if (d <= 0) return 'today'
  if (d === 1) return '1 day ago'
  if (d < 30) return `${d} days ago`
  const m = Math.floor(d / 30)
  return m === 1 ? '1 month ago' : `${m} months ago`
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <div className="flex flex-col rounded-2xl border border-ink/10 bg-ink-850 p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-accent/12 font-display text-sm font-semibold text-accent">
          {r.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-fg">{r.name}</div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-fg-dim">
            {timeAgo(r.createdAt)}
          </div>
        </div>
        <StarRating value={r.rating} size="sm" className="ml-auto" />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-fg-muted">{r.comment}</p>
    </div>
  )
}

export function Reviews() {
  const reviews = useReviewsStore((s) => s.reviews)
  const openModal = useReviewsStore((s) => s.openModal)

  const all = [...reviews, ...SAMPLE_REVIEWS]
  const avg = all.reduce((a, r) => a + r.rating, 0) / all.length

  return (
    <section id="reviews" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="kicker">Reviews</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Loved by <span className="italic font-medium text-accent">builders</span>
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <span className="font-display text-2xl font-semibold tabular-nums text-fg">
              {avg.toFixed(1)}
            </span>
            <StarRating value={Math.round(avg)} />
            <span className="text-sm text-fg-muted">{all.length} reviews · no login needed</span>
          </div>
        </div>

        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-fg px-5 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-accent sm:self-auto"
        >
          <PenLine className="h-4 w-4" /> Write a review
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {all.slice(0, 9).map((r) => (
          <ReviewCard key={r.id} r={r} />
        ))}
      </div>
    </section>
  )
}
