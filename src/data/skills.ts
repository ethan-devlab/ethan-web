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
      en: 'Web',
      zh: 'Web',
    },
    items: ['React', 'Django', 'Flask', 'Tailwind CSS', 'HTML', 'CSS', 'JavaScript', 'Responsive Web Design'],
  },
  {
    title: {
      en: 'AI Tools',
      zh: 'AI 工具',
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
      en: 'IoT',
      zh: '物聯網',
    },
    items: ['Sensor Fusion', 'ESP32', 'Raspberry Pi', 'Jetson Nano'],
  },
  {
    title: {
      en: 'Automation',
      zh: '自動化',
    },
    items: ['n8n', 'Google Apps Script'],
  },
  // {
  //   title: 'System Architecture',
  //   items: ['System Design', 'API Design', 'Domain Modeling', 'Scalability Planning', 'Authentication Flow'],
  // },
  {
    title: {
      en: 'Database',
      zh: '資料庫',
    },
    items: ['Relational Database Design', 'MySQL', 'PostgreSQL', 'Milvus', 'Supabase', 'Schema Design', 'Data Modeling'],
  },
  {
    title: {
      en: 'Containerization, Cloud & Simulation',
      zh: '容器化、雲端與模擬平台',
    },
    items: ['Docker', 'GCP', 'Isaac Sim'],
  },
  {
    title: {
      en: 'DevOps',
      zh: 'DevOps',
    },
    items: ['Git', 'GitHub', 'Zeabur', 'CI/CD', 'Deployment Workflow'],
  },
]
