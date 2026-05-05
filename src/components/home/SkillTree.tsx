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
    en: 'Toolbox',
    zh: '工具包',
  },
  description: {
    en: 'Overview of core technical skills and tools.',
    zh: '一些常用工具，以 Python 為主力，主要在做 AI 應用開發和網站開發。目前專題在做無人機，以影像處理和開發視覺導航算法為主。',
  },
}

export function SkillTree({ lang }: SkillTreeProps) {
  return (
    <Section
      title={skillSection.title[lang]}
      description={skillSection.description[lang]}
      className="section--spacious"
    >
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
