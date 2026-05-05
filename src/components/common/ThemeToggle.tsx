import type { Theme } from '../../utils/theme'

type ThemeToggleProps = {
  theme: Theme
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button type="button" className="theme-toggle" onClick={onToggle} aria-label="Toggle theme">
      {theme === 'dark' ? 'Dark' : 'Light'}
    </button>
  )
}
