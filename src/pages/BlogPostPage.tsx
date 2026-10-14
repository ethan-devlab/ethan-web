import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { BlogLayout } from '../components/blog/BlogLayout'
import { Callout, MdxCodeBlock, MdxInlineCode, MdxTable } from '../components/blog/MDXComponents'
import { ButtonLabel } from '../components/common/ButtonLabel'
import { ContentErrorBoundary } from '../components/common/ContentErrorBoundary'
import { SEO } from '../components/common/SEO'
import { DEFAULT_LANGUAGE, isLanguage, type Language } from '../i18n/locales'
import { trackButtonClick } from '../utils/analytics'
import { getBlogPostBySlug, isDraftPreviewEnabled } from '../utils/blog'
import { getBlogFiltersFromState } from '../utils/blogNavigation'

function resolveLanguage(lang: string | undefined): Language {
  if (!lang || !isLanguage(lang)) {
    return DEFAULT_LANGUAGE
  }
  return lang
}

export function BlogPostPage() {
  const { lang, slug } = useParams()
  const location = useLocation()
  const filters = getBlogFiltersFromState(location.state)
  const returnState = filters ? { blogFilters: filters } : undefined
  const [searchParams] = useSearchParams()
  const language = resolveLanguage(lang)
  const draftPreviewEnabled = isDraftPreviewEnabled(searchParams)
  const post = getBlogPostBySlug(slug ?? '', language, { includeDrafts: draftPreviewEnabled })
  const blogIndexPath = draftPreviewEnabled ? `/${language}/blog?preview=drafts` : `/${language}/blog`

  if (!post) {
    return (
      <BlogLayout lang={language}>
        <div className="empty-state">
          {language === 'zh' ? '文章不存在或尚未發佈。' : 'The post does not exist or is not published yet.'}
        </div>
        <Link
          className="btn btn--secondary"
          to={blogIndexPath}
          state={returnState}
          onClick={() =>
            trackButtonClick({ label: 'back_to_blog', area: 'blog_post_empty_state', target: blogIndexPath })
          }
        >
          <ButtonLabel>{language === 'zh' ? '返回部落格' : 'Back to Blog'}</ButtonLabel>
        </Link>
      </BlogLayout>
    )
  }

  const PostComponent = post.Component
  const mdxComponents = {
    Callout,
    MdxTable,
    pre: MdxCodeBlock,
    code: MdxInlineCode,
    table: MdxTable,
  }

  return (
    <>
      <SEO
        title={post.title}
        description={post.description}
        path={`/${language}/blog/${post.slug}`}
        type="article"
        robots={post.published ? undefined : 'noindex,nofollow'}
      />

      <BlogLayout lang={language}>
        <article className="blog-article">
          <header>
            <p className="timeline__period">
              {post.date} · {post.category} {!post.lastmod ? null : `· ${language === 'zh' ? '最後更新' : 'Last Modified'}: ${post.lastmod}`}
              {!post.published ? (
                <span className="blog-article__draft-badge">{language === 'zh' ? '草稿' : 'Draft'}</span>
              ) : null}
            </p>
            <h1>{post.title}</h1>
            <p>{post.description}</p>
          </header>
          <ContentErrorBoundary key={`${post.lang}-${post.slug}`}>
            <PostComponent components={mdxComponents} />
          </ContentErrorBoundary>
        </article>
        <div className="blog-article__navigation">
          <Link
            className="btn btn--secondary"
            to={blogIndexPath}
            state={returnState}
            onClick={() =>
              trackButtonClick({ label: 'back_to_blog', area: 'blog_post_footer', target: blogIndexPath })
            }
          >
            <ButtonLabel>{language === 'zh' ? '返回部落格' : 'Back to Blog'}</ButtonLabel>
          </Link>
        </div>
      </BlogLayout>
    </>
  )
}
