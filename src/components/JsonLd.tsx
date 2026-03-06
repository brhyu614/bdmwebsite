import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, AUTHOR_NAME, INSTAGRAM_URL, CONTACT_EMAIL } from '@/lib/constants'

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
        alternateName: 'Big Data Marketing Lab',
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        inLanguage: 'ko',
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
        image: data?.coverImage ?? undefined,
        keywords: data?.tags ? (data.tags as string[]).join(', ') : undefined,
        author: {
          '@type': 'Person',
          name: AUTHOR_NAME,
          url: SITE_URL,
          affiliation: {
            '@type': 'CollegeOrUniversity',
            name: '한양대학교',
            alternateName: 'Hanyang University',
          },
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          alternateName: 'Big Data Marketing Lab',
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
          '@type': 'CollegeOrUniversity',
          name: '한양대학교',
          alternateName: 'Hanyang University',
          department: {
            '@type': 'Organization',
            name: '빅데이터마케팅 랩',
            alternateName: 'Big Data Marketing Lab',
          },
        },
        worksFor: {
          '@type': 'Organization',
          name: SITE_NAME,
          alternateName: 'Big Data Marketing Lab',
          url: SITE_URL,
        },
        url: SITE_URL,
        sameAs: [INSTAGRAM_URL],
      }
    case 'organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        alternateName: 'Big Data Marketing Lab',
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        email: CONTACT_EMAIL,
        parentOrganization: {
          '@type': 'CollegeOrUniversity',
          name: '한양대학교',
          alternateName: 'Hanyang University',
        },
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
