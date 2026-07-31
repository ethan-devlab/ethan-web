import type { LocalizedText } from './types'

export const contactIntro: LocalizedText = {
  zh: '歡迎交流心得、討論合作。',
  en: 'Feel free to reach out to me through the following channels.',
}

export const contactChannels = {
  email: 'hello@ethan-devlab.com',
  github: 'github.com/ethan-devlab',
  facebook: 'facebook.com/jcheng.chan',
  linkedin: 'linkedin.com/in/jiasengchan/',
}

export type ContactChannelItem = {
  key: 'email' | 'github' | 'facebook' | 'linkedin'
  label: LocalizedText
  value: string
  href: string
  note: LocalizedText
}

export const contactChannelItems: ContactChannelItem[] = [
  {
    key: 'email',
    label: { zh: 'Email', en: 'Email' },
    value: contactChannels.email,
    href: `mailto:${contactChannels.email}`,
    note: {
      zh: '',
      en: '',
    },
  },
  {
    key: 'linkedin',
    label: { zh: 'LinkedIn', en: 'LinkedIn' },
    value: contactChannels.linkedin,
    href: `https://${contactChannels.linkedin}`,
    note: {
      zh: '',
      en: '',
    },
  },
  {
    key: 'github',
    label: { zh: 'GitHub', en: 'GitHub' },
    value: contactChannels.github,
    href: `https://${contactChannels.github}`,
    note: {
      zh: '',
      en: '',
    },
  },
  {
    key: 'facebook',
    label: { zh: 'Facebook', en: 'Facebook' },
    value: contactChannels.facebook,
    href: `https://www.${contactChannels.facebook}`,
    note: {
      zh: '',
      en: '',
    },
  },
]
