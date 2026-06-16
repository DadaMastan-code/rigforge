import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Mail, CheckCircle2 } from 'lucide-react'
import { useReviewsStore } from '@/state/useReviewsStore'
import { feedbackMailto } from '@/lib/contact'
import { StarRating } from './StarRating'

export function ReviewModal() {
  const open = useReviewsStore((s) => s.modalOpen)
  const prefill = useReviewsStore((s) => s.prefillRating)
  const close = useReviewsStore((s) => s.closeModal)
  const add = useReviewsStore((s) => s.add)

  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (open) {
      setRating(prefill)
      setDone(false)
    }
  }, [open, prefill])

  const submit = () => {
    if (rating === 0) return
    add(name, rating, comment)
    setDone(true)
    setName('')
    setComment('')
    setTimeout(close, 1300)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] grid place-items-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-full max-w-md rounded-2xl border border-ink/12 bg-ink-850 p-6 shadow-xl"
          >
            <button
              onClick={close}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-ink/5 hover:text-fg"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {done ? (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle2 className="h-10 w-10 text-ok" />
                <h3 className="mt-3 font-display text-xl font-semibold">Thanks for the review!</h3>
                <p className="mt-1 text-sm text-fg-muted">Your feedback helps RigForge get better.</p>
              </div>
            ) : (
              <>
                <span className="kicker">Your experience</span>
                <h3 className="mt-1 font-display text-2xl font-semibold">Leave a review</h3>
                <p className="mt-1 text-sm text-fg-muted">No account needed — it stays on your device.</p>

                <div className="mt-5">
                  <div className="kicker mb-2">Rating</div>
                  <StarRating value={rating} onChange={setRating} size="lg" />
                </div>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="mt-4 w-full rounded-xl border border-ink/12 bg-ink-900/40 px-3.5 py-2.5 text-sm text-fg outline-none placeholder:text-fg-dim focus:border-accent/50"
                />
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="What did you think? What could be better?"
                  className="mt-2.5 w-full resize-none rounded-xl border border-ink/12 bg-ink-900/40 px-3.5 py-2.5 text-sm text-fg outline-none placeholder:text-fg-dim focus:border-accent/50"
                />

                <button
                  onClick={submit}
                  disabled={rating === 0}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-fg px-4 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-accent disabled:opacity-40"
                >
                  <Send className="h-4 w-4" /> Submit review
                </button>

                <a
                  href={feedbackMailto()}
                  className="mt-3 flex items-center justify-center gap-1.5 text-xs text-fg-muted transition-colors hover:text-accent"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Prefer email? Send improvement ideas directly
                </a>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
