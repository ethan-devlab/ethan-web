import { Link } from 'react-router-dom'
import type { BlogPost } from '../../utils/blog'
import type { Language } from '../../i18n/locales'
import { Badge } from '../common/Badge'
import { Card } from '../common/Card'
import { BsPinAngle } from 'react-icons/bs'

type BlogCardProps = {
  lang: Language
  post: BlogPost
  preserveDraftPreview?: boolean
}

export function BlogCard({ lang, post, preserveDraftPreview = false }: BlogCardProps) {
  const articlePath = `/${post.lang}/blog/${post.slug}`
  const articleLink = preserveDraftPreview ? `${articlePath}?preview=drafts` : articlePath
  const cardClassName = `blog-card${post.published ? '' : ' blog-card--draft'}`

  return (
    <Card className={cardClassName}>
      <div className="blog-meta">
        <span>{post.date}</span>
        <span>{post.category}</span>
        {post.pin ? (
          <span aria-label={lang === 'zh' ? '置頂文章' : 'Pinned post'}>
            <BsPinAngle size={20} />
          </span>
        ) : null}
        {!post.published ? <span className="blog-draft-badge">{lang === 'zh' ? '草稿' : 'Draft'}</span> : null}
      </div>
      <h3>{post.title}</h3>
      <p>{post.description}</p>
      <div className="stack-list">
        {post.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <Link className="header__link" to={articleLink}>
        {lang === 'zh' ? '閱讀文章' : 'Read Article'}
      </Link>
    </Card>
  )
}
