import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card } from '../components/common/Card'
import { SEO } from '../components/common/SEO'
import { Section } from '../components/common/Section'
import { DEFAULT_LANGUAGE, isLanguage, type Language } from '../i18n/locales'
import { trackButtonClick } from '../utils/analytics'
import { getButtonClass } from '../utils/button'

type ResumeCopy = {
  title: string
  description: string
  updated: string
  english: string
  chinese: string
  view: string
  download: string
  preview: string
  previewFallback: string
  previewUnavailable: string
}

const resumeCopy: Record<Language, ResumeCopy> = {
  en: {
    title: 'Resume',
    description: 'Software Engineering · Automation · AI Agent · System Architecture',
    updated: 'Last updated: July 2026',
    english: 'English Resume',
    chinese: 'Chinese Resume',
    view: 'View PDF',
    download: 'Download PDF',
    preview: 'English resume preview',
    previewFallback: 'Your browser cannot preview this PDF. Use the view or download link above.',
    previewUnavailable: 'The preview is currently unavailable. Please check back later.',
  },
  zh: {
    title: '履歷',
    description: '軟體工程 · 自動化 · AI Agent · 系統架構',
    updated: '最後更新：2026 年 7 月',
    english: '英文履歷',
    chinese: '中文履歷',
    view: '檢視 PDF',
    download: '下載 PDF',
    preview: '中文履歷預覽',
    previewFallback: '此瀏覽器無法預覽 PDF，請使用上方檢視或下載連結。',
    previewUnavailable: '預覽目前無法使用，請稍後再試。',
  },
}

const resumeFiles = {
  en: '/resume/Ethan-Chan-Resume-EN.pdf',
  zh: '/resume/Ethan-Chan-Resume-ZH.pdf',
} as const

type PreviewAvailability = {
  file: string
  isAvailable: boolean
}

function resolveLanguage(lang: string | undefined): Language {
  return lang && isLanguage(lang) ? lang : DEFAULT_LANGUAGE
}

export function ResumePage() {
  const { lang } = useParams()
  const language = resolveLanguage(lang)
  const copy = resumeCopy[language]
  const previewFile = resumeFiles[language]
  const [previewAvailability, setPreviewAvailability] = useState<PreviewAvailability | null>(null)

  useEffect(() => {
    let isCurrent = true
    void fetch(previewFile, { method: 'HEAD' })
      .then((response) => {
        const contentType = response.headers.get('content-type')
        if (isCurrent) {
          setPreviewAvailability({
            file: previewFile,
            isAvailable: response.ok && contentType?.includes('application/pdf') === true,
          })
        }
      })
      .catch(() => {
        if (isCurrent) {
          setPreviewAvailability({ file: previewFile, isAvailable: false })
        }
      })

    return () => {
      isCurrent = false
    }
  }, [previewFile])

  const isPreviewAvailable =
    previewAvailability?.file === previewFile ? previewAvailability.isAvailable : null

  return (
    <>
      <SEO title={copy.title} description={copy.description} path={`/${language}/resume`} />
      <Section title={copy.title} description={copy.description} className="resume-section">
        <p className="resume__updated">{copy.updated}</p>
        <div className="resume__documents">
          {(['en', 'zh'] as const).map((documentLanguage) => {
            const documentPath = resumeFiles[documentLanguage]
            const documentTitle = documentLanguage === 'en' ? copy.english : copy.chinese

            return (
              <Card key={documentLanguage} className="resume__document">
                <h3>{documentTitle}</h3>
                <div className="resume__actions">
                  <a
                    className={getButtonClass('secondary')}
                    href={documentPath}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      trackButtonClick({
                        label: `resume_view_${documentLanguage}`,
                        area: 'resume_documents',
                        target: documentPath,
                      })
                    }
                  >
                    {copy.view}
                  </a>
                  <a
                    className={getButtonClass('tertiary')}
                    href={documentPath}
                    download
                    onClick={() =>
                      trackButtonClick({
                        label: `resume_download_${documentLanguage}`,
                        area: 'resume_documents',
                        target: documentPath,
                      })
                    }
                  >
                    {copy.download}
                  </a>
                </div>
              </Card>
            )
          })}
        </div>
        {isPreviewAvailable === true ? (
          <Card className="resume__preview">
            <h3>{copy.preview}</h3>
            <iframe src={previewFile} title={copy.preview}>
              {copy.previewFallback}
            </iframe>
          </Card>
        ) : isPreviewAvailable === false ? (
          <Card className="resume__preview">
            <h3>{copy.preview}</h3>
            <p className="resume__preview-unavailable">{copy.previewUnavailable}</p>
          </Card>
        ) : null}
      </Section>
    </>
  )
}
