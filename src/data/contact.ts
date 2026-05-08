import type { LocalizedText } from './types'

export const contactIntro: LocalizedText = {
  zh: '如果你想交流心得、討論合作，歡迎透過以下方式聯絡我。',
  en: 'If you would like to connect, discuss potential collaborations, or just say hi, feel free to reach out through the following channels.',
}

export const contactChannels = {
  email: 'hello@ethan-devlab.com',
  github: 'https://github.com/ethan-devlab',
  facebook: 'https://www.facebook.com/jcheng.chan',
}

export type ContactChannelItem = {
  key: 'email' | 'github' | 'facebook'
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
      zh: '歡迎合作洽談',
      en: 'Best for collaboration',
    },
  },
  {
    key: 'github',
    label: { zh: 'GitHub', en: 'GitHub' },
    value: contactChannels.github,
    href: contactChannels.github,
    note: {
      zh: '查看程式碼、架構實作與開發紀錄',
      en: 'Explore source code, architecture implementation, and work logs',
    },
  },
  {
    key: 'facebook',
    label: { zh: 'Facebook', en: 'Facebook' },
    value: contactChannels.facebook,
    href: contactChannels.facebook,
    note: {
      zh: '歡迎交流心得、討論合作',
      en: 'Feel free to connect, discuss potential collaborations, or just say hi',
    },
  },
]
