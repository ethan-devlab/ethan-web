import { Link, useParams } from 'react-router-dom'
import { BlogLayout } from '../components/blog/BlogLayout'
import { Callout, MdxCodeBlock, MdxInlineCode } from '../components/blog/MDXComponents'
import { SEO } from '../components/common/SEO'
import { DEFAULT_LANGUAGE, isLanguage, type Language } from '../i18n/locales'
import { getPublishedPostBySlug } from '../utils/blog'

function resolveLanguage(lang: string | undefined): Language {
  if (!lang || !isLanguage(lang)) {
    return DEFAULT_LANGUAGE
  }
  return lang
}

export function BlogPostPage() {
  const { lang, slug } = useParams()
  const language = resolveLanguage(lang)
  const post = getPublishedPostBySlug(language, slug ?? '')

  if (!post) {
    return (
      <BlogLayout lang={language}>
        <div className="empty-state">
          {language === 'zh' ? '文章不存在或尚未發佈。' : 'The post does not exist or is not published yet.'}
        </div>
        <Link className="btn btn--secondary" to={`/${language}/blog`}>
          {language === 'zh' ? '返回部落格' : 'Back to Blog'}
        </Link>
      </BlogLayout>
    )
  }

  const PostComponent = post.Component
  const mdxComponents = {
    Callout,
    pre: MdxCodeBlock,
    code: MdxInlineCode,
  }

  return (
    <>
      <SEO
        title={post.title}
        description={post.description}
        path={`/${language}/blog/${post.slug}`}
        type="article"
      />

      <BlogLayout lang={language}>
        <article className="blog-article">
          <header>
            <p className="timeline__period">
              {post.date} · {post.category}
            </p>
            <h1>{post.title}</h1>
            <p>{post.description}</p>
          </header>
          <PostComponent components={mdxComponents} />
        </article>
      </BlogLayout>
    </>
  )
}
