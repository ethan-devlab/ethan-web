import type { ExperienceItem, LocalizedText, ProjectExperience } from './types'

export const professionalSummary: LocalizedText = {
  zh: '喜歡 coding 和研究新科技，對 AI、資安、IoT 和軟體工程都有興趣。目前專注在無人機影像處理、無人機導航算法、AI Agent 應用、自動化應用開發、網站開發和系統架構分析與設計。',
  en: 'Passionate about coding and exploring new technologies, with interests spanning AI, information security, IoT, and software engineering. Currently focused on drone image processing, drone navigation algorithms, ground-based AI application development, automation application development, web development, and system architecture analysis and design.',
}

export const experienceTimeline: ExperienceItem[] = [
  {
    title: {
      zh: 'Programmer',
      en: 'Programmer',
    },
    organization: {
      zh: 'Ethan DevLab (Personal)',
      en: 'Ethan DevLab (Personal)',
    },
    period: '2023 - Present',
    description: {
      zh: '開始有了系統觀念，從興趣出發，嘗試在多個領域實驗和累積經驗，跨足 AI、資安、IoT 和軟體工程等不同領域，持續探索和學習中。',
      en: 'Gained a more systematic perspective, experimenting and accumulating experience across multiple domains driven by interest, spanning AI, information security, IoT, and software engineering, with ongoing exploration and learning.',
    },
    responsibilities: [
      {
        zh: '會用 AI 寫 code，但更喜歡自己來，喜歡屬於自己的成就感和屬於自己的思維碰撞過程，AI 是個好幫手但不是主角',
        en: 'Use AI to write code, but prefer doing it myself for the sense of accomplishment and the unique thought process. AI is a helpful assistant, but not the main character',
      },
      {
        zh: '遊走於不同領域，從 CTF、無人機影像處理、無人機導航算法，到地端 AI 應用開發、自動化應用開發、網站開發和系統架構分析與設計等',
        en: 'Experimenting with projects across different domains, from drone image processing and navigation algorithms to ground-based AI application development, automation application development, web development, and system architecture analysis and design',
      },
      {
        zh: '從只會抄 Github 的 code，到可以發起 pull request 的開源貢獻者，從不會寫 commit message 到開始重視 commit message 的表達',
        en: 'Evolved from just copying code from GitHub to becoming an open source contributor who can initiate pull requests, and from not writing commit messages to valuing the expression of commit messages',
      },
    ],
    technologies: ['Python', 'JavaScript', 'HTML/CSS', 'Java', 'C/C++', 'Django', 'Git', 'n8n', 'Docker'],
  },
  {
    title: {
      zh: '程式初學者',
      en: 'Rookie',
    },
    organization: {
      zh: '',
      en: '',
    },
    period: '2020 - 2022',
    description: {
      zh: '一段奇幻旅程的開始：自學程式語言與基礎概念，半桶水的程式能力與對軟體開發的興趣開始萌芽。',
      en: 'Self-taught programming languages and basic concepts, with a budding interest in software development despite being a half-baked programmer.',
    },
    responsibilities: [
      {
        zh: '最初以 PyQt5 開發桌面應用，之後開始接觸網頁前端技術和寫 Javascript',
        en: 'Started with PyQt5 for desktop application development, and began exploring web frontend technologies and JavaScript in senior year',
      },
      {
        zh: '為了打辯論，不知道 OOP 是什麼就用 PyQt5 寫了一個辯論計時器，後來又為了交數學作業做了 PDF 轉檔工具',
        en: 'Wrote a debate timer in PyQt5 for debate club, and later created a PDF converter tool for math assignments',
      },
      {
        zh: '用 Dreamweaver 做過個人 portfolio，也架過 WordPress 網站',
        en: 'Created a personal portfolio using Dreamweaver and set up WordPress websites',
      },
      {
        zh: "用 MIT App Inventor 做了藍牙連線版的中國象棋",
        en: "Created a Bluetooth-connected Chinese Chess game using MIT App Inventor"
      }
    ],
    technologies: ['Python', 'JavaScript', 'HTML/CSS', 'PyQt5', 'Dreamweaver', 'WordPress', 'MIT App Inventor'],
  },
]

export const projectExperiences: ProjectExperience[] = [
  {
    name: {
      zh: '地端 AI 客服系統',
      en: 'Local AI Customer Service System',
    },
    role: {
      zh: '架構與前後端實作',
      en: 'Architecture & Full-Stack Implementation',
    },
    period: '2025/2026',
    problem: {
      zh: '對雲端 AI 的隱私性、成本和依賴性有顧慮，希望在不完全依賴雲端 AI 服務的前提下，減輕人工客服的負擔並提供更即時的回應。',
      en: 'Concerned about the privacy, cost, and dependency on cloud AI services, aiming to reduce the burden on human customer service and provide more immediate responses without fully relying on cloud AI services.',
    },
    solution: {
      zh: '設計 AI Agent 架構，結合本地 AI 模型與規則引擎，實現智能客服功能。',
      en: 'Designed an AI Agent architecture, integrating local AI models with a rule engine to implement intelligent customer service functionality.',
    },
    impact: {
      zh: '減輕人工客服負擔，並提供更即時的回應，同時不受限於特定 AI 服務商的限制。',
      en: 'Reduced the burden on human customer service and provided more immediate responses, while not being limited by specific AI service providers.',
    },
    technologies: ['Python', 'n8n', 'oMLX', 'ngrok', 'Docker', 'Flask'],
  },
  // {
  //   name: {
  //     zh: '辯論計時器',
  //     en: 'Debate Timer',
  //   },
  //   role: {
  //     zh: '完整架構與實作',
  //     en: 'System Design & Implementation',
  //   },
  //   period: '2021',
  //   problem: {
  //     zh: '辯論比賽中缺乏一個專門的計時工具，導致使用手機或其他不專業的計時方式，容易出現誤差和不便。',
  //     en: 'Lack of a dedicated timing tool for debate competitions, leading to the use of phones or other non-professional timing methods that can be prone to errors and inconvenience.',
  //   },
  //   solution: {
  //     zh: '使用 PyQt5/Pyside2 開發了一個專門的辯論計時器，提供清晰的界面和準確的計時功能，適用於各種辯論賽事。',
  //     en: 'Developed a dedicated debate timer using PyQt5/Pyside2, providing a clear interface and accurate timing functionality for various debate competitions.',
  //   },
  //   impact: {
  //     zh: '提供了一個專業的計時工具，提升了辯論比賽的效率和準確性，受到了辯論隊成員的歡迎。',
  //     en: 'Provided a professional timing tool that improved the efficiency and accuracy of debate competitions, receiving positive feedback from debate team members.',
  //   },
  //   technologies: ['PyQt5', 'Pyside2', 'Python'],
  // },
]

// export const architectureHighlights: Record<'zh' | 'en', string[]> = {
//   zh: [
//     '以模組邊界先行，避免頁面與資料邏輯高度耦合。',
//     '路由與內容分離，確保新增文章不影響導覽結構。',
//     '以可維運為優先，先建立規範再擴充功能。',
//   ],
//   en: [
//     'Module boundaries first to avoid tight coupling between page and data logic.',
//     'Routing and content are decoupled so new posts do not affect navigation structure.',
//     'Maintainability-first engineering: conventions before expansion.',
//   ],
// }
