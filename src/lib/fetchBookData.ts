// File: src/lib/fetchBookData.ts
export type BookMetadata = {
  title: string
  author: string
  publishedYear: number | null
  coverImage: string | null
  imageOptions?: string[]
}

export async function fetchBookData(title: string, author: string, signal?: AbortSignal): Promise<BookMetadata | null> {
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
    }
  } catch (err) {
    console.error('fetchBookData error:', err)
    return null
  }
}