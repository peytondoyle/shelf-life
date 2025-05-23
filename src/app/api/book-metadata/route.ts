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
    params.append('limit', '20')
    return `https://openlibrary.org/search.json?${params.toString()}`
  }

  try {
    let res = await fetch(buildUrl(title, author))
    let data = await res.json()

    if (data.docs.length === 0 && title) {
      res = await fetch(buildUrl(title))
      data = await res.json()
    }

    const queryWords = title.toLowerCase().split(/\s+/)

    const scoredDocs = data.docs
      .map((doc: any) => {
        const titleTokens = (doc.title ?? '').toLowerCase().split(/\s+/)
        const titleMatchScore = queryWords.reduce(
          (acc, word) => acc + (titleTokens.includes(word) ? 1 : 0),
          0
        )

        const score =
          titleMatchScore * 2 +
          (doc.edition_count ?? 0) * 0.5 +
          (doc.ratings_average ?? 0) +
          (doc.cover_i ? 1 : 0) + 
          (Array.isArray(doc.language) && doc.language.includes('eng') ? 1 : 0)
        
          return { ...doc, _score: score }
      })
      .sort((a: any, b: any) => b._score - a._score)

    const imageSet = new Set<number>()
    const imageOptions: string[] = []

    for (const doc of scoredDocs) {
    if (doc.cover_i && !imageSet.has(doc.cover_i)) {
        imageSet.add(doc.cover_i)
        imageOptions.push(`https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`)
    }
    if (imageOptions.length >= 4) break
    }

    const bestDoc = scoredDocs[0] ?? data.docs[0]

    const result = {
      title: bestDoc?.title ?? '',
      author: bestDoc?.author_name?.[0] ?? '',
      publishedYear: bestDoc?.first_publish_year ?? null,
      coverImage: bestDoc?.cover_i
        ? `https://covers.openlibrary.org/b/id/${bestDoc.cover_i}-L.jpg`
        : null,
      imageOptions,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Metadata API error:', error)
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 })
  }
}