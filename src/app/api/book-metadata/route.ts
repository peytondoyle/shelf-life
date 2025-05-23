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
    params.append('limit', '1')
    return `https://openlibrary.org/search.json?${params.toString()}`
  }

  try {
    let res = await fetch(buildUrl(title, author))
    let data = await res.json()

    if (data.docs.length === 0 && title) {
      res = await fetch(buildUrl(title))
      data = await res.json()
    }

    const doc = data.docs?.[0]
    if (!doc) return NextResponse.json({}, { status: 200 })

    const result = {
      title: doc.title ?? '',
      author: doc.author_name?.[0] ?? '',
      publishedYear: doc.first_publish_year ?? null,
      coverImage: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
        : null,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Metadata API error:', error)
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 })
  }
}