import { motion } from 'framer-motion'
import type { Language } from '../../i18n/locales'
import { skillGroups } from '../../data/skills'
import { Badge } from '../common/Badge'
import { Card } from '../common/Card'
import { Section } from '../common/Section'

type SkillTreeProps = {
  lang: Language
}

const skillSection = {
  title: {
    en: 'Capabilities',
    zh: '能力架構',
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
    en: ['AI Agent Applications', 'Backend & Data Systems', 'UAV Vision Navigation'],
    zh: ['AI Agent 應用', '後端與資料系統', '無人機視覺導航'],
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
      <div className="grid skill-grid">
        {skillGroups.map((group, index) => (
          <motion.div
            key={group.title[lang]}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
          >
            <Card className="skill-card">
              <h3>{group.title[lang]}</h3>
              <div className="skill-badges">
                {group.items.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
