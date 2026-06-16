import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Sparkles } from 'lucide-react'
import { useReviewsStore } from '@/state/useReviewsStore'
import { feedbackMailto } from '@/lib/contact'
import { StarRating } from './StarRating'

const SEEN_KEY = 'rigforge.feedbackSeen'
const DELAY_MS = 14_000

/** Gentle, once-per-browser prompt inviting a rating or an email suggestion. */
export function FeedbackPopup() {
  const [show, setShow] = useState(false)
  const openModal = useReviewsStore((s) => s.openModal)

  useEffect(() => {
    try {
      if (localStorage.getItem(SEEN_KEY)) return
    } catch {
      /* ignore */
    }
    const timer = setTimeout(() => {
      setShow(true)
      try {
        localStorage.setItem(SEEN_KEY, '1')
      } catch {
        /* ignore */
      }
    }, DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  const rate = (r: number) => {
    setShow(false)
    openModal(r)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="fixed bottom-5 right-5 z-[75] w-[min(92vw,22rem)] rounded-2xl border border-ink/12 bg-ink-850 p-5 shadow-xl"
        >
          <button
            onClick={() => setShow(false)}
            className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-ink/5 hover:text-fg"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="font-display text-base font-semibold text-fg">Enjoying RigForge?</h3>
          </div>
          <p className="mt-1.5 text-sm text-fg-muted">
            Tap a star to rate it — or send us an idea to make it better.
          </p>

          <div className="mt-3">
            <StarRating value={0} onChange={rate} size="lg" />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <a
              href={feedbackMailto()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-ink/12 px-3 py-2 text-sm font-semibold text-fg transition-colors hover:bg-ink/5"
            >
              <Mail className="h-4 w-4" /> Suggest improvements
            </a>
            <button
              onClick={() => setShow(false)}
              className="text-sm text-fg-muted transition-colors hover:text-fg"
            >
              Not now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
