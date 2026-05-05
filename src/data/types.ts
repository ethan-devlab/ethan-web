import type { Language } from '../i18n/locales'

export type LocalizedText = Record<Language, string>

export type LocalizedStringList = Record<Language, string[]>

export type ProjectItem = {
  title: LocalizedText
  description: LocalizedText
  techStack: string[]
  highlights: LocalizedStringList
  githubUrl: string
}

export type SkillGroup = {
  title: LocalizedText
  items: string[]
}

export type ExperienceItem = {
  title: LocalizedText
  organization?: LocalizedText
  period: string
  description: LocalizedText
  responsibilities: LocalizedText[]
  technologies: string[]
}

export type ProjectExperience = {
  name: LocalizedText
  role: LocalizedText
  period?: string
  problem: LocalizedText
  solution: LocalizedText
  impact: LocalizedText
  technologies: string[]
}
