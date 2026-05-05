import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { motion } from 'framer-motion'
import type { Language } from '../../i18n/locales'
import { projects } from '../../data/projects'
import { Section } from '../common/Section'
import { Card } from '../common/Card'
import { Badge } from '../common/Badge'
import { FaGithub } from 'react-icons/fa'

type ProjectCarouselProps = {
  lang: Language
}

const projectSection = {
  title: {
    en: 'Projects',
    zh: '專案',
  },
  description: {
    en: 'Mostly inspired and implemented in school projects, including database design, web development, and AI applications.',
    zh: '過去做過的一些專案/專題，以實務/綜合實作為主。',
  },
}

export function ProjectCarousel({ lang }: ProjectCarouselProps) {
  return (
    <Section
      title={projectSection.title[lang]}
      description={projectSection.description[lang]}
      className="section--spacious"
    >
      <Swiper spaceBetween={24} slidesPerView={1} breakpoints={{ 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }}
              className='swiper'>
        {projects.map((project, index) => (
          <SwiperSlide key={project.title.en}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
            >
              <Card className="project-card">
                <h3><a href={project.githubUrl} target="_blank" rel="noreferrer">
                  {project.title[lang]}
                </a></h3>
                <p>{project.description[lang]}</p>
                <div className="stack-list">
                  {project.techStack.map((tech) => (
                    <Badge key={tech}>{tech}</Badge>
                  ))}
                </div>
                <div className="highlight-list">
                  {project.highlights[lang].map((highlight) => (
                    <Badge key={highlight}>{highlight}</Badge>
                  ))}
                </div>
                <a className="header__link" href={project.githubUrl} target="_blank" rel="noreferrer">
                  <FaGithub /> GitHub
                </a>
              </Card>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Section>
  )
}
