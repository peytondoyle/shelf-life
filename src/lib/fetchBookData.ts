// File: src/lib/fetchBookData.ts
import { fetchScores, SiteScore } from './fetchScores'

export type BookMetadata = {
  title: string
  author: string
  publishedYear: number | null
  coverImage: string | null
  imageOptions?: string[] 
  averageScore?: number | null         // <-- add this
  ratingsBreakdown?: SiteScore[]       // <-- and this if you want the detail view to work
}

export async function fetchBookData(title: string, author: string, signal?: AbortSignal): Promise<BookMetadata | null> {
  const scores = await fetchScores(title, author)

  const params = new URLSearchParams()
  if (title) params.append('title', title)
  if (author) params.append('author', author)

  try {
    const res = await fetch(`/api/book-metadata?${params.toString()}`, { signal })
    if (!res.ok) throw new Error(`Failed to fetch metadata: ${res.status}`)

    const data = await res.json()
    return {
      title: data.title || '',
      author: data.author || '',
      publishedYear: data.publishedYear || null,
      coverImage: data.coverImage || null,
      imageOptions: data.imageOptions || [], // ✅ make sure this matches route.ts
      averageScore: scores.average,
      ratingsBreakdown: scores.scores, // optional if you're passing to detail page
    }
  } catch (err) {
    console.error('fetchBookData error:', err)
    return null
  }
}