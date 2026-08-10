import type { SkillGroup } from './types'

export const skillGroups: SkillGroup[] = [
  {
    title: {
      en: 'Backend Engineering',
      zh: '後端',
    },
    items: ['Node.js', 'Python', 'Java', 'RESTful APIs', 'Microservices', 'API Integration'],
  },
  {
    title: {
      en: 'Database & Data Modeling',
      zh: '資料庫與資料建模',
    },
    items: ['Relational Database Design', 'MySQL', 'PostgreSQL', 'Milvus', 'Supabase', 'Schema Design', 'Data Modeling'],
  },
  {
    title: {
      en: 'System Architecture',
      zh: '系統架構',
    },
    items: ['System Design', 'API Design', 'Domain Modeling', 'Scalability Planning', 'Authentication Flow'],
  },
  {
    title: {
      en: 'Web Development',
      zh: '網站開發',
    },
    items: ['React', 'Django', 'Flask', 'Tailwind CSS', 'HTML', 'CSS', 'JavaScript', 'Responsive Web Design'],
  },
  {
    title: {
      en: 'AI Applications',
      zh: 'AI 應用',
    },
    items: ['Machine Learning', 'Deep Learning', 'OpenAI', 'Gemini', 'Claude', 'LangChain', 'Ollama', 'oMLX', 'LlamaIndex',],
  },
  {
    title: {
      en: 'Drone & Computer Vision',
      zh: '無人機與電腦視覺',
    },
    items: ['OpenCV', 'Pegasus Simulator', 'PX4 Autopilot', 'QGroundControl', 'Mission Planner', 'MAVSDK'],
  },
  {
    title: {
      en: 'DevOps, Cloud & Containers',
      zh: 'DevOps、雲端與容器',
    },
    items: ['Docker', 'GCP', 'Isaac Sim', 'Git', 'GitHub', 'Cloudflare', 'CI/CD', 'Deployment Workflow'],
  },
  {
    title: {
      en: 'Automation & IoT',
      zh: '自動化與物聯網',
    },
    items: ['Sensor Fusion', 'ESP32', 'Raspberry Pi', 'Jetson Nano', 'n8n', 'Google Apps Script'],
  },
]
