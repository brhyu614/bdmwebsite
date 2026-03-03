import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, AUTHOR_NAME, INSTAGRAM_URL } from '@/lib/constants'

interface JsonLdProps {
  type: 'website' | 'article' | 'person' | 'organization'
  data?: Record<string, unknown>
}

function generateSchema(type: string, data?: Record<string, unknown>) {
  switch (type) {
    case 'website':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
        },
      }
    case 'article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data?.title,
        description: data?.excerpt,
        datePublished: data?.date,
        author: {
          '@type': 'Person',
          name: AUTHOR_NAME,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/articles/${data?.slug}`,
        },
      }
    case 'person':
      return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: AUTHOR_NAME,
        jobTitle: '교수',
        affiliation: {
          '@type': 'Organization',
          name: SITE_NAME,
        },
        sameAs: [INSTAGRAM_URL],
      }
    case 'organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        sameAs: [INSTAGRAM_URL],
      }
    default:
      return {}
  }
}

export default function JsonLd({ type, data }: JsonLdProps) {
  const schema = generateSchema(type, data)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
