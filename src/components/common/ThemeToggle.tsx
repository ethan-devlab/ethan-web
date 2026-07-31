import type { Theme } from '../../utils/theme'
import { trackButtonClick } from '../../utils/analytics'
import { MdOutlineLightMode, MdModeNight } from "react-icons/md";

type ThemeToggleProps = {
  theme: Theme
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => {
        trackButtonClick({ label: `switch_to_${nextTheme}`, area: 'theme_toggle', target: nextTheme })
        onToggle()
      }}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <MdOutlineLightMode size={23} /> : <MdModeNight size={23} />}
    </button>
  )
}
