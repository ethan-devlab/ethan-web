import { useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { BlogCard } from '../components/blog/BlogCard'
import { BlogFilters } from '../components/blog/BlogFilters'
import { BlogLayout } from '../components/blog/BlogLayout'
import { SEO } from '../components/common/SEO'
import { DEFAULT_LANGUAGE, isLanguage, type Language } from '../i18n/locales'
import { filterPosts, getBlogPosts, getCategories, getTags, isDraftPreviewEnabled } from '../utils/blog'

function resolveLanguage(lang: string | undefined): Language {
  if (!lang || !isLanguage(lang)) {
    return DEFAULT_LANGUAGE
  }
  return lang
}

export function BlogListPage() {
  const { lang } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const language = resolveLanguage(lang)
  const draftPreviewEnabled = isDraftPreviewEnabled(searchParams)
  const posts = useMemo(() => getBlogPosts({ includeDrafts: draftPreviewEnabled }), [draftPreviewEnabled])
  const categories = useMemo(() => getCategories(posts), [posts])
  const tags = useMemo(() => getTags(posts), [posts])

  const [searchText, setSearchText] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTag, setSelectedTag] = useState('all')

  const filtered = useMemo(
    () => filterPosts(posts, searchText, selectedLanguage, selectedCategory, selectedTag),
    [posts, searchText, selectedLanguage, selectedCategory, selectedTag],
  )
  const previewHeading = language === 'zh' ? '草稿預覽' : 'Draft preview'
  const previewDescription = draftPreviewEnabled
    ? language === 'zh'
      ? '現在包含未發佈文章。'
      : 'Unpublished posts are included.'
    : language === 'zh'
      ? '目前只顯示已發佈文章。'
      : 'Only published posts are visible.'
  const previewButtonLabel = draftPreviewEnabled
    ? language === 'zh'
      ? '關閉預覽'
      : 'Disable preview'
    : language === 'zh'
      ? '開啟預覽'
      : 'Enable preview'

  function handleDraftPreviewToggle() {
    const nextSearchParams = new URLSearchParams(searchParams)

    if (draftPreviewEnabled) {
      nextSearchParams.delete('preview')
    } else {
      nextSearchParams.set('preview', 'drafts')
    }

    setSearchParams(nextSearchParams, { replace: true })
  }

  return (
    <>
      <SEO
        title={language === 'zh' ? '部落格' : 'Blog'}
        description={
          language === 'zh'
            ? '瀏覽 Ethan 的技術文章，支援分類、標籤與搜尋。'
            : "Browse Ethan's technical writing with category, tag, and search filtering."
        }
        path={`/${language}/blog`}
      />

      <BlogLayout lang={language}>
        {import.meta.env.DEV ? (
          <div className="draft-preview" data-active={draftPreviewEnabled}>
            <div className="draft-preview__copy">
              <strong>{previewHeading}</strong>
              <span>{previewDescription}</span>
            </div>
            <button
              className="btn btn--secondary draft-preview__button"
              type="button"
              aria-pressed={draftPreviewEnabled}
              onClick={handleDraftPreviewToggle}
            >
              {previewButtonLabel}
            </button>
          </div>
        ) : null}

        <BlogFilters
          lang={language}
          searchText={searchText}
          onSearchTextChange={setSearchText}
          language={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          category={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          tag={selectedTag}
          onTagChange={setSelectedTag}
          tags={tags}
        />

        {filtered.length === 0 ? (
          <div className="empty-state">
            {language === 'zh' ? '目前沒有符合條件的文章。' : 'No posts matched your filters.'}
          </div>
        ) : (
          <div className="blog-grid">
            {filtered.map((post) => (
              <BlogCard
                key={`${post.lang}-${post.slug}`}
                lang={language}
                post={post}
                preserveDraftPreview={draftPreviewEnabled}
              />
            ))}
          </div>
        )}
      </BlogLayout>
    </>
  )
}
