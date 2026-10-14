import { Link } from 'react-router-dom'
import type { BlogPost } from '../../utils/blog'
import type { Language } from '../../i18n/locales'
import { Badge } from '../common/Badge'
import { Card } from '../common/Card'
import { BsPinAngle } from 'react-icons/bs'
import type { BlogFilterState } from '../../utils/blogNavigation'

type BlogCardProps = {
  lang: Language
  post: BlogPost
  preserveDraftPreview?: boolean
  rowsLayout?: boolean
  filters?: BlogFilterState
}

export function BlogCard({ lang, post, preserveDraftPreview = false, rowsLayout = false, filters }: BlogCardProps) {
  const articlePath = `/${post.lang}/blog/${post.slug}`
  const articleLink = preserveDraftPreview ? `${articlePath}?preview=drafts` : articlePath
  const navigationState = filters ? { blogFilters: filters } : undefined
  const cardClassName = `blog-card${post.published ? '' : ' blog-card--draft'}`
  const pinIndicator = post.pin ? (
    <span aria-label={lang === 'zh' ? '置頂文章' : 'Pinned post'}>
      <BsPinAngle size={20} />
    </span>
  ) : null

  return (
    <Card className={cardClassName}>
      <div className="blog-meta">
        {rowsLayout ? (
          <div className="blog-meta__date">
            <span>{post.date}</span>
            {pinIndicator}
          </div>
        ) : <span>{post.date}</span>}
        <span>{post.category}</span>
        {!rowsLayout ? pinIndicator : null}
        {!post.published ? <span className="blog-draft-badge">{lang === 'zh' ? '草稿' : 'Draft'}</span> : null}
      </div>
      <h3><Link className="blog-card__title-link" to={articleLink} state={navigationState}>{post.title}</Link></h3>
      <p>{post.description}</p>
      <div className="stack-list">
        {post.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <Link className="header__link" to={articleLink} state={navigationState}>
        {lang === 'zh' ? '閱讀文章' : 'Read Article'}
      </Link>
    </Card>
  )
}
