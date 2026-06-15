import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EASE } from '@/lib/motion'
import {
  Share2,
  Save,
  Trash2,
  FolderOpen,
  Check,
  RotateCcw,
  X,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { useBuildStore } from '@/state/useBuildStore'
import { useLiveTotal } from '@/state/useMarketStore'
import {
  buildShareUrl,
  saveBuild,
  listSaved,
  deleteSaved,
  decodeBuild,
  type SavedBuild,
} from '@/engine/share'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { usd } from '@/lib/format'
import { cn } from '@/lib/cn'

const TOTAL_SLOTS = 8

export function SummaryPanel() {
  const build = useBuildStore((s) => s.build)
  const setBuild = useBuildStore((s) => s.setBuild)
  const clear = useBuildStore((s) => s.clear)
  const partCount = useBuildStore((s) => s.partCount)
  const msrpTotal = useBuildStore((s) => s.msrpTotal)
  const liveTotal = useLiveTotal()

  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [saved, setSaved] = useState<SavedBuild[]>(() => listSaved())
  const [showSaved, setShowSaved] = useState(false)

  const savings = Math.round(msrpTotal - liveTotal)

  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(buildShareUrl(build))
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked — URL already reflects the build */
    }
  }

  const onSave = () => {
    setSaved(saveBuild(name, build, Math.round(liveTotal)))
    setName('')
    setSaving(false)
    setShowSaved(true)
  }

  return (
    <div className="glass-strong rounded-2xl p-5">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-fg-dim">
            Live build total
          </div>
          <AnimatedNumber
            value={liveTotal}
            format={usd}
            className="font-display text-4xl font-bold tabular-nums text-fg"
          />
        </div>
        {savings !== 0 && partCount > 0 && (
          <div
            className={cn(
              'flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold',
              savings > 0 ? 'bg-ok/15 text-ok' : 'bg-danger/15 text-danger',
            )}
          >
            {savings > 0 ? (
              <TrendingDown className="h-3.5 w-3.5" />
            ) : (
              <TrendingUp className="h-3.5 w-3.5" />
            )}
            {usd(Math.abs(savings))}
          </div>
        )}
      </div>

      <div className="mt-1 text-xs text-fg-muted">
        MSRP <span className="font-mono text-fg-muted line-through">{usd(msrpTotal)}</span> ·{' '}
        {savings > 0 ? 'below' : savings < 0 ? 'above' : 'at'} list price
      </div>

      {/* completeness */}
      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs text-fg-muted">
          <span>Build progress</span>
          <span className="font-mono text-fg">
            {partCount}/{TOTAL_SLOTS}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/6">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan to-violet"
            initial={false}
            animate={{ width: `${(partCount / TOTAL_SLOTS) * 100}%` }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </div>
      </div>

      {/* actions */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={onShare}
          disabled={partCount === 0}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-violet px-3 py-2.5 text-sm font-semibold text-ink-950 transition-opacity disabled:opacity-40"
        >
          {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          {copied ? 'Link copied' : 'Share'}
        </button>
        <button
          onClick={() => setSaving((v) => !v)}
          disabled={partCount === 0}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 px-3 py-2.5 text-sm font-semibold text-fg transition-colors hover:bg-white/10 disabled:opacity-40"
        >
          <Save className="h-4 w-4" /> Save
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <button
          onClick={() => setShowSaved((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-fg-muted transition-colors hover:text-fg"
        >
          <FolderOpen className="h-3.5 w-3.5" /> Saved builds ({saved.length})
        </button>
        <button
          onClick={clear}
          disabled={partCount === 0}
          className="flex items-center gap-1.5 text-xs text-fg-muted transition-colors hover:text-danger disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      {/* save form */}
      <AnimatePresence>
        {saving && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex gap-2">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSave()}
                placeholder="Name this build…"
                className="min-w-0 flex-1 rounded-lg border border-white/12 bg-ink-900/60 px-3 py-2 text-sm text-fg outline-none placeholder:text-fg-dim focus:border-cyan/50"
              />
              <button
                onClick={onSave}
                className="rounded-lg bg-cyan px-3 py-2 text-sm font-semibold text-ink-950"
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* saved list */}
      <AnimatePresence>
        {showSaved && saved.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2">
              {saved.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-white/8 bg-ink-900/40 px-3 py-2"
                >
                  <button
                    onClick={() => setBuild(decodeBuild(b.code))}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="truncate text-sm font-medium text-fg">{b.name}</div>
                    <div className="font-mono text-[11px] text-fg-dim">{usd(b.total)}</div>
                  </button>
                  <button
                    onClick={() => setSaved(deleteSaved(b.id))}
                    aria-label="Delete saved build"
                    className="grid h-7 w-7 place-items-center rounded-md text-fg-dim transition-colors hover:text-danger"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {showSaved && saved.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center gap-2 rounded-xl border border-white/8 px-3 py-3 text-xs text-fg-muted"
          >
            <X className="h-3.5 w-3.5 text-fg-dim" /> No saved builds yet.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
