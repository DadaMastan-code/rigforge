import { useEffect } from 'react'
import { Background } from '@/components/layout/Background'
import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/landing/Hero'
import { TickerBar } from '@/components/landing/TickerBar'
import { Builder } from '@/components/builder/Builder'
import { Footer } from '@/components/layout/Footer'
import { useMarketStore } from '@/state/useMarketStore'

export default function App() {
  const start = useMarketStore((s) => s.start)
  const stop = useMarketStore((s) => s.stop)

  // Kick off the realtime price/stock simulation for the session.
  useEffect(() => {
    start()
    return () => stop()
  }, [start, stop])

  return (
    <>
      <Background />
      <Navbar />
      <main>
        <Hero />
        <TickerBar />
        <Builder />
      </main>
      <Footer />
    </>
  )
}
