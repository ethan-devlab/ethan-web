import type { Language } from '../../i18n/locales'
import { skillGroups } from '../../data/skills'
import { Badge } from '../common/Badge'
import { Section } from '../common/Section'

type SkillTreeProps = {
  lang: Language
}

const skillSection = {
  title: {
    en: 'Capabilities',
    zh: '技術能力',
  },
  description: {
    en: '',
    zh: '',
  },
}

const currentFocus = {
  title: {
    en: 'Current Focus',
    zh: 'Current Focus',
  },
  items: {
    en: ['AI Agent Applications', 'System Design', 'UAV Vision Navigation'],
    zh: ['AI Agent 應用', '系統設計', '無人機視覺導航'],
  },
}

export function SkillTree({ lang }: SkillTreeProps) {
  return (
    <Section
      title={skillSection.title[lang]}
      description={skillSection.description[lang]}
      className="section--spacious"
    >
      <div className="skill-focus">
        <p className="skill-focus__title">{currentFocus.title[lang]}</p>
        <div className="skill-focus__items">
          {currentFocus.items[lang].map((item) => (
            <Badge key={item} className="skill-focus__item">
              {item}
            </Badge>
          ))}
        </div>
      </div>
      <div className="skill-accordion">
        {skillGroups.map((group, index) => (
          <details key={group.title.en}>
            <summary>
              <span className="skill-accordion__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span>{group.title[lang]}</span>
              <span className="skill-accordion__toggle" aria-hidden="true">+</span>
            </summary>
            <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </details>
        ))}
      </div>
    </Section>
  )
}
