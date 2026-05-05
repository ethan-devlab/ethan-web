import { Link } from 'react-router-dom'
import type { BlogPost } from '../../utils/blog'
import type { Language } from '../../i18n/locales'
import { Badge } from '../common/Badge'
import { Card } from '../common/Card'
import { BsPinAngle } from "react-icons/bs";

type BlogCardProps = {
  lang: Language
  post: BlogPost
}

export function BlogCard({ lang, post }: BlogCardProps) {
  return (
    <Card className="blog-card">
      <div className="blog-meta">
        <span>{post.date}</span>
        <span>{post.category}</span>
        <span>{post.pin && <BsPinAngle size={20}/>}</span>
      </div>
      <h3>{post.title}</h3>
      <p>{post.description}</p>
      <div className="stack-list">
        {post.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <Link className="header__link" to={`/${lang}/blog/${post.slug}`}>
        {lang === 'zh' ? '閱讀文章' : 'Read Article'}
      </Link>
    </Card>
  )
}
