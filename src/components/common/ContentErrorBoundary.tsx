import { Component, type ReactNode } from 'react'

type ContentErrorBoundaryProps = {
  children: ReactNode
  fallback?: ReactNode
  resetKey?: string
  onError?: (error: unknown) => void
}

type ContentErrorState = { failed: boolean; resetKey?: string }

export class ContentErrorBoundary extends Component<ContentErrorBoundaryProps, ContentErrorState> {
  state = { failed: false, resetKey: this.props.resetKey }

  static getDerivedStateFromProps(props: ContentErrorBoundaryProps, state: ContentErrorState) {
    return props.resetKey !== state.resetKey ? { failed: false, resetKey: props.resetKey } : null
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    this.props.onError?.(error)
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children
  }
}
