import { useParams } from 'react-router-dom'
import { Section } from '../components/common/Section'
import { Card } from '../components/common/Card'
import { contactChannelItems, contactIntro } from '../data/contact'
import { DEFAULT_LANGUAGE, isLanguage, type Language } from '../i18n/locales'
import { SEO } from '../components/common/SEO'

function resolveLanguage(lang: string | undefined): Language {
  if (!lang || !isLanguage(lang)) {
    return DEFAULT_LANGUAGE
  }
  return lang
}

function ContactIcon({ type }: { type: 'email' | 'github' | 'facebook' }) {
  if (type === 'email') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25V6.75Zm2 0a.75.75 0 0 0-.75.75v.2l6.75 4.83 6.75-4.83v-.2a.75.75 0 0 0-.75-.75H6Zm12.75 3.4-6.31 4.52a.75.75 0 0 1-.88 0l-6.31-4.52v7.1c0 .41.34.75.75.75h12.5c.41 0 .75-.34.75-.75v-7.1Z"
        />
      </svg>
    )
  }

  if (type === 'github') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.3 6.84 9.65.5.1.68-.22.68-.5v-1.73c-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.5-1.11-1.5-.9-.64.07-.63.07-.63 1 .08 1.52 1.05 1.52 1.05.88 1.56 2.31 1.1 2.87.84.09-.66.34-1.1.62-1.36-2.22-.26-4.55-1.15-4.55-5.11 0-1.13.39-2.06 1.03-2.79-.1-.27-.45-1.33.1-2.78 0 0 .84-.28 2.75 1.06A9.35 9.35 0 0 1 12 7.13c.85 0 1.7.12 2.5.35 1.9-1.34 2.75-1.06 2.75-1.06.54 1.45.2 2.51.1 2.78.64.73 1.03 1.66 1.03 2.79 0 3.97-2.34 4.85-4.57 5.11.36.32.67.95.67 1.91v2.84c0 .28.18.6.69.5A10.27 10.27 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-1.56 19.88V14.9H8.22v-2.9h2.22V9.82c0-2.2 1.3-3.42 3.3-3.42.96 0 1.96.17 1.96.17v2.15h-1.11c-1.1 0-1.45.69-1.45 1.4V12h2.47l-.39 2.9h-2.08v6.98A10 10 0 0 0 12 2Z"
      />
    </svg>
  )
}

export function ContactPage() {
  const { lang } = useParams()
  const language = resolveLanguage(lang)

  return (
    <>
      <SEO
        title={language === 'zh' ? '聯絡' : 'Contact'}
        description={
          language === 'zh'
            ? '透過 Email、GitHub 或 Facebook 聯絡 Ethan Chan。'
            : 'Reach Ethan Chan through email, GitHub, or Facebook.'
        }
        path={`/${language}/contact`}
      />
      <Section
        title={language === 'zh' ? '聯絡' : 'Contact'}
        description={contactIntro[language]}
        className="section--spacious"
      >
        <div className="contact-grid">
          <Card className="contact-card contact-card--primary">
            <p className="contact-card__eyebrow">{language === 'zh' ? '聯絡方式' : 'Channels'}</p>
            <div className="contact-channel-list">
              {contactChannelItems.map((channel) => (
                <a
                  key={channel.key}
                  className="contact-channel"
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="contact-channel__icon" aria-hidden="true">
                    <ContactIcon type={channel.key} />
                  </span>
                  <span className="contact-channel__content">
                    <strong>{channel.label[language]}</strong>
                    <span>{channel.value}</span>
                    <small>{channel.note[language]}</small>
                  </span>
                </a>
              ))}
            </div>
          </Card>
        </div>
      </Section>
    </>
  )
}
