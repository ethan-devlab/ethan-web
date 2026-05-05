import type { ProjectItem } from './types'

export const projects: ProjectItem[] = [
  {
    title: {
      zh: '地端 AI 客服系統（此專案不公開）',
      en: 'Local AI Customer Service System (Private Project)',
    },
    description: {
      zh: '以 Python、Flask、oMLX、n8n、Docker、ngrok 等實作的地端 AI 客服系統，提供具 AI 自判斷能力的客服解決方案',
      en: 'Local AI Customer Service System implemented with Python, Flask, oMLX, n8n, Docker, ngrok, etc., providing AI-powered customer service solutions',
    },
    techStack: ['Python', 'Flask', 'oMLX', 'n8n', 'Docker', 'Line Messaging API', 'ngrok'],
    highlights: {
      zh: ['API 整合', '系統設計', 'AI 模型應用', 'Agent 設計'],
      en: ['API Integration', 'System Design', 'AI Model Application', 'Agent Design'],
    },
    githubUrl: 'https://github.com/ethan-devlab',
  },    
  {
    title: {
      zh: '旅遊規劃平台',
      en: 'Travel Planning Platform',
    },
    description: {
      zh: '網頁設計課程期末專題：以 Django 實作的旅遊規劃平台，提供天氣查詢、行程規劃、行事曆紀錄和地圖導航功能',
      en: 'Web Design course project: A travel planning platform implemented with Django, providing weather information, trip planning, calendar recording, and map navigation features',
    },
    techStack: ['Django', 'Leaflet.js', 'Python', 'JavaScript', 'HTML/CSS', 'OpenWeather API'],
    highlights: {
      zh: ['API 整合', '系統設計'],
      en: ['API Integration', 'System Design'],
    },
    githubUrl: 'https://github.com/ethan-devlab/travel_planning',
  },    
  {
    title: {
      zh: 'MASM 和 SIC/XE 組合語言程式',
      en: 'MASM and SIC/XE Assembly Program',
    },
    description: {
      zh: '系統程式課程期中期末專題：以 MASM 和 SIC/XE 組合語言分別實作 BFS、DFS 和 Bubble Sort',
      en: 'System Programming course project: Implementing BFS, DFS, and Bubble Sort in MASM and SIC/XE assembly languages',
    },
    techStack: ['MASM', 'SIC/XE'],
    highlights: {
      zh: ['組合語言', '底層程式設計'],
      en: ['Assembly language', 'Low-level programming'],
    },
    githubUrl: 'https://github.com/ethan-devlab/MASM_SIC-XE',
  },    
  {
    title: {
      zh: 'Simple C2C E-commerce Platform',
      en: 'Simple C2C E-commerce Platform',
    },
    description: {
      zh: '軟體測試課程期末專題：以 Java 實作的簡易 C2C 電商平台並制定測試策略',
      en: 'Software Testing course final project: A simple C2C (Customer to Customer) e-commerce platform implemented in Java with a defined testing strategy',
    },
    techStack: ['Java', 'JUnit', 'Spring Boot', 'Jacoco', 'Log4j2', 'Maven', 'PMD', 'Mockito'],
    highlights: {
      zh: ['OOP 開發', '單元測試', '測試覆蓋率分析', '整合測試'],
      en: ['OOP development', 'Unit testing', 'Test coverage analysis', 'Integration testing'],
    },
    githubUrl: 'https://github.com/ethan-devlab/C2C-Ecommerce',
  },
  {
    title: {
      zh: '連線對戰五子棋',
      en: 'Gomoku for Online Multiplayer',
    },
    description: {
      zh: '物件導向設計課程期末專題：以 Java 實作連線對戰五子棋遊戲',
      en: 'Object-Oriented Design course final project: An online multiplayer Gomoku game implemented in Java',
    },
    techStack: ['Java', 'Swing', 'Socket'],
    highlights: {
      zh: ['模組化設計', 'MVC 架構'],
      en: ['Modular design', 'MVC architecture'],
    },
    githubUrl: 'https://github.com/ethan-devlab/Gomoku',
  },
  {
    title: {
      zh: 'C2C 網購平台',
      en: 'C2C E-commerce Platform',
    },
    description: {
      zh: '資料庫系統期末專題：以 Django + MySQL 實作的 C2C 電商平台，涵蓋使用者、商家、平台管理者的多角色功能',
      en: 'Database Systems course final project: A C2C e-commerce platform implemented with Django and MySQL, covering multi-role functionalities for users, sellers, and platform administrators.',
    },
    techStack: ['Python', 'Django', 'MySQL'],
    highlights: {
      zh: ['MySQL 資料庫設計', 'DB Schema 設計'],
      en: ['MySQL database design', 'DB Schema design'],
    },
    githubUrl: 'https://github.com/ethan-devlab/HahaLife',
  },
 {
    title: {
      zh: 'Logic Function Solver',
      en: 'Logic Function Solver',
    },
    description: {
      zh: '以 Python 實作的邏輯函數求解器，支援布林函數的最小化與化簡',
      en: 'A logic function solver implemented in Python using Tabulation method, supporting minimization and simplification of Boolean functions.',
    },
    techStack: ['Python', 'Tabulation method'],
    highlights: {
      zh: ['邏輯函數求解'],
      en: ['Logic function solving'],
    },
    githubUrl: 'https://github.com/ethan-devlab/logic_function_solver',
  },
  {
    title: {
      zh: '天氣預報應用程式',
      en: 'Weather Forecast Application',
    },
    description: {
      zh: '計算機概論期期末專題：串接 OpenWeather API 的天氣預報應用程式',
      en: 'Computer Science course project: A weather forecast application that integrates with the OpenWeather API',
    },
    techStack: ['Python', 'Django', 'OpenWeather API'],
    highlights: {
      zh: ['API 整合'],
      en: ['API Integration'],
    },
    githubUrl: 'https://github.com/ethan-devlab/weather_app',
  }, 
]
