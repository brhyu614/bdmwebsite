import type { MDXComponents } from 'mdx/types'
import Callout from './Callout'

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="mb-6 mt-10 text-3xl font-bold leading-tight text-text"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mb-4 mt-8 text-2xl font-bold leading-snug text-text"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mb-3 mt-6 text-lg font-bold leading-snug text-text"
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:decoration-accent"
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-4 border-accent pl-4 font-serif italic text-subtext"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-sm text-text"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg bg-stone-900 p-4 font-mono text-sm text-stone-100"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-border" />,
  // Custom components
  Callout,
}
