import { useParams } from 'react-router-dom'
import { Section } from '../components/common/Section'
import { Card } from '../components/common/Card'
import { contactChannelItems, contactIntro } from '../data/contact'
import { DEFAULT_LANGUAGE, isLanguage, type Language } from '../i18n/locales'
import { SEO } from '../components/common/SEO'
import { trackButtonClick } from '../utils/analytics'
import { FaGithub, FaFacebook, FaLinkedin } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

function resolveLanguage(lang: string | undefined): Language {
  if (!lang || !isLanguage(lang)) {
    return DEFAULT_LANGUAGE
  }
  return lang
}

function ContactIcon({ type }: { type: 'email' | 'github' | 'facebook' | 'linkedin' }) {
  if (type === 'email') {
    return <MdEmail />
  }

  if (type === 'github') {
    return <FaGithub />
  }

  if (type === 'linkedin') {
    return <FaLinkedin />
  }

  return <FaFacebook />
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
            ? '透過 Email、GitHub、Facebook 或 LinkedIn 聯絡 Ethan Chan。'
            : 'Reach Ethan Chan through email, GitHub, Facebook, or LinkedIn.'
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
                  onClick={() =>
                    trackButtonClick({
                      label: `contact_${channel.key}`,
                      area: 'contact_channels',
                      target: channel.key,
                    })
                  }
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
