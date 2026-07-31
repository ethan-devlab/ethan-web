import { Link } from 'react-router-dom'
import type { Language } from '../../i18n/locales'
import { trackButtonClick } from '../../utils/analytics'
import { getButtonClass } from '../../utils/button'
import { Card } from '../common/Card'
import { Section } from '../common/Section'

type ClosingCtaProps = {
  lang: Language
}

const closingCtaCopy = {
  en: {
    heading: 'Explore more',
    description: 'See how I approach engineering decisions, review my resume, or start a conversation.',
    experience: 'View Experience',
    resume: 'Resume',
    contact: 'Contact',
  },
  zh: {
    heading: 'Explore more',
    description: '了解我的工程決策、查看履歷，或直接開始交流。',
    experience: '查看經歷',
    resume: '履歷',
    contact: '聯絡',
  },
}

export function ClosingCta({ lang }: ClosingCtaProps) {
  const copy = closingCtaCopy[lang]
  const links = [
    { key: 'experience', label: copy.experience, variant: 'primary' as const },
    { key: 'resume', label: copy.resume, variant: 'secondary' as const },
    { key: 'contact', label: copy.contact, variant: 'tertiary' as const },
  ]

  return (
    <Section className="closing-cta-section">
      <Card className="closing-cta">
        <div>
          <h2 className="closing-cta__eyebrow">{copy.heading}</h2>
          {/* <p className="closing-cta__description">{copy.description}</p> */}
        </div>
        <div className="closing-cta__actions">
          {links.map((link) => {
            const target = `/${lang}/${link.key}`

            return (
              <Link
                key={link.key}
                className={getButtonClass(link.variant)}
                to={target}
                onClick={() => trackButtonClick({ label: `home_closing_${link.key}`, area: 'home_closing_cta', target })}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </Card>
    </Section>
  )
}
