import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Section } from '../components/common/Section'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import {
  // architectureHighlights,
  experienceTimeline,
  professionalSummary,
  projectExperiences,
} from '../data/experiences'
import { DEFAULT_LANGUAGE, isLanguage, type Language } from '../i18n/locales'
import { SEO } from '../components/common/SEO'

function resolveLanguage(lang: string | undefined): Language {
  if (!lang || !isLanguage(lang)) {
    return DEFAULT_LANGUAGE
  }
  return lang
}

export function ExperiencePage() {
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
        <div />
      </Section>

      <Section title={language === 'zh' ? 'Experience Timeline' : 'Experience Timeline'}>
        <div className="timeline">
          {experienceTimeline.map((item, index) => (
            <motion.div
              key={`${item.title.en}-${item.period}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
            >
              <Card className="timeline__item">
                <h3>{item.title[language]}</h3>
                {item.organization ? <p>{item.organization[language]}</p> : null}
                <p className="timeline__period">{item.period}</p>
                <p>{item.description[language]}</p>
                <ul className="timeline__list">
                  {item.responsibilities.map((line, lineIndex) => (
                    <li key={`${item.period}-${lineIndex}`}>{line[language]}</li>
                  ))}
                </ul>
                <div className="stack-list timeline__technologies">
                  {item.technologies.map((tech) => (
                    <Badge key={tech}>{tech}</Badge>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section title={language === 'zh' ? 'Project Experience' : 'Project Experience'}>
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
      </Section>

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
