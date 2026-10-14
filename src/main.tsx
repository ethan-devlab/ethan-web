import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { initializeTheme } from './utils/theme'
import { initializeAnalytics } from './utils/analytics'
import { initializeVersionRecovery } from './utils/versionRecovery'
import './styles/tokens.css'
import './styles/globals.css'

initializeTheme()
initializeAnalytics()
initializeVersionRecovery()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
