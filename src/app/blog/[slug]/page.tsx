import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BrandLogo } from '../../../components/BrandLogo'
import { SiteName } from '../../../components/SiteName'
import { BLOG_POSTS, findPost, formatPostDate } from '../../../data/blog'

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = findPost(slug)
  if (!post) return { title: 'Post not found' }
  return {
    title: `${post.title} · Cloudeasy Devops Portal`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = findPost(slug)
  if (!post) notFound()

  return (
    <article className="landing post-page">
      <header className="landing-nav">
        <Link href="/" className="landing-brand">
          <BrandLogo size={36} />
          <SiteName />
        </Link>
        <nav className="landing-nav-links">
          <Link href="/#blog">Blog</Link>
          <Link href="/login" className="landing-signin">
            Sign in
          </Link>
        </nav>
      </header>
      <div className="post-wrap">
        <Link href="/#blog" className="post-back">
          <i className="bi bi-arrow-left" /> All posts
        </Link>
        <p className="landing-kicker">{post.tags.join(' · ')}</p>
        <h1>{post.title}</h1>
        <p className="post-meta">
          {formatPostDate(post.date)} · {post.minutes} min read · Divyanshu Tiwari
        </p>
        {post.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  )
}
