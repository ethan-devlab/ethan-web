import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { initializeTheme } from './utils/theme'
import { initializeAnalytics } from './utils/analytics'
import './styles/tokens.css'
import './styles/globals.css'

initializeTheme()
initializeAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
