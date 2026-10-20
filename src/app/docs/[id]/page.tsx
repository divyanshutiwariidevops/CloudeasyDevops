'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BrandLogo } from '../../../components/BrandLogo'
import { useApp } from '../../../context/AppContext'
import { fetchPublicDoc, type PublicDoc } from '../../../api/docs'
import { formatPostDate } from '../../../data/blog'

export default function PublicDocPage() {
  const params = useParams<{ id: string }>()
  const { site } = useApp()
  const [doc, setDoc] = useState<PublicDoc | null>(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    const id = params.id
    if (!id) return
    let cancelled = false
    void fetchPublicDoc(id)
      .then((data) => {
        if (!cancelled) setDoc(data.doc)
      })
      .catch(() => {
        if (!cancelled) setMissing(true)
      })
    return () => {
      cancelled = true
    }
  }, [params.id])

  return (
    <article className="landing post-page">
      <header className="landing-nav">
        <Link href="/" className="landing-brand">
          <BrandLogo size={36} />
          <span>{site.brandName}</span>
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
        {missing ? <h1>This document is private</h1> : null}
        {!doc && !missing ? <p className="post-meta">Loading…</p> : null}
        {doc ? (
          <>
            <p className="landing-kicker">Public documentation</p>
            <h1>{doc.title || 'Untitled'}</h1>
            <p className="post-meta">{doc.updatedAt ? formatPostDate(doc.updatedAt.slice(0, 10)) : ''}</p>
            <div className="post-html" dangerouslySetInnerHTML={{ __html: doc.html || '<p>Empty document.</p>' }} />
          </>
        ) : null}
      </div>
    </article>
  )
}
