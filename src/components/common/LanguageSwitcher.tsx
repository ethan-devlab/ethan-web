import { Link, useLocation } from 'react-router-dom'
import type { Language } from '../../i18n/locales'
import { trackButtonClick } from '../../utils/analytics'
import { switchLanguagePath } from '../../utils/language'
import { translations } from '../../i18n/translations'

type LanguageSwitcherProps = {
  lang: Language
}

export function LanguageSwitcher({ lang }: LanguageSwitcherProps) {
  const location = useLocation()
  const target = lang === 'zh' ? 'en' : 'zh'
  const nextPath = switchLanguagePath(location.pathname, target)
  const fullPath = `${nextPath}${location.search}${location.hash}`

  return (
    <Link
      to={fullPath}
      className="language-switcher"
      onClick={() =>
        trackButtonClick({ label: `switch_to_${target}`, area: 'language_switcher', target: fullPath })
      }
    >
      {translations[lang].common.languageSwitcher}
    </Link>
  )
}
