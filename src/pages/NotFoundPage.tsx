import { Link, useLocation } from 'react-router-dom'
import { Section } from '../components/common/Section'
import { getLanguageFromPath } from '../utils/language'

export function NotFoundPage() {
  const location = useLocation()
  const lang = getLanguageFromPath(location.pathname)

  return (
    <Section
      title={lang === 'zh' ? '找不到頁面' : 'Page not found'}
      description={
        lang === 'zh'
          ? '你要找的頁面不存在或已被移動。'
          : 'The page you requested does not exist or has been moved.'
      }
    >
      <br />
      <Link className="btn btn--primary" to={`/${lang}/`}>
        {lang === 'zh' ? '返回首頁' : 'Back to Home'}
      </Link>
    </Section>
  )
}
