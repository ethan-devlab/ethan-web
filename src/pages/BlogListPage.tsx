import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BlogCard } from '../components/blog/BlogCard'
import { BlogFilters } from '../components/blog/BlogFilters'
import { BlogLayout } from '../components/blog/BlogLayout'
import { SEO } from '../components/common/SEO'
import { DEFAULT_LANGUAGE, isLanguage, type Language } from '../i18n/locales'
import { filterPosts, getAllPosts, getCategories, getTags } from '../utils/blog'

function resolveLanguage(lang: string | undefined): Language {
  if (!lang || !isLanguage(lang)) {
    return DEFAULT_LANGUAGE
  }
  return lang
}

export function BlogListPage() {
  const { lang } = useParams()
  const language = resolveLanguage(lang)
  // const posts = useMemo(() => getPublishedPostsByLang(language), [language])
  const posts = useMemo(() => getAllPosts(), [])
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
              <BlogCard key={`${post.lang}-${post.slug}`} lang={language} post={post} />
            ))}
          </div>
        )}
      </BlogLayout>
    </>
  )
}
