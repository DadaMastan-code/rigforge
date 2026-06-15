# RigForge

A high-end, fully client-side **PC building** website — pick parts, watch prices move
in real time, get live compatibility/power/performance feedback, and see your build
render in 3D. No backend, no API keys, free to host forever.

![stack](https://img.shields.io/badge/React-19-22d3ee) ![stack](https://img.shields.io/badge/Three.js-R3F-a855f7) ![stack](https://img.shields.io/badge/Tailwind-v4-34d399)

## Features

- **Configurator** — 8 component categories (CPU, motherboard, memory, GPU, cooler,
  storage, PSU, case) with a curated, current-gen catalog of 60+ real parts.
- **Live compatibility engine** — checks sockets, memory type/speed/capacity, GPU and
  cooler clearance, form factor, M.2, and PSU adequacy in real time. The part picker
  even pre-flags incompatible options _before_ you select them.
- **Realtime market** — every part's price and stock perform a bounded, mean-reverting
  random walk with the occasional flash deal, surfaced through a live ticker and
  flashing price tags. Fully simulated client-side (see _Swapping in real prices_).
- **Power estimation** — animated wattage gauge with peak-draw modelling and a
  recommended PSU size.
- **Performance & bottleneck** — estimated 1080p/1440p/4K frame rates, a productivity
  index, and CPU/GPU balance analysis.
- **3D preview** — a stylized rig (React Three Fiber) whose components light up as you
  pick them; drag to orbit.
- **Save & share** — builds persist to `localStorage` and encode into a shareable URL
  (`?b=…`), so links restore the exact build. No server required.
- **Quick-start presets** — Budget / Balanced / Extreme.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build
```

## Deploying to GitHub Pages (free)

1. Push this repo to GitHub named **`rigforge`** (the Vite `base` is `/rigforge/` when
   building for Pages — if you use a different repo name, change `base` in
   [`vite.config.ts`](vite.config.ts)).
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`. The workflow in
   [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds with
   `GITHUB_PAGES=true` and publishes `dist/`.

## Swapping in real prices

The simulation is isolated. To use a real pricing source, replace `stepQuotes` in
[`src/engine/market.ts`](src/engine/market.ts) with a fetch + reconcile against the
provider, keeping the `Quote` shape. Everything else (store, UI, totals) is unchanged.

## Project structure

```
src/
  data/        types + the parts catalog
  engine/      compatibility, wattage, benchmarks, market sim, share/URL codec
  state/       Zustand stores (build + realtime market)
  lib/         formatting, spec derivation, icons, easing
  components/
    layout/    navbar, background, footer
    landing/   hero, live ticker
    builder/   rows, picker, summary, gauge, compatibility, performance
    three/     R3F canvas + rig model
    ui/        animated number, price tag, error boundary
```

> ⚠️ Prices, stock, and performance figures are **simulated for demonstration** and
> compatibility checks are heuristic — verify specs with manufacturers before buying.
