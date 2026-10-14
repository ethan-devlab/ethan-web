import type { Language } from '../../i18n/locales'
import { projects } from '../../data/projects'
import { Section } from '../common/Section'
import { FaGithub } from 'react-icons/fa'
import { trackButtonClick } from '../../utils/analytics'
import '../../styles/home-refinement.css'

const projectSection = {
  title: { en: 'Projects', zh: '專案' },
  description: {
    en: 'Mostly inspired and implemented in school projects, including database design, web development, and AI applications.',
    zh: '過去做過的一些專案/專題，以實務/綜合實作為主。',
  },
}

export function HomeProjectList({ lang }: { lang: Language }) {
  return (
    <Section title={projectSection.title[lang]} description={projectSection.description[lang]} className="section--spacious homepage-work homepage-work--clear-lines">
      <div className="homepage-work__list">
        {projects.map((project, index) => (
          <article className="homepage-work__row" key={project.title.en}>
            <span className="homepage-work__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <div className="homepage-work__content">
              <p className="homepage-work__type">{project.projectType[lang]}</p>
              <h3>{project.title[lang].replace(/\s*[（(](?:此專案不公開|Private Project)[）)]$/, '')}</h3>
              <p className="homepage-work__description">{project.description[lang]}</p>
              <ul className="homepage-work__highlights">
                {project.highlights[lang].map((highlight) => <li key={highlight}>{highlight}</li>)}
              </ul>
            </div>
            <div className="homepage-work__aside">
              <ul className="homepage-work__stack">
                {project.techStack.map((tech) => <li key={tech}>{tech}</li>)}
              </ul>
              {!project.isPrivate && project.githubUrl ? (
                <a
                  className="homepage-work__source"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackButtonClick({ label: `project_github_${index + 1}`, area: 'home_projects', target: 'github' })}
                >
                  <FaGithub aria-hidden="true" /> GitHub Repo
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
