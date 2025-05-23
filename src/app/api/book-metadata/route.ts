// File: src/app/api/book-metadata/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? ''
  const author = searchParams.get('author') ?? ''

  const buildUrl = (title: string, author?: string) => {
    const params = new URLSearchParams()
    if (title) params.append('title', title)
    if (author) params.append('author', author)
    params.append('limit', '10')
    return `https://openlibrary.org/search.json?${params.toString()}`
  }

  try {
    let res = await fetch(buildUrl(title, author))
    let data = await res.json()

    if (data.docs.length === 0 && title) {
      res = await fetch(buildUrl(title))
      data = await res.json()
    }
    
    const scoredDocs = data.docs.map((doc: any) => {
    const score =
        (doc.edition_count ?? 0) * 1.5 +
        (doc.ratings_average ?? 0) * 2 +
        (doc.has_fulltext ? 1 : 0) +
        (doc.isbn?.length ?? 0) * 0.5
    return { ...doc, _score: score }
    }).sort((a: any, b: any) => b._score - a._score)

    const imageOptions = scoredDocs
    .filter((doc: any) => doc.cover_i)
    .slice(0, 5)
    .map((doc: any) => `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`)

    const bestDoc = scoredDocs[0] ?? data.docs[0]
    const result = {
      title: bestDoc?.title ?? '',
      author: bestDoc?.author_name?.[0] ?? '',
      publishedYear: bestDoc?.first_publish_year ?? null,
      coverImage: bestDoc?.cover_i ? `https://covers.openlibrary.org/b/id/${bestDoc.cover_i}-L.jpg` : null,
      imageOptions,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Metadata API error:', error)
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 })
  }
}