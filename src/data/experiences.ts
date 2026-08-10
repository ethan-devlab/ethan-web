import type { ExperienceItem, LocalizedText } from './types'

export const professionalSummary: LocalizedText = {
  zh: '喜歡 coding 和研究新科技，對 AI、資安、IoT 和軟體工程都有興趣。目前專注在無人機影像處理、無人機導航算法、AI Agent 應用、自動化應用開發、網站開發和系統架構分析與設計。',
  en: 'Passionate about coding and exploring new technologies, with interests spanning AI, information security, IoT, and software engineering. Currently focused on drone image processing, drone navigation algorithms, ground-based AI application development, automation application development, web development, and system architecture analysis and design.',
}

export const experienceTimeline: ExperienceItem[] = [
  // {
  //   title: {
  //     zh: 'Developer',
  //     en: 'Developer',
  //   },
  //   organization: {
  //     zh: 'Ethan DevLab (Personal)',
  //     en: 'Ethan DevLab (Personal)',
  //   },
  //   period: '2023 - Present',
  //   description: {
  //     zh: '開始有了系統觀念，從興趣出發，嘗試在多個領域實驗和累積經驗，跨足 AI、資安、IoT 和軟體工程等不同領域，持續探索和學習中。',
  //     en: 'Gained a more systematic perspective, experimenting and accumulating experience across multiple domains driven by interest, spanning AI, information security, IoT, and software engineering, with ongoing exploration and learning.',
  //   },
  //   responsibilities: [
  //     {
  //       zh: '會用 AI 寫 code，但更喜歡自己來，喜歡屬於自己的成就感和屬於自己的思維碰撞過程，AI 是個好幫手但不是主角',
  //       en: 'Use AI to write code, but prefer doing it myself for the sense of accomplishment and the unique thought process. AI is a helpful assistant, but not the main character',
  //     },
  //     {
  //       zh: '遊走於不同領域，從 CTF、無人機影像處理、無人機導航算法，到地端 AI 應用開發、自動化應用開發、網站開發和系統架構分析與設計等',
  //       en: 'Experimenting with projects across different domains, from drone image processing and navigation algorithms to ground-based AI application development, automation application development, web development, and system architecture analysis and design',
  //     },
  //     {
  //       zh: '從只會抄 Github 的 code，到可以發起 pull request 的開源貢獻者，從不會寫 commit message 到開始重視 commit message 的表達',
  //       en: 'Evolved from just copying code from GitHub to becoming an open source contributor who can initiate pull requests, and from not writing commit messages to valuing the expression of commit messages',
  //     },
  //   ],
    // technologies: ['Python', 'JavaScript', 'HTML/CSS', 'Java', 'C/C++', 'Django', 'Git', 'n8n', 'Docker'],
    // technologies: [],
  // },
  {
    title: {
      zh: "實習",
      en: "Internship",
    },
    organization: {
      zh: "日峰科技股份有限公司",
      en: "Reformtek CO., LTD.",
    },
    period: "2026/8 - Present",
    responsibilities: [
      {
        zh: "負責 AIoT 智慧精靈開發",
        en: "Participated in the development of AIoT Intelligent Assistant",
      },
      {
        zh: "系統維護與優化",
        en: "System maintenance and optimization",
      }
    ],
  },
  {
    title: {
      zh: '大學',
      en: 'University',
    },
    organization: {
      zh: '逢甲大學',
      en: 'Feng Chia University, Taiwan',
    },
    period: '2023/9 - Present',
    description: { 
      zh: "主修資訊工程，專注於軟體開發、系統架構、資訊安全和人工智慧的研究。",
      en: "Majoring in Information Engineering and Computer Science, focusing on software development, system architecture, information security, and artificial intelligence research."
    },
    responsibilities: [
      {
        zh: '參與多個軟體開發專案，從需求分析、系統設計到實作和測試，累積了豐富的實務經驗。',
        en: 'Participated in multiple software development projects, gaining practical experience from requirements analysis, system design, implementation, to testing.',
      },
      {
        zh: "曾修習國家資通安全研究院「NICS 台灣資安計劃」—— 院校開辦之「網路安全實務與社會課程」，並取得結業證明。主要內容為參與非營利組織與中小型企業資安咨詢服務，提升受輔導單位資安意識與防護能力。編號：NICS-CP-CSCS-25287",
        en: "Completed the \"Practical and Social Aspects of Cybersecurity\" course in favour of the NICS Taiwan Cybersecurity Program, National Institute of Cyber Security, obtaining a certificate of completion. The main content involved participating in cybersecurity consulting services for non-profit organizations and SMEs, enhancing the security awareness and protection capabilities of the supported units. Reference Number: NICS-CP-CSCS-25287",
      }
    ]
  },
  {
    title: {
      zh: '高中',
      en: 'High School',
    },
    organization: {
      zh: '柔佛州峇株巴轄華仁中學',
      en: 'Chinese High School, Batu Pahat, Johor',
    },
    period: '2020 - 2022',
    description: { 
      zh: "The beginning of programming.",
      en: "The beginning of programming."
    }
  },
]

// export const projectExperiences: ProjectExperience[] = [
//   {
//     name: {
//       zh: '地端 AI 客服系統',
//       en: 'Local AI Customer Service System',
//     },
//     role: {
//       zh: '架構與前後端實作',
//       en: 'Architecture & Full-Stack Implementation',
//     },
//     period: '2025/2026',
//     problem: {
//       zh: '對雲端 AI 的隱私性、成本和依賴性有顧慮，希望在不完全依賴雲端 AI 服務的前提下，減輕人工客服的負擔並提供更即時的回應。',
//       en: 'Concerned about the privacy, cost, and dependency on cloud AI services, aiming to reduce the burden on human customer service and provide more immediate responses without fully relying on cloud AI services.',
//     },
//     solution: {
//       zh: '設計 AI Agent 架構，結合本地 AI 模型與規則引擎，實現智能客服功能。',
//       en: 'Designed an AI Agent architecture, integrating local AI models with a rule engine to implement intelligent customer service functionality.',
//     },
//     impact: {
//       zh: '減輕人工客服負擔，並提供更即時的回應，同時不受限於特定 AI 服務商的限制。',
//       en: 'Reduced the burden on human customer service and provided more immediate responses, while not being limited by specific AI service providers.',
//     },
//     technologies: ['Python', 'n8n', 'Ollama', 'ngrok', 'Docker', 'Flask'],
//   },

// ]

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
