import { create } from 'zustand'

export interface Review {
  id: string
  name: string
  rating: number
  comment: string
  createdAt: number
}

const DAY = 86_400_000

/** Seed reviews so the section is never empty (always shown alongside saved ones). */
export const SAMPLE_REVIEWS: Review[] = [
  {
    id: 's1',
    name: 'Marcus T.',
    rating: 5,
    comment:
      'Finally a part picker that catches clearance and wattage issues before I buy. Watching the 3D build fill in as I choose parts is genuinely useful.',
    createdAt: Date.now() - DAY * 3,
  },
  {
    id: 's2',
    name: 'Priya N.',
    rating: 5,
    comment:
      'The budget optimizer nailed a 1440p build for my exact number in one click. Compatibility flags saved me from a DDR4/DDR5 mix-up.',
    createdAt: Date.now() - DAY * 7,
  },
  {
    id: 's3',
    name: 'Sofia R.',
    rating: 5,
    comment:
      'Switched currency to INR and every price just converted. Shared my build with a friend via the link — super smooth, no account needed.',
    createdAt: Date.now() - DAY * 1,
  },
  {
    id: 's4',
    name: 'Dän K.',
    rating: 4,
    comment:
      'Love the editorial look and the realtime prices. Would like even more case options, but the wattage gauge is spot on.',
    createdAt: Date.now() - DAY * 12,
  },
]

const KEY = 'rigforge.reviews.v1'

function load(): Review[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Review[]) : []
  } catch {
    return []
  }
}

function save(reviews: Review[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(reviews))
  } catch {
    /* storage unavailable */
  }
}

interface ReviewsStore {
  reviews: Review[]
  modalOpen: boolean
  prefillRating: number
  add: (name: string, rating: number, comment: string) => void
  openModal: (rating?: number) => void
  closeModal: () => void
}

export const useReviewsStore = create<ReviewsStore>((set, get) => ({
  reviews: load(),
  modalOpen: false,
  prefillRating: 0,
  add: (name, rating, comment) => {
    const review: Review = {
      id: `r_${Date.now().toString(36)}`,
      name: name.trim() || 'Anonymous',
      rating,
      comment: comment.trim(),
      createdAt: Date.now(),
    }
    const next = [review, ...get().reviews]
    save(next)
    set({ reviews: next })
  },
  openModal: (rating = 0) => set({ modalOpen: true, prefillRating: rating }),
  closeModal: () => set({ modalOpen: false }),
}))
