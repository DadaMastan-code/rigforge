import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}
interface State {
  hasError: boolean
}

/** Keeps a failing subtree (e.g. WebGL) from taking down the whole app. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="grid h-full w-full place-items-center p-6 text-center text-sm text-fg-muted">
            Visualization unavailable in this browser.
          </div>
        )
      )
    }
    return this.props.children
  }
}
