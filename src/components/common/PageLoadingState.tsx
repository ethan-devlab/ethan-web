import { useEffect } from 'react'

type PageLoadingStateProps = {
  onLoadingChange: (loading: boolean) => void
}

export function PageLoadingState({ onLoadingChange }: PageLoadingStateProps) {
  useEffect(() => {
    onLoadingChange(true)
    return () => onLoadingChange(false)
  }, [onLoadingChange])

  return <div className="page-loading-space" aria-hidden="true" />
}
