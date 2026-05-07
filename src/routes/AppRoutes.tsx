import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { DEFAULT_LANGUAGE, isLanguage } from '../i18n/locales'
import { HomePage } from '../pages/HomePage'
import { ExperiencePage } from '../pages/ExperiencePage'
import { PhotographyPage } from '../pages/PhotographyPage'
import { BlogListPage } from '../pages/BlogListPage'
import { BlogPostPage } from '../pages/BlogPostPage'
import { ContactPage } from '../pages/ContactPage'
import { NotFoundPage } from '../pages/NotFoundPage'

function LanguageGuard() {
  const { lang } = useParams()
  if (!isLanguage(lang)) {
    return <Navigate to={`/${DEFAULT_LANGUAGE}/`} replace />
  }
  return <Layout />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${DEFAULT_LANGUAGE}/`} replace />} />
      <Route path="/:lang" element={<LanguageGuard />}>
        <Route index element={<HomePage />} />
        <Route path="experience" element={<ExperiencePage />} />
        <Route path="photography" element={<PhotographyPage />} />
        <Route path="blog" element={<BlogListPage />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
