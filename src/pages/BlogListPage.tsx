import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BlogCard } from '../components/blog/BlogCard'
import { BlogFilters } from '../components/blog/BlogFilters'
import { BlogLayout } from '../components/blog/BlogLayout'
import { ButtonLabel } from '../components/common/ButtonLabel'
import { SEO } from '../components/common/SEO'
import { DEFAULT_LANGUAGE, isLanguage, type Language } from '../i18n/locales'
import { filterPosts, getBlogPosts, getCategories, getTags, isDraftPreviewEnabled } from '../utils/blog'
import { getBlogFiltersFromState } from '../utils/blogNavigation'
import '../styles/blog-list-review.css'

function resolveLanguage(lang: string | undefined): Language {
  if (!lang || !isLanguage(lang)) {
    return DEFAULT_LANGUAGE
  }
  return lang
}

export function BlogListPage() {
  const { lang } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const initialFilters = getBlogFiltersFromState(location.state)
  const [searchParams, setSearchParams] = useSearchParams()
  const language = resolveLanguage(lang)
  const draftPreviewEnabled = isDraftPreviewEnabled(searchParams)
  const posts = useMemo(() => getBlogPosts({ includeDrafts: draftPreviewEnabled }), [draftPreviewEnabled])
  const categories = useMemo(() => getCategories(posts), [posts])
  const tags = useMemo(() => getTags(posts), [posts])

  const [searchText, setSearchText] = useState(initialFilters?.searchText ?? '')
  const [selectedLanguage, setSelectedLanguage] = useState(initialFilters?.selectedLanguage ?? 'all')
  const [selectedCategory, setSelectedCategory] = useState(initialFilters?.selectedCategory ?? 'all')
  const [selectedTag, setSelectedTag] = useState(initialFilters?.selectedTag ?? 'all')

  useEffect(() => {
    const storedFilters = getBlogFiltersFromState(location.state)
    if (
      storedFilters?.searchText === searchText
      && storedFilters.selectedLanguage === selectedLanguage
      && storedFilters.selectedCategory === selectedCategory
      && storedFilters.selectedTag === selectedTag
    ) return

    navigate(
      { pathname: location.pathname, search: location.search, hash: location.hash },
      {
        replace: true,
        state: {
          ...(location.state && typeof location.state === 'object' ? location.state : {}),
          blogFilters: { searchText, selectedLanguage, selectedCategory, selectedTag },
        },
      },
    )
  }, [location.hash, location.pathname, location.search, location.state, navigate, searchText, selectedLanguage, selectedCategory, selectedTag])

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
              <ButtonLabel>{previewButtonLabel}</ButtonLabel>
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
          <div className="blog-grid blog-grid--rows blog-grid--clear-lines">
            {filtered.map((post) => (
              <BlogCard
                key={`${post.lang}-${post.slug}`}
                lang={language}
                post={post}
                preserveDraftPreview={draftPreviewEnabled}
                rowsLayout
                filters={{ searchText, selectedLanguage, selectedCategory, selectedTag }}
              />
            ))}
          </div>
        )}
      </BlogLayout>
    </>
  )
}
