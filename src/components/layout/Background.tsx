import deskBg from '@/assets/bg/desk.jpg'

/**
 * Fixed editorial backdrop: warm paper base, a faint desaturated workspace
 * photo for depth, a warm wash that strengthens lower down so dense content
 * stays readable, and a printed grain on top.
 */
export function Background() {
  const grain =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {/* paper base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% -10%, #f9f4ea 0%, #f2ead9 55%, #efe5d3 100%)',
        }}
      />

      {/* faint workspace photo */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${deskBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: 0.14,
          filter: 'saturate(0.7)',
        }}
      />

      {/* warm wash — lighter over the hero, denser behind builder content */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(244,238,226,0.30) 0%, rgba(244,238,226,0.66) 52%, rgba(243,237,223,0.84) 100%)',
        }}
      />

      {/* grain */}
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-multiply"
        style={{ backgroundImage: grain, backgroundSize: '140px 140px' }}
      />
    </div>
  )
}
