import { Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom'
import { lazy } from 'react'
import { Layout } from '../components/layout/Layout'
import { DEFAULT_LANGUAGE, isLanguage } from '../i18n/locales'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { pageLoaders } from './pageLoaders'

const ExperiencePage = lazy(pageLoaders.experience)
const ResumePage = lazy(pageLoaders.resume)
const PhotographyPage = lazy(pageLoaders.photography)
const BlogListPage = lazy(pageLoaders.blog)
const BlogPostPage = lazy(pageLoaders.blogPost)
const ContactPage = lazy(pageLoaders.contact)

function LanguageGuard() {
  const { lang } = useParams()
  if (!isLanguage(lang)) {
    return <Navigate to={`/${DEFAULT_LANGUAGE}/`} replace />
  }
  return <Outlet />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${DEFAULT_LANGUAGE}/`} replace />} />
      <Route element={<Layout />}>
        <Route path="/:lang" element={<LanguageGuard />}>
          <Route index element={<HomePage />} />
          <Route path="experience" element={<ExperiencePage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="photography" element={<PhotographyPage />} />
          <Route path="blog" element={<BlogListPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
