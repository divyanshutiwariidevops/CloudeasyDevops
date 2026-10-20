'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { BrandLogo } from '../components/BrandLogo'
import { useApp } from '../context/AppContext'
import { fetchPublicDocs, type PublicDoc } from '../api/docs'
import { formatPostDate } from '../data/blog'

export function Landing() {
  const { isAuthenticated, ready, site } = useApp()
  const [query, setQuery] = useState('')
  const [publicDocs, setPublicDocs] = useState<PublicDoc[]>([])
  const workspaceHref = ready && isAuthenticated ? '/dashboard' : '/login'
  const workspaceLabel = ready && isAuthenticated ? 'Open workspace' : 'Sign in'

  useEffect(() => {
    let cancelled = false
    void fetchPublicDocs()
      .then((data) => {
        if (!cancelled) setPublicDocs(data.docs)
      })
      .catch(() => {
        if (!cancelled) setPublicDocs([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const docs = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return publicDocs
    return publicDocs.filter((doc) => `${doc.title} ${doc.preview}`.toLowerCase().includes(needle))
  }, [publicDocs, query])


  return (
    <div className="landing">
      <header className="landing-nav">
        <Link href="/" className="landing-brand">
          <BrandLogo size={36} />
          <span>{site.brandName}</span>
        </Link>
        <nav className="landing-nav-links">
          <a href="#blog">Blog</a>
          <Link href={workspaceHref} className="landing-signin">
            {workspaceLabel}
          </Link>
        </nav>
      </header>

      <section className="landing-hero">
        <p className="landing-kicker">{site.brandName}</p>
        <h1>{site.headline}</h1>
        <p className="landing-lead">{site.lead}</p>
        <div className="landing-actions">
          <a className="landing-btn landing-btn-primary" href="#blog">
            Browse the blog
          </a>
          <Link className="landing-btn landing-btn-ghost" href={workspaceHref}>
            {workspaceLabel}
          </Link>
        </div>
      </section>

      <section className="landing-blog" id="blog">
        <div className="landing-blog-head">
          <div>
            <p className="landing-kicker">Blog</p>
            <h2>{site.blogTitle}</h2>
          </div>
          <label className="landing-search">
            <i className="bi bi-search" aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search public posts"
              aria-label="Search blog posts"
            />
            {query ? (
              <button type="button" className="landing-search-clear" onClick={() => setQuery('')} aria-label="Clear search">
                <i className="bi bi-x-lg" />
              </button>
            ) : null}
          </label>
        </div>
        <p className="landing-count">
          {docs.length} {docs.length === 1 ? 'post' : 'posts'}
          {query.trim() ? ` for “${query.trim()}”` : ''}
        </p>
        {docs.length === 0 ? (
          <div className="landing-empty">
            <p>{query.trim() ? 'No posts match that search.' : 'No public posts yet. In Documentation, open a file and set it to Public.'}</p>
            {query.trim() ? (
              <button type="button" className="landing-btn landing-btn-ghost" onClick={() => setQuery('')}>
                Show all posts
              </button>
            ) : null}
          </div>
        ) : (
          <div className="blog-grid">
            {docs.map((doc) => (
              <Link key={doc.id} href={`/docs/${doc.id}`} className="blog-card">
                <div className="blog-card-meta">
                  <span>Public</span>
                  <span>{doc.updatedAt ? formatPostDate(doc.updatedAt.slice(0, 10)) : 'Blog'}</span>
                </div>
                <h3>{doc.title || 'Untitled'}</h3>
                <p>{doc.preview || 'Open this post to read it.'}</p>
                <div className="blog-card-foot">
                  <span>Blog</span>
                  <span>Read</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="landing-footer">
        <span>{site.brandName}</span>
        <span>Made by {site.ownerName}</span>
      </footer>
    </div>
  )
}
