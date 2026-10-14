import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useReducedMotionPreference } from '../utils/useReducedMotionPreference'
import { Section } from '../components/common/Section'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import {
  // architectureHighlights,
  experienceTimeline,
  professionalSummary,
  // projectExperiences,
} from '../data/experiences'
import { DEFAULT_LANGUAGE, isLanguage, type Language } from '../i18n/locales'
import { SEO } from '../components/common/SEO'
import { trackButtonClick } from '../utils/analytics'
import { getButtonClass } from '../utils/button'
import { ButtonLabel } from '../components/common/ButtonLabel'
import '../styles/experience-review.css'

function resolveLanguage(lang: string | undefined): Language {
  if (!lang || !isLanguage(lang)) {
    return DEFAULT_LANGUAGE
  }
  return lang
}

export function ExperiencePage() {
  const reducedMotion = useReducedMotionPreference()
  const { lang } = useParams()
  const language = resolveLanguage(lang)

  return (
    <>
      <SEO
        title={language === 'zh' ? '經歷' : 'Experience'}
        description={
          language === 'zh'
            ? 'Coding 愛好者的經驗軌跡，希望分享和交流在系統架構思考、工程決策和可驗證的專案經驗方面的心得。'
            : 'A coding enthusiast\'s journey through experience, aiming to share and exchange insights on system architecture thinking, engineering decisions, and verifiable project experiences.'
        }
        path={`/${language}/experience`}
      />

      <Section
        title={language === 'zh' ? 'Professional Summary' : 'Professional Summary'}
        description={professionalSummary[language]}
      >
        <div className="experience__resume-cta">
          <Link
            className={getButtonClass('secondary')}
            to={`/${language}/resume`}
            onClick={() =>
              trackButtonClick({
                label: 'experience_resume',
                area: 'experience_summary',
                target: `/${language}/resume`,
              })
            }
          >
            <ButtonLabel>{language === 'zh' ? '查看履歷' : 'View Resume'}</ButtonLabel>
          </Link>
        </div>
      </Section>

      <Section
        title={language === 'zh' ? 'Experience Timeline' : 'Experience Timeline'}
        className="experience__timeline experience-review--split"
      >
        <div className="timeline">
          {experienceTimeline.map((item, index) => (
            <motion.div
              key={`${item.title.en}-${item.period}`}
              className="experience-review__entry"
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={reducedMotion ? { opacity: 1, y: 0 } : undefined}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: reducedMotion ? 0 : 0.35, delay: reducedMotion ? 0 : index * 0.04 }}
            >
              <p className="timeline__period experience-review__period">{item.period}</p>
              <Card className="timeline__item experience-review__card">
                <h3>{item.title[language]}</h3>
                {item.organization ? <p>{item.organization[language]}</p> : null}
                {item.description ? <p>{item.description[language]}</p> : null}
                {item.responsibilities ? <ul className="timeline__list">
                  {item.responsibilities.map((line, lineIndex) => (
                    <li key={`${item.period}-${lineIndex}`}>{line[language]}</li>
                  ))}
                </ul> : null}
                {item.technologies ? <div className="stack-list timeline__technologies">
                  {item.technologies.map((tech) => (
                    <Badge key={tech}>{tech}</Badge>
                  ))}
                </div> : null}
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* <Section title={language === 'zh' ? 'Project Experience' : 'Project Experience'}>
        <div className="project-experience">
          {projectExperiences.map((project) => (
            <Card key={project.name.en} className="project-experience__item">
              <h3>{project.name[language]}</h3>
              <p>{project.role[language]}</p>
              {project.period ? <p className="timeline__period">{project.period}</p> : null}
              <p className="project-experience__label">Problem</p>
              <p>{project.problem[language]}</p>
              <p className="project-experience__label">Solution</p>
              <p>{project.solution[language]}</p>
              <p className="project-experience__label">Impact</p>
              <p>{project.impact[language]}</p>
              <div className="stack-list">
                {project.technologies.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section> */}

      {/* <Section title={language === 'zh' ? 'Architecture Highlights' : 'Architecture Highlights'}>
        <Card className="timeline__item">
          <ul className="timeline__list">
            {architectureHighlights[language].map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </Card>
      </Section> */}
    </>
  )
}
