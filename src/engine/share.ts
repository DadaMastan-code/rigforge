import type { Build } from '@/data/types'
import { CATEGORY_ORDER, getPart } from '@/data/catalog'

/* ----------------------------------------------------------------------------
   URL <-> Build codec (backend-free sharing).
   A build is encoded as its selected part ids, joined and base64url-ed into
   the `?b=` query param. Part ids are ASCII so btoa is safe.
---------------------------------------------------------------------------- */

const toUrlSafe = (b64: string) =>
  b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const fromUrlSafe = (s: string) => s.replace(/-/g, '+').replace(/_/g, '/')

export function encodeBuild(build: Build): string {
  const ids = CATEGORY_ORDER.map((c) => build[c]?.id).filter(Boolean)
  if (ids.length === 0) return ''
  return toUrlSafe(btoa(ids.join('~')))
}

export function decodeBuild(code: string): Build {
  const build: Build = {}
  if (!code) return build
  try {
    const ids = atob(fromUrlSafe(code)).split('~')
    for (const id of ids) {
      const part = getPart(id)
      if (part) build[part.category] = part
    }
  } catch {
    /* malformed code — return whatever parsed */
  }
  return build
}

export function buildShareUrl(build: Build): string {
  const url = new URL(window.location.href)
  const code = encodeBuild(build)
  if (code) url.searchParams.set('b', code)
  else url.searchParams.delete('b')
  return url.toString()
}

/** Reflect the current build into the address bar without a navigation. */
export function syncUrl(build: Build): void {
  const url = new URL(window.location.href)
  const code = encodeBuild(build)
  if (code) url.searchParams.set('b', code)
  else url.searchParams.delete('b')
  window.history.replaceState(null, '', url)
}

export function readBuildFromUrl(): Build {
  const code = new URL(window.location.href).searchParams.get('b')
  return code ? decodeBuild(code) : {}
}

/* ----------------------------------------------------------------------------
   Saved builds (localStorage)
---------------------------------------------------------------------------- */

export interface SavedBuild {
  id: string
  name: string
  code: string
  total: number
  createdAt: number
}

const KEY = 'rigforge.saves.v1'
const MAX_SAVES = 30

export function listSaved(): SavedBuild[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as SavedBuild[]) : []
  } catch {
    return []
  }
}

export function saveBuild(name: string, build: Build, total: number): SavedBuild[] {
  const entry: SavedBuild = {
    id: `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    name: name.trim() || 'Untitled build',
    code: encodeBuild(build),
    total,
    createdAt: Date.now(),
  }
  const next = [entry, ...listSaved()].slice(0, MAX_SAVES)
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* storage full / unavailable */
  }
  return next
}

export function deleteSaved(id: string): SavedBuild[] {
  const next = listSaved().filter((b) => b.id !== id)
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
  return next
}
