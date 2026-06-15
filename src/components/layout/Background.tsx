/** Fixed ambient backdrop: animated tech grid + drifting gradient orbs. */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-bg animate-grid opacity-70" />

      <div
        className="absolute -left-48 -top-48 h-[44rem] w-[44rem] rounded-full blur-3xl animate-float"
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.12), transparent 62%)' }}
      />
      <div
        className="absolute -right-40 top-20 h-[40rem] w-[40rem] rounded-full blur-3xl animate-float"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.14), transparent 60%)',
          animationDelay: '-3s',
        }}
      />
      <div
        className="absolute bottom-[-12rem] left-1/3 h-[34rem] w-[34rem] rounded-full blur-3xl animate-float"
        style={{
          background: 'radial-gradient(circle, rgba(255,122,24,0.08), transparent 60%)',
          animationDelay: '-1.5s',
        }}
      />

      {/* top + bottom vignette */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />
    </div>
  )
}
