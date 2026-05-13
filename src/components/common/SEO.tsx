import { Helmet } from 'react-helmet-async'
import { getCanonicalUrl, SITE_NAME } from '../../utils/seo'

type SEOProps = {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  robots?: string
}

export function SEO({ title, description, path, type = 'website', robots }: SEOProps) {
  const canonical = getCanonicalUrl(path)
  const fullTitle = `${title} | ${SITE_NAME}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      {robots ? <meta name="robots" content={robots} /> : null}
    </Helmet>
  )
}
