import fs from 'fs'
import path from 'path'
import type { Article, ArticleFrontmatter } from './types'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles')

function parseFrontmatter(fileContent: string): {
  frontmatter: ArticleFrontmatter
  content: string
} {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)

  if (!match) {
    throw new Error('No frontmatter found')
  }

  const frontmatterBlock = match[1]
  const content = fileContent.replace(frontmatterRegex, '').trim()

  const frontmatter: Record<string, unknown> = {}
  const lines = frontmatterBlock.trim().split('\n')

  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue

    const key = line.slice(0, colonIndex).trim()
    let value: unknown = line.slice(colonIndex + 1).trim()

    if (typeof value === 'string') {
      // Handle quoted strings
      value = (value as string).replace(/^['"](.*)['"]$/, '$1')

      // Handle arrays like ["tag1", "tag2"]
      if ((value as string).startsWith('[')) {
        value = (value as string)
          .slice(1, -1)
          .split(',')
          .map((s: string) => s.trim().replace(/^['"]|['"]$/g, ''))
      }

      // Handle booleans
      if (value === 'true') value = true
      if (value === 'false') value = false

      // Handle numbers
      if (
        typeof value === 'string' &&
        value !== '' &&
        !isNaN(Number(value))
      ) {
        value = Number(value)
      }
    }

    frontmatter[key] = value
  }

  return { frontmatter: frontmatter as unknown as ArticleFrontmatter, content }
}

function getMDXFiles(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => path.extname(file) === '.mdx')
}

function readArticle(fileName: string): Article {
  const filePath = path.join(CONTENT_DIR, fileName)
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  const { frontmatter, content } = parseFrontmatter(rawContent)
  const slug = fileName.replace(/\.mdx$/, '')

  return { slug, frontmatter, content }
}

export function getAllArticles(): Article[] {
  const files = getMDXFiles()
  return files
    .map(readArticle)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )
}

export function getArticleBySlug(slug: string): Article | undefined {
  const files = getMDXFiles()
  const fileName = files.find((f) => f.replace(/\.mdx$/, '') === slug)
  if (!fileName) return undefined
  return readArticle(fileName)
}

export function getFeaturedArticle(): Article | undefined {
  return getAllArticles().find((a) => a.frontmatter.featured)
}

export function getArticlesBySeries(series: string): Article[] {
  return getAllArticles().filter((a) => a.frontmatter.series === series)
}

export function getAllTags(): string[] {
  const articles = getAllArticles()
  const tagSet = new Set<string>()
  articles.forEach((a) => a.frontmatter.tags.forEach((t) => tagSet.add(t)))
  return Array.from(tagSet).sort()
}
