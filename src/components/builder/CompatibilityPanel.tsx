import { motion, AnimatePresence } from 'framer-motion'
import { EASE } from '@/lib/motion'
import { ShieldCheck, AlertCircle, AlertTriangle, CircleDashed } from 'lucide-react'
import { useBuildStore } from '@/state/useBuildStore'

export function CompatibilityPanel() {
  const report = useBuildStore((s) => s.report)
  const partCount = useBuildStore((s) => s.partCount)

  const clean = report.errors === 0 && report.warnings === 0
  const headline =
    report.errors > 0
      ? `${report.errors} conflict${report.errors > 1 ? 's' : ''}`
      : report.warnings > 0
        ? `${report.warnings} warning${report.warnings > 1 ? 's' : ''}`
        : 'All compatible'

  const tone =
    report.errors > 0 ? '#fb5b6b' : report.warnings > 0 ? '#fbbf24' : '#34d399'

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-fg">Compatibility</h3>
        <div
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ color: tone, backgroundColor: `${tone}1f` }}
        >
          {report.errors > 0 ? (
            <AlertCircle className="h-3.5 w-3.5" />
          ) : report.warnings > 0 ? (
            <AlertTriangle className="h-3.5 w-3.5" />
          ) : (
            <ShieldCheck className="h-3.5 w-3.5" />
          )}
          {headline}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {partCount === 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3 text-sm text-fg-muted">
            <CircleDashed className="h-4 w-4 text-fg-dim" />
            Add parts and RigForge checks every interface in real time.
          </div>
        )}

        {partCount > 0 && clean && (
          <div className="flex items-center gap-2 rounded-xl border border-ok/25 bg-ok/8 px-3 py-3 text-sm text-fg">
            <ShieldCheck className="h-4 w-4 text-ok" />
            Every selected part fits together. No conflicts detected.
          </div>
        )}

        <AnimatePresence initial={false}>
          {report.issues.map((issue, i) => {
            const isError = issue.level === 'error'
            const c = isError ? '#fb5b6b' : '#fbbf24'
            return (
              <motion.div
                key={`${issue.message}-${i}`}
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="overflow-hidden"
              >
                <div
                  className="flex gap-2.5 rounded-xl border px-3 py-2.5 text-sm"
                  style={{ borderColor: `${c}40`, backgroundColor: `${c}12` }}
                >
                  {isError ? (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: c }} />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: c }} />
                  )}
                  <span className="text-fg-muted">{issue.message}</span>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
